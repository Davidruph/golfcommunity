'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

type NavItem = {
  name: string
  url: string
  icon: string
  count?: number
}

export function UserSidebarNav({
  main,
  community,
  improve,
  systems,
}: {
  main: NavItem[]
  community: NavItem[]
  improve: NavItem[]
  systems: NavItem[]
}) {
  const pathname = usePathname()

  const renderNavItems = (items: NavItem[]) => (
    <>
      {items.map((item) => {
        const isActive = pathname === item.url
        return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
              <Link href={item.url} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Image src={item.icon} alt={item.name} width={20} height={20} />
                  <span>{item.name}</span>
                </div>
                {item.count && item.count > 0 && (
                  <span className="text-[10px] ml-auto min-w-5 h-5 flex items-center justify-center rounded-full bg-[#EE4345] text-primary-foreground font-var(--font-geist) group-data-[collapsible=icon]:hidden">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </>
  )

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarMenu className="user-dashboard-menu">{renderNavItems(main)}</SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Community</SidebarGroupLabel>
        <SidebarMenu className="user-dashboard-menu">{renderNavItems(community)}</SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Improve</SidebarGroupLabel>
        <SidebarMenu className="user-dashboard-menu">{renderNavItems(improve)}</SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Systems</SidebarGroupLabel>
        <SidebarMenu className="user-dashboard-menu">{renderNavItems(systems)}</SidebarMenu>
      </SidebarGroup>
    </>
  )
}
