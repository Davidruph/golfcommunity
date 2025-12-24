import type { Metadata } from 'next'
import ProtectedRoute from '@/components/protected/ProtectedRoute'
import { AppSidebar } from '@/components/dash-app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import './dashboard.css'

export const metadata: Metadata = {
  title: 'Golf4Community Dashboard',
  description: 'Connecting Golfers. Empowering Communities.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="golfer">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
