export const runtime = 'nodejs'
import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import jwt from 'jsonwebtoken'

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
    const community_id = formData.id as number

    // Validate required fields
    if (community_id === null) {
      connection.release()
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 })
    }

    //check for duplicate campaign title
    if (community_id) {
      const [existingattendance] = (await connection.query(
        'SELECT id FROM community_members WHERE community_id = ? AND user_id = ?',
        [community_id, decoded.userId]
      )) as [Array<RowDataPacket>, unknown]

      if (existingattendance && existingattendance.length > 0) {
        connection.release()
        return NextResponse.json(
          { error: 'You are already a member of this community' },
          { status: 409 }
        )
      }
    }

    // Insert into database
    const communityData = {
      community_id,
      user_id: decoded.userId,
      is_active: 0,
    }

    const [result] = (await connection.query(
      'INSERT INTO community_members SET ?',
      communityData
    )) as [{ insertId: number; affectedRows: number }, unknown]

    connection.release()

    return NextResponse.json(
      {
        message: 'Community membership registered successfully',
        communityId: result.insertId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Community membership registration error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message:
          (err as Error)?.message || 'An error occurred during community membership registration',
      },
      { status: 500 }
    )
  }
}
