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
      conditions.push(
        '(news_topics.topic_title LIKE ? OR news_topics.category LIKE ? OR news_topics.discussion_details LIKE ?)'
      )
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern)
    }

    if (status) {
      conditions.push('news_topics.status = ?')
      params.push(parseInt(status))
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count - count distinct events only
    const countQuery = `
      SELECT COUNT(DISTINCT news_topics.id) as total 
      FROM news_topics 
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
        news_topics.*, 
        ${currentUserId ? `MAX(CASE WHEN news_topics.user_id = ${currentUserId} THEN 1 ELSE 0 END)` : '0'} AS user_is_creator,
        CONCAT(users.first_name, ' ', users.last_name) AS poster_name,
        COUNT(DISTINCT news_comments.id) AS comments_count,
        COUNT(DISTINCT news_likes.id) AS likes_count,
        MAX(CASE WHEN news_likes.user_id = ${currentUserId || 0} THEN 1 ELSE 0 END) AS user_has_liked
      FROM news_topics 
      LEFT JOIN users ON news_topics.user_id = users.id
      LEFT JOIN news_comments ON news_topics.id = news_comments.news_topic_id
      LEFT JOIN news_likes ON news_topics.id = news_likes.news_topic_id
      ${whereClause}
      GROUP BY news_topics.id
      ORDER BY news_topics.created_at DESC
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
    console.error('Instructor fetch error:', err)

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
    const topic_title = formData.topicTitle as string
    const category = formData.category as number
    const discussion_details = formData.discussionDetails as string
    const topic_image = formData.topicImage as string
    const user_id = decoded.userId

    // Validate required fields
    if (!topic_title || !category || !discussion_details) {
      connection.release()
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Insert into database
    const topicData = {
      topic_title,
      category,
      discussion_details,
      topic_image,
      status: 1,
      user_id,
    }

    const [result] = (await connection.query('INSERT INTO news_topics SET ?', topicData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    connection.release()

    return NextResponse.json(
      {
        message: 'News topic created successfully',
        topicId: result.insertId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('News topic creation error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during news topic creation',
      },
      { status: 500 }
    )
  }
}
