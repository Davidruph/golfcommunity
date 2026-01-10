import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const connection = await pool.getConnection()

  try {
    const body = await req.json()
    const { id } = await params
    const { type } = body

    // Check if community exists
    const [existingCommunityCaptain] = (await connection.query(
      'SELECT id FROM community_members WHERE id = ?',
      [id]
    )) as [Array<{ id: number }>, unknown]

    if (!existingCommunityCaptain || existingCommunityCaptain.length === 0) {
      connection.release()
      return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }

    let message = ''

    if (type === 'disable') {
      // Disable community
      await connection.query('UPDATE community_members SET is_active = 0 WHERE id = ?', [id])
      message = 'Community Captain disabled successfully'
    } else if (type === 'enable') {
      // Enable community
      await connection.query('UPDATE community_members SET is_active = 1 WHERE id = ?', [id])
      message = 'Community Captain enabled successfully'
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
    console.error('Community captain update error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during update',
      },
      { status: 500 }
    )
  }
}
