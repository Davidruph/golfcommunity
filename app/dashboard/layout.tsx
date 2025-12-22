import type { Metadata } from 'next'
import ProtectedRoute from '@/components/protected/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Golf4Community Dashboard',
  description: 'Connecting Golfers. Empowering Communities.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['admin', 'super_admin', 'golfer']}>{children}</ProtectedRoute>
  )
}
