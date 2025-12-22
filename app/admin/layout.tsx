import type { Metadata } from 'next'
import ProtectedRoute from '@/components/protected/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Golf4Community Admin',
  description: 'Connecting Golfers. Empowering Communities.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
}
