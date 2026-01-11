'use client'
import Card from '@/components/dashboard/cards/Card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { FaChevronRight } from 'react-icons/fa'
import cupicon from '@/public/dashboard/cup.svg'
import { useSelector } from 'react-redux'
import Action from '@/components/dashboard/cards/Action'
import action1 from '@/public/dashboard/action1.svg'
import action2 from '@/public/dashboard/action2.svg'
import action3 from '@/public/dashboard/action3.svg'
import action4 from '@/public/dashboard/action4.svg'
import action5 from '@/public/dashboard/action5.svg'
import action6 from '@/public/dashboard/action6.svg'
import Link from 'next/link'
import DashboardEventCard from '@/components/dashboard/cards/DashboardEventCard'

interface UserState {
  user: {
    first_name: string
    last_name: string
    id: number
  } | null
  token: string | null
}
interface RootState {
  user: UserState
}

const eventData = [
  {
    title: 'You Logged a verified match at Augusta Muni.',
    date: 'Yesterday',
    type: 'event',
    feedback: 'Registered',
  },
  {
    title: 'Midtown Monthly Open',
    date: '2 days ago',
    type: 'event',
    action_text: 'Register Now',
    action: () => alert('Register clicked'),
  },
  {
    title: 'Midtown Monthly Open',
    date: '2025-06-15 • 08:00AM',
    type: 'user',
    action_text: 'Register Now',
    action: () => alert('Register clicked'),
  },
  {
    title: 'Midtown Monthly Open',
    date: '2 days ago',
    type: 'event',
    action_text: 'Register Now',
    action: () => alert('Register clicked'),
  },
]

const feedData = [
  {
    title: 'Midtown Monthly Open',
    date: '2025-06-15 • 08:00AM',
    type: 'verified',
  },
  {
    title: 'Marcus Green posted Community News',
    date: '2 days ago',
    type: 'news',
  },
  {
    title: 'Marcus Green posted Community News',
    date: 'Yesterday',
    type: 'user',
  },
  {
    title: 'John Paul posted Community News',
    date: '2 days ago',
    type: 'news',
  },
]

export default function Page() {
  const { user } = useSelector((state: RootState) => state.user)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col p-4 pt-0">
        <div className="md:flex-row gap-4 flex flex-col mb-8">
          <div
            className="border border-[#EAECF0] w-full h-[260px] flex flex-col justify-between p-4"
            style={{
              background:
                'url(/dashboard/dashboard-hero.png), linear-gradient(179.58deg, rgba(0, 0, 0, 0) 27.02%, rgba(0, 0, 0, 0.8) 99.64%)',
            }}
          >
            <div className="flex justify-between items-center">
              <p className="dashboard-community">G4C Community</p>
              <div className="border border-black bg-white text-black h-[28px] w-[28px] flex items-center justify-center">
                <FaChevronRight />
              </div>
            </div>

            <div>
              <p className="dashboard-user-name">
                Welcome Back {user?.first_name + ' ' + user?.last_name} 👋
              </p>
            </div>
          </div>
          <Card
            title="Latest Score"
            value="82"
            stat="Trend Last 7 days"
            icon={<FaChevronRight />}
            bgIcon={cupicon}
          />
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <p className="quick-actions">Quick Actions</p>

          <div className="flex flex-col items-center gap-3 md:flex-row">
            <Action title="Log Score" icon={action1} link="#" />
            <Action title="Events" icon={action2} link="#" />
            <Action title="Sponsor" icon={action3} link="#" />
          </div>
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <Action title="Communities" icon={action4} link="#" />
            <Action title="Instructors" icon={action5} link="#" />
            <Action title="Tips" icon={action6} link="#" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-3 mt-5">
          <div className="w-full flex-col border border-[#EAECF0] p-4 h-[410px] overflow-y-auto">
            <div className="flex w-full justify-between items-center">
              <p className="quick-actions">Activity Feed</p>
              <Link
                href={'#'}
                className="border border-[#DFE4EC] bg-white text-[#928FA8] h-[28px] w-[28px] flex items-center justify-center"
              >
                <FaChevronRight />
              </Link>
            </div>

            <div className="mt-8 flex flex-col gap-1">
              {feedData.map((item, index) => (
                <DashboardEventCard key={index} {...item} />
              ))}
            </div>
          </div>
          <div className="w-full flex-col border border-[#EAECF0] p-4 h-[410px] overflow-y-auto">
            <div className="flex w-full justify-between items-center">
              <p className="quick-actions">Upcoming Events</p>
              <Link
                href={'#'}
                className="border border-[#DFE4EC] bg-white text-[#928FA8] h-[28px] w-[28px] flex items-center justify-center"
              >
                <FaChevronRight />
              </Link>
            </div>

            <div className="mt-8 flex flex-col gap-1">
              {eventData.map((item, index) => (
                <DashboardEventCard key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
