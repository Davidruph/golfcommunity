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
        '(instructors.teaching_specialty LIKE ? OR instructors.price_per_hour LIKE ? OR instructors.experience_level LIKE ? OR instructors.teaching_philosophy LIKE ?)'
      )
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)
    }

    if (status) {
      conditions.push('instructors.status = ?')
      params.push(parseInt(status))
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count - count distinct events only
    const countQuery = `
      SELECT COUNT(DISTINCT instructors.id) as total 
      FROM instructors 
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
        instructors.*, 
        ${currentUserId ? `MAX(CASE WHEN instructors.user_id = ${currentUserId} THEN 1 ELSE 0 END)` : '0'} AS user_is_creator,
        CONCAT(users.first_name, ' ', users.last_name) AS instructor_name
      FROM instructors 
      LEFT JOIN users ON instructors.user_id = users.id
      ${whereClause}
      GROUP BY instructors.id
      ORDER BY instructors.created_on DESC
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
    const teaching_specialty = formData.teachingSpecialty as string
    const price_per_hour = formData.pricePerHour as number
    const experience_level = formData.experienceLevel as string
    const teaching_philosophy = formData.teachingPhilosophy as string
    const avatar = formData.avatar as string
    const created_by = decoded.userId

    // Validate required fields
    if (
      !teaching_specialty ||
      !price_per_hour ||
      !experience_level ||
      !teaching_philosophy ||
      !avatar
    ) {
      connection.release()
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    //check for duplicate campaign title
    if (teaching_specialty) {
      const [existing_specialty] = (await connection.query(
        'SELECT id FROM instructors WHERE teaching_specialty = ? AND id = ?',
        [teaching_specialty, created_by]
      )) as [Array<RowDataPacket>, unknown]

      if (existing_specialty && existing_specialty.length > 0) {
        connection.release()
        return NextResponse.json(
          { error: 'Instructor with this specialty already exists' },
          { status: 409 }
        )
      }
    }

    // Insert into database
    const eventData = {
      teaching_specialty,
      price_per_hour,
      experience_level,
      teaching_philosophy,
      avatar,
      status: 0,
      user_id: created_by,
    }

    const [result] = (await connection.query('INSERT INTO instructors SET ?', eventData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    connection.release()

    return NextResponse.json(
      {
        message: 'Instructor created successfully',
        instructorId: result.insertId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Instructor creation error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during instructor creation',
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
