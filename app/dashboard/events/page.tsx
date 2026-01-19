import EventCard from '@/components/dashboard/cards/EventCard'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ListFilter, Plus, Search } from 'lucide-react'

export default function Page() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Event Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-between items-center flex-col md:flex-row gap-3 mb-5">
          <Button variant="ghost" className="flex items-center gap-2 add-event-btn border-0">
            <Plus size={18} /> Add Event
          </Button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={20} className="absolute top-2 left-2" />
              <input
                type="text"
                className="event-input border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] w-[212px] bg-white pl-8 text-sm placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search"
              />
            </div>

            <Button
              variant="ghost"
              className="flex items-center gap-2 border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] w-[79px] bg-white"
            >
              <ListFilter size={18} /> Filter
            </Button>
          </div>
        </div>

        <div className="flex-col flex gap-4">
          <EventCard
            eventName="Midtown Monthly Open"
            eventDate="2025-07-20"
            eventFee="$45"
            totalSpot="26"
            attendanceSpot="24"
            userEventStatus="1"
            eventTime="08:00AM"
          />
          <EventCard
            eventName="Midtown Monthly Open"
            eventDate="2025-06-15"
            eventFee="$45"
            totalSpot="26"
            attendanceSpot="24"
            userEventStatus="0"
            eventTime="08:00AM"
          />
        </div>
      </div>
    </>
  )
}
