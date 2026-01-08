import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'

export async function GET() {
  let connection
  try {
    connection = await pool.getConnection()
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM membership_plans ORDER BY name ASC'
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

export async function POST(request: NextRequest) {
  let connection

  try {
    const body = await request.json()
    const { tiers } = body

    if (!tiers || !Array.isArray(tiers) || tiers.length === 0) {
      return NextResponse.json({ error: 'Tiers data is required' }, { status: 400 })
    }

    connection = await pool.getConnection()

    // Start transaction
    await connection.beginTransaction()

    // Delete existing tiers
    await connection.query('DELETE FROM membership_plans')

    // Insert new tiers
    const query = `
      INSERT INTO membership_plans 
      (name, monthly_price, yearly_price, max_communities, priority_support)
      VALUES (?, ?, ?, ?, ?)
    `

    for (const tier of tiers) {
      await connection.query<ResultSetHeader>(query, [
        tier.name,
        tier.monthlyPrice,
        tier.yearlyPrice,
        tier.maxCommunities,
        tier.prioritySupport ? 1 : 0,
      ])
    }

    // Commit transaction
    await connection.commit()

    return NextResponse.json({
      message: 'Subscription tiers saved successfully',
      count: tiers.length,
    })
  } catch (error) {
    if (connection) {
      await connection.rollback()
    }
    console.error('Error saving subscription tiers:', error)
    return NextResponse.json({ error: 'Failed to save subscription tiers' }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
