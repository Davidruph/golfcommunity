import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import bcrypt from 'bcryptjs'

export async function GET(request: Request) {
  let connection

  try {
    // Query params
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const statusFilter = searchParams.get('status') || ''
    const donationRangeFilter = searchParams.get('donation_range') || ''
    const offset = (page - 1) * limit

    connection = await pool.getConnection()

    /**
     * WHERE (row-level filters)
     */
    const whereConditions: string[] = []
    const queryParams: unknown[] = []

    if (search) {
      whereConditions.push(
        '(users.first_name LIKE ? OR users.last_name LIKE ? OR users.email LIKE ?)'
      )
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (statusFilter) {
      whereConditions.push('sponsors.status = ?')
      queryParams.push(statusFilter)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    /**
     * HAVING (aggregated filters)
     */
    let minDonation: number | null = null
    let maxDonation: number | null = null

    if (donationRangeFilter) {
      if (donationRangeFilter.includes('-')) {
        const [min, max] = donationRangeFilter.split('-').map(Number)
        minDonation = min
        maxDonation = max
      } else if (donationRangeFilter.endsWith('+')) {
        minDonation = Number(donationRangeFilter.replace('+', ''))
      }
    }

    const havingConditions: string[] = []
    const havingParams: unknown[] = []

    if (minDonation !== null && maxDonation !== null) {
      havingConditions.push('SUM(donations.amount_donated) BETWEEN ? AND ?')
      havingParams.push(minDonation, maxDonation)
    } else if (minDonation !== null) {
      havingConditions.push('SUM(donations.amount_donated) >= ?')
      havingParams.push(minDonation)
    }

    const havingClause =
      havingConditions.length > 0 ? `HAVING ${havingConditions.join(' AND ')}` : ''

    /**
     * COUNT query (for pagination)
     */
    const [countResult] = await connection.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total FROM (
        SELECT sponsors.id
        FROM sponsors
        LEFT JOIN users ON sponsors.user_id = users.id
        LEFT JOIN donations ON users.id = donations.sponsor_id
        ${whereClause}
        GROUP BY sponsors.id
        ${havingClause}
      ) AS subquery
      `,
      [...queryParams, ...havingParams]
    )

    const total = countResult[0]?.total || 0

    /**
     * MAIN DATA query
     */
    const [rows] = await connection.query<RowDataPacket[]>(
      `
      SELECT 
        sponsors.id,
        users.first_name,
        users.last_name,
        users.email,
        sponsors.status,
        users.membership,
        users.phone_number,
        users.role_id,
        users.account_type,
        users.zip_code,
        sponsors.user_id,

        -- TOTAL DONATIONS
        COALESCE(SUM(donations.amount_donated), 0) AS total_donations,

        -- TOTAL KIDS SPONSORED
        COALESCE(SUM(donations.kid_sponsored), 0) AS kids_sponsored_count,

        users.created_at
      FROM sponsors
      LEFT JOIN users ON sponsors.user_id = users.id
      LEFT JOIN donations ON users.id = donations.sponsor_id
      ${whereClause}
      GROUP BY sponsors.id
      ${havingClause}
      ORDER BY users.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...queryParams, ...havingParams, limit, offset]
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
    console.error('Sponsors fetch error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    if (connection) connection.release()
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

    //create a sponsor entry for the user
    await connection.query('INSERT INTO sponsors (user_id, status) VALUES (?, ?)', [userId, 1])

    connection.release()

    return NextResponse.json(
      {
        message: 'Sponsor registered successfully',
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
