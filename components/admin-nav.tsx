'use client'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminSidebarNav({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: string
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu className="admin-dashboard-menu">
        {projects.map((item) => {
          const isActive = pathname === item.url

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
                <Link href={item.url}>
                  <Image src={item.icon} alt={item.name} width={20} height={20} />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
