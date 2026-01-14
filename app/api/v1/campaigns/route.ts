import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'

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
        data: rows,
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
    const formData = await req.json()

    // Extract fields
    const sponsoredKids = formData.sponsoredKids as string
    const targetAmount = formData.targetAmount as string
    const description = formData.description as string
    const deadline = formData.deadline as string
    const campaignTitle = formData.campaignTitle as string
    const bannerImage = formData.bannerImage as File | null

    console.log('Received campaign data:', {
      sponsoredKids,
      targetAmount,
      description,
      bannerImage,
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

    // Insert into database
    const campaignData = {
      sponsored_kid: parseInt(sponsoredKids),
      target_amount: parseFloat(targetAmount),
      description,
      banner_image: bannerImage,
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
        bannerImage,
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
