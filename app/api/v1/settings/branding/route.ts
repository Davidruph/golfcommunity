import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function GET() {
  let connection
  try {
    connection = await pool.getConnection()
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM branding LIMIT 1')
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

export async function POST(request: NextRequest) {
  let connection

  try {
    const body = await request.json()

    const platform_name = body.platformName
    const support_email = body.supportEmail

    connection = await pool.getConnection()

    const query = `
      INSERT INTO branding 
      (platform_name, support_email)
      VALUES (?, ?)
    `
    const [result] = await connection.query<ResultSetHeader>(query, [platform_name, support_email])

    return NextResponse.json({
      message: 'Branding settings created successfully',
      id: result.insertId,
    })
  } catch (error) {
    console.error('Error creating branding settings:', error)
    return NextResponse.json({ error: 'Failed to create branding settings' }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function PUT(request: NextRequest) {
  let connection

  try {
    const body = await request.json()

    const id = body.id
    const platform_name = body.platformName
    const support_email = body.supportEmail

    if (!id) {
      return NextResponse.json({ error: 'Branding ID is required' }, { status: 400 })
    }

    connection = await pool.getConnection()

    const query = `
      UPDATE branding 
      SET platform_name = ?,
          support_email = ?
      WHERE id = ?
    `
    const params: (string | number | boolean)[] = [platform_name, support_email, id]

    await connection.query(query, params)

    return NextResponse.json({
      message: 'Branding settings updated successfully',
    })
  } catch (error) {
    console.error('Error updating branding settings:', error)
    return NextResponse.json({ error: 'Failed to update branding settings' }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
