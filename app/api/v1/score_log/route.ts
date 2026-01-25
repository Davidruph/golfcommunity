import pool from '@/lib/db'
import jwt from 'jsonwebtoken'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'

export async function GET(request: Request) {
  let connection

  try {
    connection = await pool.getConnection()

    // Get current user from token
    const token =
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]

    let currentUserId = null
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
      currentUserId = decoded.userId
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse URL parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const filter = searchParams.get('filter') || ''

    const offset = (page - 1) * limit

    // Build WHERE clause
    const conditions: string[] = []
    const params: (string | number)[] = []

    if (search) {
      conditions.push('(score_logs.match_type LIKE ? OR score_logs.course_name LIKE ?)')
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern)
    }

    if (status) {
      conditions.push('score_logs.status = ?')
      params.push(parseInt(status))
    }

    if (currentUserId) {
      conditions.push('score_logs.user_id = ?')
      params.push(currentUserId)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count - count distinct events only
    const countQuery = `
  SELECT COUNT(DISTINCT score_logs.id) AS total
  FROM score_logs
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
    score_logs.*,
    events.event_name AS event_name_display
  FROM score_logs
  LEFT JOIN events ON score_logs.event_name = events.id
  ${whereClause}
  GROUP BY score_logs.id
  ORDER BY score_logs.created_at DESC
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
    console.error('Score log fetch error:', err)

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
    const token =
      req.cookies.get('auth-token')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number
      email: string
      role: string
    }

    console.log('Decoded JWT:', decoded)

    // Get FormData instead of JSON
    const formData = await req.json()

    // Extract fields
    const event_name = formData.eventName as number
    const match_type = formData.matchType as string
    const gross_score = formData.grossScore as number
    const fairway_hits = formData.fairwayHits as number
    const greens_in_reg = formData.greensInReg as number
    const putt_per_round = formData.puttPerRound as number
    const course_name = formData.courseName as string
    const score_card = formData.scoreCard as string
    const user_id = decoded.userId

    // Validate required fields
    if (!event_name || !match_type || !gross_score || !course_name) {
      connection.release()
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Insert into database
    const scoreLogData = {
      event_name,
      match_type,
      gross_score,
      fairway_hits,
      greens_in_reg,
      putt_per_round,
      course_name,
      score_card,
      status: 1,
      user_id,
    }

    const [result] = (await connection.query('INSERT INTO score_logs SET ?', scoreLogData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    connection.release()

    return NextResponse.json(
      {
        message: 'Score log created successfully',
        scoreLogId: result.insertId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Score log creation error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during score log creation',
      },
      { status: 500 }
    )
  }
}
