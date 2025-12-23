import type { Metadata } from 'next'
import ProtectedRoute from '@/components/protected/ProtectedRoute'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import './admin.css'

export const metadata: Metadata = {
  title: 'Golf4Community Admin',
  description: 'Connecting Golfers. Empowering Communities.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
