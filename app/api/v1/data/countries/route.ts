import pool from '@/lib/db'
import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'

export async function GET() {
  let connection
  try {
    connection = await pool.getConnection()
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM countries ORDER BY name ASC'
    )
    return NextResponse.json(rows, { status: 200 })
  } catch (err) {
    console.error('Countries fetch error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}
