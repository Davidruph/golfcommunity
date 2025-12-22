import pool from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface User {
  id: number
  email: string
  password: string
  [key: string]: string | number | boolean | null | undefined
}

interface Role {
  name: string
}

export async function POST(req: NextRequest) {
  let connection

  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    connection = await pool.getConnection()

    // Find user by email
    const [users] = (await connection.query('SELECT * FROM users WHERE email = ?', [email])) as [
      Array<User>,
      unknown,
    ]

    if (!users || users.length === 0) {
      connection.release()
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      connection.release()
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Get user role
    const [userRoles] = (await connection.query(
      `SELECT r.name FROM user_roles ur 
       JOIN roles r ON ur.role_id = r.id 
       WHERE ur.user_id = ?`,
      [user.id]
    )) as [Array<Role>, unknown]

    const role = userRoles.length > 0 ? userRoles[0].name : 'golfer'

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user

    connection.release()

    const response = NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          ...userWithoutPassword,
          role,
        },
      },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (err) {
    if (connection) connection.release()
    console.error('Login error:', err)
    return NextResponse.json(
      { error: 'Database error', message: (err as Error)?.message },
      { status: 500 }
    )
  }
}
