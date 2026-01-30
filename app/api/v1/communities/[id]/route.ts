import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import type { RowDataPacket } from 'mysql2'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const connection = await pool.getConnection()

  try {
    const { id } = await params
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

    // Fetch community by ID
    const [community] = (await connection.query(
      `SELECT c.*, cm.*, COUNT(DISTINCT cm.id) as member_count
       FROM communities c
       LEFT JOIN community_members cm ON c.id = cm.community_id
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    )) as [Array<RowDataPacket>, unknown]

    connection.release()

    if (!community || community.length === 0) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }

    return NextResponse.json({ data: community[0] }, { status: 200 })
  } catch (err: unknown) {
    connection.release()
    console.error('Community fetch error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during fetch',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const connection = await pool.getConnection()

  try {
    const body = await req.json()
    const { id } = await params
    const { type } = body

    // Check if community exists
    const [existingCommunity] = (await connection.query('SELECT id FROM communities WHERE id = ?', [
      id,
    ])) as [Array<{ id: number }>, unknown]

    if (!existingCommunity || existingCommunity.length === 0) {
      connection.release()
      return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }

    let message = ''

    if (type === 'disable') {
      // Disable community
      await connection.query('UPDATE communities SET is_active = 0, status = 0 WHERE id = ?', [id])
      message = 'Community disabled successfully'
    } else if (type === 'enable') {
      // Enable community
      await connection.query('UPDATE communities SET is_active = 1, status = 1 WHERE id = ?', [id])
      message = 'Community enabled successfully'
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
        communityId: id,
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
