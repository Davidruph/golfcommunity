'use client'

import * as React from 'react'
import { LayoutDashboard } from 'lucide-react'

import { AdminSidebarNav } from '@/components/admin-nav'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useSelector } from 'react-redux'
import dashboard from '../public/admin/dashboard.svg'
import users from '../public/admin/users.svg'
import communities from '../public/admin/communities.svg'
import captains from '../public/admin/captains.svg'
import sponsors from '../public/admin/sponsors.svg'
import kids from '../public/admin/kids.svg'
import leaderboards from '../public/admin/leaderboards.svg'
import message from '../public/admin/message.svg'
import reports from '../public/admin/reports.svg'
import settings from '../public/admin/settings.svg'

// This is sample data.
const baseData = {
  teams: [
    {
      name: 'G4C Panel',
      logo: LayoutDashboard,
    },
  ],
  projects: [
    {
      name: 'Dashboard',
      url: '/admin',
      icon: dashboard,
    },
    {
      name: 'Users',
      url: '/admin/users',
      icon: users,
    },
    {
      name: 'Communities',
      url: '/admin/communities',
      icon: communities,
    },
    {
      name: 'Captains',
      url: '/admin/captains',
      icon: captains,
    },
    {
      name: 'Sponors',
      url: '/admin/sponsors',
      icon: sponsors,
    },
    {
      name: 'Sponored Kids',
      url: '/admin/sponsored-kids',
      icon: kids,
    },
    {
      name: 'Leaderboard & Games',
      url: '/admin/leaderboards-and-games',
      icon: leaderboards,
    },
    {
      name: 'Messaging Oversight',
      url: '/admin/messaging',
      icon: message,
    },
    {
      name: 'Reports',
      url: '/admin/reports',
      icon: reports,
    },
    {
      name: 'Settings',
      url: '/admin/settings',
      icon: settings,
    },
  ],
}

type User = {
  first_name: string
  last_name: string
  email: string
  avatar: string
}

type RootState = {
  user: {
    user: User | null
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state?.user?.user)

  if (!user) {
    return null
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={baseData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <AdminSidebarNav projects={baseData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
