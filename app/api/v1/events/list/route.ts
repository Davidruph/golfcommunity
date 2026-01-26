import pool from '@/lib/db'
import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
  let connection
  try {
    const token =
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]

    let currentUserId = null
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
      currentUserId = decoded.userId
    }

    connection = await pool.getConnection()
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT *,  ${currentUserId ? `MAX(CASE WHEN event_attendees.user_id = ${currentUserId} THEN 1 ELSE 0 END)` : '0'} AS user_event_status, events.id as main_event_id FROM events LEFT JOIN event_attendees ON events.id = event_attendees.event_id  GROUP BY events.id ORDER BY event_name ASC`
    )
    return NextResponse.json(rows, { status: 200 })
  } catch (err) {
    console.error('Event fetch error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}
