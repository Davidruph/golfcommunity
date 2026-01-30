'use client'
import CommunityListCard from '@/components/dashboard/CommunityListCard'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Spinner from '@/components/website/loaders/Spinner'
import { useGetCommunitiesQuery, useJoinCommunityMutation } from '@/service/community.service'
import { ListFilter, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Loader from '@/components/website/loaders/Loader'
import { showAlert } from '@/utils/showAlert'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import rtkMutation from '@/utils/rtkMutation'

interface Community {
  id: string
  name: string
  captain_email: string
  description: string
  members_count: number
  status: number | null
  timezone: string
  activity: string
  created_at: string
  member_user_id?: string
  banner_image?: string
  is_member: number
}

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'all'
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [community, setCommunity] = useState<Community | null>(null)

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/communities?tab=${value}`)
  }

  const { data: communityData, isLoading } = useGetCommunitiesQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    status: filtersVal.status || '',
    filter: filtersVal.filter || '',
  })

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFiltersVal(newFilters)
    setPage(1)
  }

  const handleJoinCommunity = (community: Community) => () => {
    console.log(`Joining community with ID: ${community.id}`)
    setCommunity(community)
  }

  const handleViewCommunity = (community: Community) => () => {
    router.push(`/dashboard/communities/${community.id}`)
  }

  const [join, { isLoading: joinLoading, isSuccess, error }] = useJoinCommunityMutation()
  const joinCommunity = (community: Community) => async () => {
    console.log(`Confirmed joining community with ID: ${community.id}`)
    await rtkMutation(join, community)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Community join successful!', 'success')
      setCommunity(null)
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error])

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Communities</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full lg:w-auto">
            <TabsList className="flex-col sm:flex-row w-full sm:w-auto h-auto md:h-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="member">Member</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search size={20} className="absolute top-2 left-2" />
              <input
                type="search"
                className="event-input border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] w-full lg:w-[212px] bg-white pl-8 text-sm placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search"
                value={filtersVal.search || ''}
                onChange={(e) => handleFilterChange({ ...filtersVal, search: e.target.value })}
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

        {isLoading ? (
          <Spinner loading={isLoading} />
        ) : (
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsContent value="all" className="mt-5">
              {communityData?.data?.filter((community: Community) => community.is_member != 1)
                .length > 0 ? (
                <div className="w-full flex flex-col md:flex-row gap-4 flex-wrap">
                  {communityData?.data
                    ?.filter((community: Community) => community.is_member != 1)
                    .map((community: Community) => (
                      <CommunityListCard
                        key={community.id}
                        title={community.name}
                        description={community.description}
                        imageUrl={community.banner_image}
                        action={handleJoinCommunity(community)}
                        memberCount={community.members_count}
                        is_member={community.is_member}
                        viewAction={handleViewCommunity(community)}
                      />
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 w-full py-8">No data available</p>
              )}
            </TabsContent>
            <TabsContent value="member" className="mt-5">
              {communityData?.data?.filter((community: Community) => community.is_member == 1)
                .length > 0 ? (
                <div className="w-full flex flex-col md:flex-row flex-wrap gap-4">
                  {communityData?.data
                    ?.filter((community: Community) => community.is_member == 1)
                    .map((community: Community) => (
                      <CommunityListCard
                        key={community.id}
                        title={community.name}
                        description={community.description}
                        imageUrl={community.banner_image}
                        action={handleJoinCommunity(community)}
                        memberCount={community.members_count}
                        is_member={community.is_member}
                        viewAction={handleViewCommunity(community)}
                      />
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 w-full py-8">No data available</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={!!community} onOpenChange={() => setCommunity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              Are you sure you want to join the community &quot;{community?.name}&quot;?
              <button
                type="submit"
                className="auth-submit w-full h-[49px] py-1 px-2 mt-5 cursor-pointer"
                onClick={joinCommunity(community as Community)}
                disabled={joinLoading}
              >
                {joinLoading ? <Loader /> : 'Yes, Join Community'}
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
