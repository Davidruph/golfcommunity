import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { unlink } from 'fs/promises'

export async function GET(request: Request) {
  let connection
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const timezoneFilter = searchParams.get('timezone') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const statusFilter = searchParams.get('status') || ''
    const activityFilter = searchParams.get('activity') || ''
    const offset = (page - 1) * limit

    connection = await pool.getConnection()

    // Build the WHERE clause
    const whereConditions: string[] = []
    const queryParams: unknown[] = []

    if (search) {
      whereConditions.push(
        '(communities.name LIKE ? OR communities.description LIKE ? OR captain_user.email LIKE ?)'
      )
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (timezoneFilter) {
      whereConditions.push('communities.timezone = ?')
      queryParams.push(timezoneFilter)
    }

    if (statusFilter) {
      whereConditions.push('communities.status = ?')
      queryParams.push(statusFilter)
    }

    if (activityFilter) {
      whereConditions.push('community_members.activity = ?')
      queryParams.push(activityFilter)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Base query with all joins
    const baseQuery = `
      FROM communities 
      LEFT JOIN community_members ON communities.id = community_members.community_id
      LEFT JOIN community_members captain_members ON communities.id = captain_members.community_id 
        AND captain_members.role = 'captain'
      LEFT JOIN users captain_user ON captain_members.user_id = captain_user.id
    `

    // Get total count for pagination
    const [countResult] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT communities.id) as total 
       ${baseQuery}
       ${whereClause}`,
      queryParams
    )
    const total = countResult[0].total

    // Get paginated data with community count
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT 
        communities.*,
        community_members.activity,
        community_members.user_id as member_user_id,
        COUNT(DISTINCT community_members.user_id) as members_count,
        captain_user.email as captain_email
       ${baseQuery}
       ${whereClause}
       GROUP BY communities.id, captain_user.email
       ORDER BY communities.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    )

    console.log('Fetched communities:', rows)

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
  } catch (err) {
    console.error('Communities fetch error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection()

  try {
    const formData = await req.formData()
    const body = Object.fromEntries(formData.entries())

    // Check if user already exists
    const [existingCommunity] = (await connection.query(
      'SELECT id FROM communities WHERE name = ?',
      [body.name]
    )) as [Array<{ id: number }>, unknown]

    if (existingCommunity && existingCommunity.length > 0) {
      connection.release()
      return NextResponse.json(
        { error: 'Community with this name already exists' },
        { status: 409 }
      )
    }

    let imagePath = ''
    if (body.bannerImage) {
      const bannerImage = formData.get('bannerImage') as File
      const bytes = await bannerImage.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}-${bannerImage.name}`
      const filepath = join(process.cwd(), 'public', 'uploads', 'communities', filename)

      // Save file to public directory
      await writeFile(filepath, buffer)
      imagePath = `/uploads/communities/${filename}`
    }

    // Prepare user data
    const communityData = {
      name: body.name,
      description: body.description,
      timezone: body.timezone,
      status: 1,
      created_by: body.created_by,
      is_active: 1,
      banner_image: imagePath,
    }

    // Insert user
    const [Result] = (await connection.query('INSERT INTO communities SET ?', communityData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    const communityId = Result.insertId

    // Add captain as community member
    await connection.query(
      'INSERT INTO community_members (community_id, user_id, role, activity) VALUES (?, ?, ?, ?)',
      [communityId, body.captain, 'captain', 'low']
    )

    connection.release()

    return NextResponse.json(
      {
        message: 'Community registered successfully',
        communityId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Registration error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during registration',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const connection = await pool.getConnection()

  try {
    const formData = await req.formData()
    const body = Object.fromEntries(formData.entries())

    console.log('PATCH body:', body)

    // Check if user already exists
    const [existingCommunities] = (await connection.query(
      'SELECT * FROM communities WHERE name = ? AND id != ?',
      [body.name, body.id]
    )) as [Array<RowDataPacket>, unknown]

    if (existingCommunities && existingCommunities.length > 0) {
      connection.release()
      return NextResponse.json(
        { error: 'Community with this name already exists' },
        { status: 409 }
      )
    }

    const [existingCommunity] = (await connection.query('SELECT * FROM communities WHERE id = ?', [
      body.id,
    ])) as [Array<RowDataPacket>, unknown]

    if (!existingCommunity || existingCommunity.length === 0) {
      connection.release()
      return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }

    console.log('Existing communities for update check:', existingCommunity)

    const existingCommunityData = existingCommunity[0]

    const bannerImage = formData.get('bannerImage') as File | null

    // Handle banner image
    let imagePath = existingCommunityData.banner_image

    // Check if new image is provided and is a File (not just the existing path)
    if (bannerImage && bannerImage instanceof File && bannerImage.size > 0) {
      // Upload new image
      const bytes = await bannerImage.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}-${bannerImage.name}`
      const filepath = join(process.cwd(), 'public', 'uploads', 'communities', filename)

      // Save file to public directory
      await writeFile(filepath, buffer)
      imagePath = `/uploads/communities/${filename}`

      // Delete old image if it exists
      if (existingCommunityData.banner_image) {
        try {
          const oldImagePath = join(process.cwd(), 'public', existingCommunityData.banner_image)
          await unlink(oldImagePath)
          console.log('Old image deleted:', existingCommunityData.banner_image)
        } catch (err) {
          console.error('Error deleting old image:', err)
          // Continue even if deletion fails
        }
      }
    }

    // Prepare user data
    const communityData = {
      name: body.name,
      description: body.description,
      timezone: body.timezone,
      banner_image: imagePath,
    }

    // Insert user
    const [Result] = (await connection.query('UPDATE communities SET ? WHERE id = ?', [
      communityData,
      body.id,
    ])) as [{ insertId: number; affectedRows: number }, unknown]

    const communityId = body.id

    // Update captain: try UPDATE first, if no rows affected then INSERT
    const [updateResult] = (await connection.query(
      'UPDATE community_members SET user_id = ? WHERE community_id = ? AND role = ?',
      [body.captain, communityId, 'captain']
    )) as [{ affectedRows: number }, unknown]

    // If no rows were updated, insert new captain
    if (updateResult.affectedRows === 0) {
      await connection.query(
        'INSERT INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)',
        [communityId, body.captain, 'captain']
      )
    }

    connection.release()

    return NextResponse.json(
      {
        message: 'Community registered successfully',
        communityId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Registration error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during registration',
      },
      { status: 500 }
    )
  }
}
