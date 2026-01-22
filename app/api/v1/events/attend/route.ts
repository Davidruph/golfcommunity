import pool from '@/lib/db'
import jwt from 'jsonwebtoken'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'

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
    const event_id = formData.eventId as number

    // Validate required fields
    if (event_id === null) {
      connection.release()
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    //check for duplicate campaign title
    if (event_id) {
      const [existingattendance] = (await connection.query(
        'SELECT id FROM event_attendees WHERE event_id = ? AND user_id = ?',
        [event_id, decoded.userId]
      )) as [Array<RowDataPacket>, unknown]

      if (existingattendance && existingattendance.length > 0) {
        connection.release()
        return NextResponse.json(
          { error: 'You already registered for this event' },
          { status: 409 }
        )
      }
    }

    // Insert into database
    const eventData = {
      event_id,
      user_id: decoded.userId,
    }

    const [result] = (await connection.query('INSERT INTO event_attendees SET ?', eventData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    connection.release()

    return NextResponse.json(
      {
        message: 'Event attendance registered successfully',
        eventId: result.insertId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Event attendance registration error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message:
          (err as Error)?.message || 'An error occurred during event attendance registration',
      },
      { status: 500 }
    )
  }
}
