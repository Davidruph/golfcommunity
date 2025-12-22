'use client'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import Spinner from '../website/loaders/Spinner'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string | string[]
}

interface UserState {
  user: {
    role: string
  } | null
  token: string | null
}

interface RootState {
  user: UserState
}

export default function ProtectedRoute({ children, requiredRole = 'admin' }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, token } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    // If no token, redirect to login
    if (!token) {
      router.push('/login')
      return
    }

    // If no user data, redirect to login
    if (!user) {
      router.push('/login')
      return
    }

    // Check if user has required role
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const userRole = user.role
    // console.log('User Role:', userRole, 'Required Roles:', requiredRoles)

    if (!requiredRoles.includes(userRole)) {
      // User doesn't have the required role, redirect to home
      router.push('/')
      return
    }
  }, [token, user, requiredRole, router])

  // While checking auth, show spinner
  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner loading={true} />
      </div>
    )
  }

  return <>{children}</>
}
