import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

// GET - Fetch notification settings for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  let connection

  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    console.log('Fetching settings for userId:', userId)

    connection = await pool.getConnection()

    const query = `
      SELECT * FROM notification_settings 
      WHERE user_id = ?
    `
    const [result] = await connection.query<RowDataPacket[]>(query, [userId])

    // If no settings exist, return default values
    if (!result || result.length === 0) {
      return NextResponse.json({
        user_id: parseInt(userId),
        new_user_registrations: false,
        sponsorship_alerts: false,
        report_notifications: false,
        system_alerts: true,
      })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json({ error: 'Failed to fetch notification settings' }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
