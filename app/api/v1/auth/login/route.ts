import pool from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Received login data:', body)
    // return NextResponse.json({ message: 'Registration endpoint' }, { status: 200 })
    const connection = await pool.getConnection()
    const [result] = await connection.query('INSERT INTO users SET ?', [body])
    connection.release()
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    console.error('Registration error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
