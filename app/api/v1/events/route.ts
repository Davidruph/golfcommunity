import pool from '@/lib/db'
import jwt from 'jsonwebtoken'
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
    const filter = searchParams.get('filter') || ''

    const offset = (page - 1) * limit

    // Build WHERE clause
    const conditions: string[] = []
    const params: (string | number)[] = []

    if (search) {
      conditions.push(
        '(events.event_name LIKE ? OR events.location LIKE ? OR events.timezone LIKE ? OR events.event_date LIKE ? OR events.course_name LIKE ? OR events.description LIKE ?)'
      )
      const searchPattern = `%${search}%`
      params.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern
      )
    }

    if (status) {
      conditions.push('events.status = ?')
      params.push(parseInt(status))
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM events 
      LEFT JOIN event_attendees ON events.id = event_attendees.event_id 
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
        events.*, 
        COUNT(event_attendees.id) AS registered_spots,
       SUM(CASE WHEN event_attendees.user_id IS NOT NULL THEN 1 ELSE 0 END) AS user_event_status
      FROM events 
      LEFT JOIN event_attendees ON events.id = event_attendees.event_id 
      ${whereClause}
      ORDER BY events.created_at ASC
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
    const event_name = formData.eventName as string
    const community = formData.community as string
    const location = formData.location as string
    const timezone = formData.timezone as string
    const event_date = formData.eventDate as string
    const event_time = formData.eventTime as string
    const course_name = formData.courseName as string
    const description = formData.description as string
    const bannerImage = formData.bannerImage as string | null
    const created_by = decoded.userId
    const fees = formData.fees as string | null
    const feeLink = formData.feeLink as string | null
    const totalAllowedSpots = formData.totalAllowedSpots as number | null

    // Validate required fields
    if (
      !event_name ||
      !community ||
      !location ||
      !timezone ||
      !event_date ||
      !event_time ||
      !course_name ||
      !description ||
      totalAllowedSpots === null
    ) {
      connection.release()
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    //check for duplicate campaign title
    if (event_name) {
      const [existingEvent] = (await connection.query(
        'SELECT id FROM events WHERE event_name = ?',
        [event_name]
      )) as [Array<RowDataPacket>, unknown]

      if (existingEvent && existingEvent.length > 0) {
        connection.release()
        return NextResponse.json({ error: 'Event with this name already exists' }, { status: 409 })
      }
    }

    // Insert into database
    const eventData = {
      event_name,
      community,
      location,
      timezone,
      event_date,
      event_time,
      course_name,
      description,
      banner_image: bannerImage,
      status: 1,
      created_by,
      fees,
      fee_link: feeLink,
      total_allowed_spots: totalAllowedSpots,
    }

    const [result] = (await connection.query('INSERT INTO events SET ?', eventData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    await connection.query('INSERT INTO event_attendees (event_id, user_id) VALUES (?, ?)', [
      result.insertId,
      created_by,
    ])

    connection.release()

    return NextResponse.json(
      {
        message: 'Event created successfully',
        eventId: result.insertId,
        bannerImage,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Event creation error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during event creation',
      },
      { status: 500 }
    )
  }
}
