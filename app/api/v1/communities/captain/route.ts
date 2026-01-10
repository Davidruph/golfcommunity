import pool from '@/lib/db'
import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'

export async function GET(request: Request) {
  let connection
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const activityFilter = searchParams.get('activity') || ''
    const offset = (page - 1) * limit

    connection = await pool.getConnection()

    // Build the WHERE clause
    const whereConditions: string[] = ['captain_members.role = "captain"']
    const queryParams: unknown[] = []

    if (search) {
      whereConditions.push(
        '(captain_user.first_name LIKE ? OR captain_user.last_name LIKE ? OR captain_user.email LIKE ? OR communities.name LIKE ?)'
      )
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (activityFilter) {
      whereConditions.push('captain_members.activity = ?')
      queryParams.push(activityFilter)
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`

    // Base query with all joins
    const baseQuery = `
      FROM community_members captain_members
      INNER JOIN users captain_user ON captain_members.user_id = captain_user.id
      LEFT JOIN communities ON captain_members.community_id = communities.id
      LEFT JOIN community_members all_members ON communities.id = all_members.community_id
      LEFT JOIN posts ON communities.id = posts.community_id
    `

    // Get total count for pagination
    const [countResult] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT captain_user.id) as total 
       ${baseQuery}
       ${whereClause}`,
      queryParams
    )
    const total = countResult[0].total

    // Get paginated captain data with aggregated stats
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT 
        captain_user.id as captain_id,
        captain_user.first_name as captain_first_name,
        captain_user.last_name as captain_last_name,
        captain_user.email as captain_email,
        captain_members.activity,
        captain_members.is_active,
        COUNT(DISTINCT communities.id) as communities_count,
        SUM(
          (SELECT COUNT(DISTINCT cm.user_id) 
           FROM community_members cm 
           WHERE cm.community_id = communities.id)
        ) as total_members,
        COUNT(DISTINCT posts.id) as post_count
       ${baseQuery}
       ${whereClause}
       GROUP BY captain_user.id, captain_user.first_name, captain_user.email, captain_members.activity
       ORDER BY communities_count DESC, captain_user.first_name ASC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    )

    console.log('Fetched captains:', rows)

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
    console.error('Captains fetch error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}
