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
        '(golf_tips.tip_title LIKE ? OR golf_tips.category LIKE ? OR golf_tips.skill_level LIKE ? OR golf_tips.one_sentence_summary LIKE ? OR golf_tips.description LIKE ?)'
      )
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern)
    }

    if (status) {
      conditions.push('golf_tips.status = ?')
      params.push(parseInt(status))
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count - count distinct events only
    const countQuery = `
      SELECT COUNT(DISTINCT golf_tips.id) as total 
      FROM golf_tips 
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
        golf_tips.*, 
        ${currentUserId ? `MAX(CASE WHEN golf_tips.created_by = ${currentUserId} THEN 1 ELSE 0 END)` : '0'} AS user_is_creator,
        CONCAT(users.first_name, ' ', users.last_name) AS poster_name
      FROM golf_tips 
      LEFT JOIN users ON golf_tips.created_by = users.id
      ${whereClause}
      GROUP BY golf_tips.id
      ORDER BY golf_tips.created_at DESC
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
    console.error('Tip fetch error:', err)

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
    const tip_title = formData.tipTitle as string
    const skill_level = formData.skillLevel as string
    const category = formData.category as string
    const one_sentence_summary = formData.oneSentenceSummary as string
    const description = formData.description as string
    const banner_image = formData.bannerImage as string
    const created_by = decoded.userId

    // Validate required fields
    if (!tip_title || !skill_level || !category || !one_sentence_summary || !description) {
      connection.release()
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    //check for duplicate campaign title
    if (tip_title) {
      const [existingTip] = (await connection.query(
        'SELECT id FROM golf_tips WHERE tip_title = ?',
        [tip_title]
      )) as [Array<RowDataPacket>, unknown]

      if (existingTip && existingTip.length > 0) {
        connection.release()
        return NextResponse.json({ error: 'Tip with this title already exists' }, { status: 409 })
      }
    }

    // Insert into database
    const eventData = {
      tip_title,
      skill_level,
      category,
      one_sentence_summary,
      description,
      banner_image,
      status: 1,
      created_by,
    }

    const [result] = (await connection.query('INSERT INTO golf_tips SET ?', eventData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    connection.release()

    return NextResponse.json(
      {
        message: 'Tip created successfully',
        tipId: result.insertId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Tip creation error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during tip creation',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
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
    const tip_title = formData.tipTitle as string
    const skill_level = formData.skillLevel as string
    const category = formData.category as string
    const one_sentence_summary = formData.oneSentenceSummary as string
    const description = formData.description as string
    const banner_image = formData.bannerImage as string
    const created_by = decoded.userId
    const tipId = formData.id as number

    // Validate required fields
    if (!tip_title || !skill_level || !category || !one_sentence_summary || !description) {
      connection.release()
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    //check for duplicate campaign title
    if (tip_title) {
      const [existingTip] = (await connection.query(
        'SELECT id FROM golf_tips WHERE tip_title = ? AND id != ?',
        [tip_title, tipId]
      )) as [Array<RowDataPacket>, unknown]

      if (existingTip && existingTip.length > 0) {
        connection.release()
        return NextResponse.json({ error: 'Tip with this title already exists' }, { status: 409 })
      }
    }

    // Insert into database
    const eventData = {
      tip_title,
      skill_level,
      category,
      one_sentence_summary,
      description,
      banner_image,
      status: 1,
      created_by,
    }

    const [result] = (await connection.query('UPDATE golf_tips SET ? WHERE id = ?', [
      eventData,
      tipId,
    ])) as [{ affectedRows: number }, unknown]

    if (result.affectedRows === 0) {
      connection.release()
      return NextResponse.json({ error: 'Tip not found' }, { status: 404 })
    }

    connection.release()

    return NextResponse.json(
      {
        message: 'Tip updated successfully',
        tipId: tipId,
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Tip update error:', err)
    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during tip update',
      },
      { status: 500 }
    )
  }
}
