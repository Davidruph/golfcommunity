import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'

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
      whereConditions.push('communities.activity = ?')
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
    const body = await req.json()

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

    // Prepare user data
    const communityData = {
      name: body.name,
      description: body.description,
      timezone: body.timezone,
      status: 1,
      created_by: body.created_by,
      is_active: 1,
    }

    // Insert user
    const [Result] = (await connection.query('INSERT INTO communities SET ?', communityData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    const communityId = Result.insertId

    // Add captain as community member
    await connection.query(
      'INSERT INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)',
      [communityId, body.captain, 'captain']
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
