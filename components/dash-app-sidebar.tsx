'use client'

import * as React from 'react'
import { LayoutDashboard } from 'lucide-react'

import { UserSidebarNav } from '@/components/dashboard-nav'
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
import dashboard from '../public/user/dashboard.svg'
import users from '../public/user/users.svg'
import events from '../public/user/events.svg'
import news from '../public/user/news.svg'
import tips from '../public/user/tips.svg'
import instructions from '../public/user/instructions.svg'
import leaderboards from '../public/user/leaderboards.svg'
import message from '../public/user/message.svg'
import reports from '../public/user/reports.svg'
import settings from '../public/user/settings.svg'
import profile from '../public/user/profile.svg'
import sponsorship from '../public/user/sponsorship.svg'

const baseData = {
  teams: [
    {
      name: 'G4C Community',
      logo: LayoutDashboard,
    },
  ],
  main: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: dashboard,
    },
    {
      name: 'My Profile',
      url: '/dashboard/profile',
      icon: profile,
    },
    {
      name: 'My Stats',
      url: '/dashboard/stats',
      icon: reports,
    },
  ],
  community: [
    {
      name: 'Communities',
      url: '/dashboard/communities',
      icon: users,
    },
    {
      name: 'Leaderboards',
      url: '/dashboard/leaderboard',
      icon: leaderboards,
    },
    {
      name: 'Events',
      url: '/dashboard/events',
      icon: events,
      count: 5,
    },
    {
      name: 'News',
      url: '/dashboard/news',
      icon: news,
    },
  ],

  improve: [
    {
      name: 'Instructors',
      url: '/dashboard/instructors',
      icon: instructions,
    },
    {
      name: 'Golf Tips',
      url: '/dashboard/golf-tips',
      icon: tips,
    },
  ],
  systems: [
    {
      name: 'Sponsorship',
      url: '/dashboard/sponsorship',
      icon: sponsorship,
    },
    {
      name: 'Messages',
      url: '/dashboard/messages',
      icon: message,
      count: 12, // Add count here
    },
    {
      name: 'Settings',
      url: '/dashboard/settings',
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={baseData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <UserSidebarNav
          main={baseData.main}
          community={baseData.community}
          improve={baseData.improve}
          systems={baseData.systems}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
