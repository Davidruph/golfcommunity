'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Spinner from '@/components/website/loaders/Spinner'
import { useGetCommunityByIdQuery } from '@/service/community.service'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import { showAlert } from '@/utils/showAlert'
import { Hash, ListFilter, MessageSquare, Search, Settings, UserRound, Users } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Page() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'chat'

  const { data: communityData, isLoading, error } = useGetCommunityByIdQuery(params.id)

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/communities/${params.id}?tab=${value}`)
  }

  useEffect(() => {
    if (error) {
      showAlert(getErrorMessage(error), 'error')
      router.push(`/dashboard/communities`)
    }
  }, [error])

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : communityData?.data?.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-center text-sm text-muted-foreground">No community data found.</p>
        </div>
      ) : (
        <>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard/communities">Communities</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{communityData?.data?.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div
              className="w-full h-[257px] p-[16px] border border-[#EAECF0] mb-2 relative"
              style={{
                backgroundImage: communityData?.data?.banner_image
                  ? `url(${communityData.data.banner_image})`
                  : `url('/dashboard/sponsorship.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 z-0" />
              {/* Content */}
              <div className="flex flex-col justify-between h-full text-white relative z-10">
                <p className="sponsorship-title border border-gray-200 p-2 flex items-center gap-2 w-[135px]">
                  <UserRound size={20} /> {communityData?.data?.member_count}{' '}
                  {communityData?.data?.member_count === 1 ? 'Member' : 'Members'}
                </p>
                <div className="flex justify-between items-end gap-4">
                  <p className="sponsorship-join-text w-full">{communityData?.data?.name}</p>
                  <p className="sponsorship-title w-full hidden lg:block">
                    {communityData?.data?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <Tabs value={tab} onValueChange={handleTabChange} className="w-full lg:w-auto">
                <TabsList className="flex-col sm:flex-row w-full sm:w-auto h-auto md:h-auto">
                  <TabsTrigger value="chat" className="flex items-center gap-1">
                    <MessageSquare size={13} /> Chat
                  </TabsTrigger>
                  <TabsTrigger value="forum" className="flex items-center gap-1">
                    <Hash size={13} /> Forum
                  </TabsTrigger>
                  <TabsTrigger value="member" className="flex items-center gap-1">
                    <Users size={13} /> Member
                  </TabsTrigger>
                  <TabsTrigger value="manage" className="flex items-center gap-1">
                    <Settings size={13} /> Manage
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none">
                  <Search size={20} className="absolute top-2 left-2" />
                  <input
                    type="search"
                    className="event-input border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] w-full lg:w-[212px] bg-white pl-8 text-sm placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Search"
                    // value={filtersVal.search || ''}
                    // onChange={(e) => handleFilterChange({ ...filtersVal, search: e.target.value })}
                  />
                </div>

                <Button
                  variant="ghost"
                  className="flex items-center gap-2 border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] min-w-[79px] bg-white"
                >
                  <ListFilter size={18} /> Filter
                </Button>
              </div>
            </div>

            <Tabs value={tab} onValueChange={handleTabChange}>
              <TabsContent value="chat" className="mt-5"></TabsContent>
              <TabsContent value="forum" className="mt-5"></TabsContent>
              <TabsContent value="member" className="mt-5"></TabsContent>
              <TabsContent value="manage" className="mt-5"></TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </>
  )
}
