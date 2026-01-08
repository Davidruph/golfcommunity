import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'

export async function GET() {
  let connection
  try {
    connection = await pool.getConnection()
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM community_settings where is_admin_setting = 1'
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

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection()

  try {
    const body = await req.json()
    const { id, ...data } = body
    console.log('Received data:', data)

    if (id) {
      // UPDATE existing record
      await connection.query(
        'UPDATE community_settings SET timezone = ?, max_members = ?, require_captain_approval = ? WHERE id = ?',
        [data.timezone, data.maxMembers, data.requireCaptainApproval, id]
      )
      return NextResponse.json({ message: 'Updated successfully', id }, { status: 200 })
    } else {
      // INSERT new record
      const [result] = (await connection.query(
        'INSERT INTO community_settings (timezone, max_members, require_captain_approval, created_by, is_admin_setting) VALUES (?, ?, ?, ?, ?)',
        [data.timezone, data.maxMembers, data.requireCaptainApproval, data.created_by, 1]
      )) as [{ insertId: number; affectedRows: number }, unknown]

      return NextResponse.json(
        { message: 'Created successfully', id: result.insertId },
        { status: 201 }
      )
    }
  } catch (err: unknown) {
    connection.release()
    console.error('Registration error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during registration',
      },
      { status: 500 }
    )
  }
}
