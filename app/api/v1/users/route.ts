import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import bcrypt from 'bcryptjs'

export async function GET(request: Request) {
  let connection
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const roleFilter = searchParams.get('role') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const statusFilter = searchParams.get('status') || ''
    const membershipFilter = searchParams.get('membership') || ''
    const offset = (page - 1) * limit

    connection = await pool.getConnection()

    // Build the WHERE clause
    const whereConditions: string[] = []
    const queryParams: unknown[] = []

    if (search) {
      whereConditions.push(
        '(users.first_name LIKE ? OR users.email LIKE ? OR users.last_name LIKE ?)'
      )
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (roleFilter) {
      whereConditions.push('roles.name = ?')
      queryParams.push(roleFilter)
    }

    if (statusFilter) {
      whereConditions.push('users.status = ?')
      queryParams.push(statusFilter)
    }

    if (membershipFilter) {
      whereConditions.push('users.membership = ?')
      queryParams.push(membershipFilter)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count for pagination
    const [countResult] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT users.id) as total 
       FROM users 
       LEFT JOIN roles ON users.role_id = roles.id 
       ${whereClause}`,
      queryParams
    )
    const total = countResult[0].total

    // Get paginated data with community count
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT 
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        users.status,
        users.membership,
        users.phone_number,
        users.role_id,
        roles.name as role_name,
        users.country_id,
        users.state_id,
        users.city_id,
        users.zip_code,
        users.account_type,
        COUNT(DISTINCT community_members.community_id) as communities_count,
        users.created_at
       FROM users
       LEFT JOIN roles ON users.role_id = roles.id
       LEFT JOIN community_members ON users.id = community_members.user_id
       ${whereClause}
       GROUP BY users.id, users.first_name, users.last_name, users.email, users.status, users.membership, 
                users.phone_number, users.role_id, roles.name, users.created_at
       ORDER BY users.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    )

    return NextResponse.json(
      {
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Users fetch error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

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
      account_type: body.accountType,
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
