import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const connection = await pool.getConnection()

  try {
    const body = await req.json()
    const { id } = await params
    const { type } = body

    // Check if user exists
    const [existingUser] = (await connection.query('SELECT id FROM users WHERE id = ?', [id])) as [
      Array<{ id: number }>,
      unknown,
    ]

    if (!existingUser || existingUser.length === 0) {
      connection.release()
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    let message = ''

    if (type === 'disable') {
      // Disable community
      await connection.query('UPDATE users SET status = 0 WHERE id = ?', [id])
      message = 'User disabled successfully'
    } else if (type === 'enable') {
      // Enable Users
      await connection.query('UPDATE users SET status = 1 WHERE id = ?', [id])
      message = 'User enabled successfully'
    } else {
      connection.release()
      return NextResponse.json(
        { error: 'Invalid type. Use "disable" or "enable"' },
        { status: 400 }
      )
    }

    connection.release()

    return NextResponse.json(
      {
        message,
        userId: id,
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Community update error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during update',
      },
      { status: 500 }
    )
  }
}
