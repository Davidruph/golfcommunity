'use client'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode, useMemo } from 'react'
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

  const requiredRoles = useMemo(
    () => (Array.isArray(requiredRole) ? requiredRole : [requiredRole]),
    [requiredRole]
  )

  const hasAccess = !!token && !!user && requiredRoles.includes(user.role)

  useEffect(() => {
    if (!token || !user) {
      router.replace('/login')
      return
    }

    if (!requiredRoles.includes(user.role)) {
      if (user.role === 'golfer' && requiredRoles.includes('admin')) {
        router.replace('/dashboard')
      } else {
        router.replace('/')
      }
    }
  }, [token, user, requiredRoles, router])

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner loading />
      </div>
    )
  }

  return <>{children}</>
}
