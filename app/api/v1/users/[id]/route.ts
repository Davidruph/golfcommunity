import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const connection = await pool.getConnection()
  try {
    const { id } = await params
    // Check if user exists
    const [existingUser] = (await connection.query('SELECT id FROM users WHERE id = ?', [id])) as [
      Array<{ id: number }>,
      unknown,
    ]

    if (!existingUser || existingUser.length === 0) {
      connection.release()
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const [existingUserRole] = (await connection.query(
      'SELECT id FROM user_roles WHERE user_id = ?',
      [id]
    )) as [Array<{ id: number }>, unknown]

    if (existingUserRole && existingUserRole.length > 0) {
      await connection.query('DELETE FROM user_roles WHERE user_id = ?', [id])
    }

    const [existingCommunityMember] = (await connection.query(
      'SELECT id FROM community_members WHERE user_id = ?',
      [id]
    )) as [Array<{ id: number }>, unknown]

    if (existingCommunityMember && existingCommunityMember.length > 0) {
      await connection.query('DELETE FROM community_members WHERE user_id = ?', [id])
    }

    await connection.query('DELETE FROM users WHERE id = ?', [id])

    connection.release()

    return NextResponse.json(
      {
        message: 'User deleted successfully',
        userId: id,
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('User deletion error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during deletion',
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
    const first_name = body.firstName
    const last_name = body.lastName
    const email = body.email
    const phone_number = body.phoneNumber
    const zip_code = body.zipCode
    const account_type = body.accountType

    // Check if user exists
    const [existingUser] = (await connection.query('SELECT id FROM users WHERE id = ?', [id])) as [
      Array<{ id: number }>,
      unknown,
    ]

    if (!existingUser || existingUser.length === 0) {
      connection.release()
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await connection.query('UPDATE users SET ? WHERE id = ?', [
      { first_name, last_name, email, phone_number, zip_code, account_type },
      id,
    ])

    connection.release()

    return NextResponse.json(
      {
        message: 'User updated successfully',
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
