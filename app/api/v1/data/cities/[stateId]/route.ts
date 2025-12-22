import pool from '@/lib/db'
import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'

export async function GET(request: Request, { params }: { params: Promise<{ stateId: string }> }) {
  let connection
  try {
    const { stateId } = await params
    connection = await pool.getConnection()
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM cities WHERE state_id = ? ORDER BY name ASC',
      [stateId]
    )
    return NextResponse.json(rows, { status: 200 })
  } catch (err) {
    console.error('States fetch error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}
