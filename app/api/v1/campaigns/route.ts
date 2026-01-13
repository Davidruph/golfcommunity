import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: Request) {
  let connection

  try {
    connection = await pool.getConnection()

    // Parse URL parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'DESC'

    const offset = (page - 1) * limit

    // Build WHERE clause
    const conditions: string[] = []
    const params: (string | number)[] = []

    if (search) {
      conditions.push(
        '(campaigns.campaign_title LIKE ? OR users.first_name LIKE ? OR users.last_name LIKE ? OR users.email LIKE ?)'
      )
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)
    }

    if (status) {
      conditions.push('campaigns.status = ?')
      params.push(parseInt(status))
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM campaigns 
      LEFT JOIN users ON campaigns.sponsored_kid = users.id 
      ${whereClause}
    `
    const [countResult] = (await connection.query(countQuery, params)) as [
      Array<RowDataPacket>,
      unknown,
    ]
    const total = countResult[0].total

    // Get paginated data
    const dataQuery = `
      SELECT 
        campaigns.id, 
        campaigns.campaign_title, 
        campaigns.sponsored_kid, 
        campaigns.target_amount, 
        campaigns.description, 
        campaigns.banner_image, 
        campaigns.status, 
        campaigns.deadline, 
        campaigns.created_at,
        users.first_name, 
        users.last_name, 
        users.email
      FROM campaigns 
      LEFT JOIN users ON campaigns.sponsored_kid = users.id 
      ${whereClause}
      ORDER BY campaigns.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `
    const [rows] = (await connection.query(dataQuery, [...params, limit, offset])) as [
      Array<RowDataPacket>,
      unknown,
    ]

    connection.release()

    return NextResponse.json(
      {
        campaigns: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    connection?.release()
    console.error('Campaign fetch error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during fetch',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection()

  try {
    // Get FormData instead of JSON
    const formData = await req.formData()

    // Extract fields
    const sponsoredKids = formData.get('sponsoredKids') as string
    const targetAmount = formData.get('targetAmount') as string
    const description = formData.get('description') as string
    const deadline = formData.get('deadline') as string
    const campaignTitle = formData.get('campaignTitle') as string
    const bannerImage = formData.get('bannerImage') as File | null

    console.log('Received campaign data:', {
      sponsoredKids,
      targetAmount,
      description,
      bannerImage: bannerImage?.name,
      deadline,
      campaignTitle,
    })

    // Validate required fields
    if (!sponsoredKids || !targetAmount || !description || !bannerImage || !deadline) {
      connection.release()
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    //check for duplicate campaign title
    if (campaignTitle) {
      const [existingCampaign] = (await connection.query(
        'SELECT id FROM campaigns WHERE campaign_title = ?',
        [campaignTitle]
      )) as [Array<RowDataPacket>, unknown]

      if (existingCampaign && existingCampaign.length > 0) {
        connection.release()
        return NextResponse.json(
          { error: 'Campaign with this title already exists' },
          { status: 409 }
        )
      }
    }

    // Process and save the image
    let imagePath = ''
    if (bannerImage) {
      const bytes = await bannerImage.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}-${bannerImage.name}`
      const filepath = join(process.cwd(), 'public', 'uploads', 'campaigns', filename)

      // Save file to public directory
      await writeFile(filepath, buffer)
      imagePath = `/uploads/campaigns/${filename}`
    }

    // Insert into database
    const campaignData = {
      sponsored_kid: parseInt(sponsoredKids),
      target_amount: parseFloat(targetAmount),
      description,
      banner_image: imagePath,
      status: 1,
      deadline: new Date(deadline),
      campaign_title: campaignTitle,
    }

    const [result] = (await connection.query('INSERT INTO campaigns SET ?', campaignData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    connection.release()

    return NextResponse.json(
      {
        message: 'Campaign created successfully',
        campaignId: result.insertId,
        imagePath,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Campaign creation error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during campaign creation',
      },
      { status: 500 }
    )
  }
}
