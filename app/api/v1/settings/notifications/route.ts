import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

// POST - Create notification settings
export async function POST(request: NextRequest) {
  let connection

  try {
    const body = await request.json()
    const {
      user_id,
      new_user_registrations,
      sponsorship_alerts,
      report_notifications,
      system_alerts,
    } = body

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    connection = await pool.getConnection()

    // Check if settings already exist
    const checkQuery = 'SELECT id FROM notification_settings WHERE user_id = ?'
    const [existing] = await connection.query<RowDataPacket[]>(checkQuery, [user_id])

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Notification settings already exist for this user. Use PUT to update.' },
        { status: 409 }
      )
    }

    const query = `
      INSERT INTO notification_settings 
      (user_id, new_user_registrations, sponsorship_alerts, report_notifications, system_alerts)
      VALUES (?, ?, ?, ?, ?)
    `
    const [result] = await connection.query<ResultSetHeader>(query, [
      user_id,
      new_user_registrations || false,
      sponsorship_alerts || false,
      report_notifications || false,
      system_alerts || true,
    ])

    return NextResponse.json({
      message: 'Notification settings created successfully',
      id: result.insertId,
    })
  } catch (error) {
    console.error('Error creating notification settings:', error)
    return NextResponse.json({ error: 'Failed to create notification settings' }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

// PUT - Update notification settings
export async function PUT(request: NextRequest) {
  let connection

  try {
    const body = await request.json()
    const {
      id,
      user_id,
      new_user_registrations,
      sponsorship_alerts,
      report_notifications,
      system_alerts,
    } = body

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    connection = await pool.getConnection()

    let query: string
    let params: (string | number | boolean)[]

    if (id) {
      // Update by ID
      query = `
        UPDATE notification_settings 
        SET new_user_registrations = ?,
            sponsorship_alerts = ?,
            report_notifications = ?,
            system_alerts = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `
      params = [
        new_user_registrations || false,
        sponsorship_alerts || false,
        report_notifications || false,
        system_alerts || false,
        id,
        user_id,
      ]
    } else {
      // Update by user_id or insert if not exists
      query = `
        INSERT INTO notification_settings 
        (user_id, new_user_registrations, sponsorship_alerts, report_notifications, system_alerts)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          new_user_registrations = VALUES(new_user_registrations),
          sponsorship_alerts = VALUES(sponsorship_alerts),
          report_notifications = VALUES(report_notifications),
          system_alerts = VALUES(system_alerts),
          updated_at = CURRENT_TIMESTAMP
      `
      params = [
        user_id,
        new_user_registrations || false,
        sponsorship_alerts || false,
        report_notifications || false,
        system_alerts || false,
      ]
    }

    await connection.query(query, params)

    return NextResponse.json({
      message: 'Notification settings updated successfully',
    })
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json({ error: 'Failed to update notification settings' }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
