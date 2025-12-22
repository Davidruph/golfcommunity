import pool from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection()

  try {
    const body = await req.json()
    console.log('Received registration data:', body)

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Get the golfer role ID
    const [roles] = (await connection.query('SELECT id FROM roles WHERE name = ?', ['golfer'])) as [
      { id: number }[],
      unknown,
    ]

    if (!roles || roles.length === 0) {
      connection.release()
      return NextResponse.json(
        { error: 'Golfer role not found. Please contact support.' },
        { status: 500 }
      )
    }

    const golferRoleId = roles[0].id

    // Check if user already exists
    const [existingUser] = (await connection.query('SELECT id FROM users WHERE email = ?', [
      body.email,
    ])) as [Array<{ id: number }>, unknown]

    if (existingUser && existingUser.length > 0) {
      connection.release()
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Prepare user data
    const userData = {
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      password: hashedPassword,
      phone_number: body.phoneNumber,
      country_id: body.country,
      state_id: body.state,
      city_id: body.city,
      zip_code: body.zipCode,
      role_id: golferRoleId,
    }

    // Insert user
    const [userResult] = (await connection.query('INSERT INTO users SET ?', userData)) as [
      { insertId: number; affectedRows: number },
      unknown,
    ]

    const userId = userResult.insertId

    // Assign golfer role to user
    await connection.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [
      userId,
      golferRoleId,
    ])

    connection.release()

    return NextResponse.json(
      {
        message: 'User registered successfully',
        userId,
        roleId: golferRoleId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Registration error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during registration',
      },
      { status: 500 }
    )
  }
}
