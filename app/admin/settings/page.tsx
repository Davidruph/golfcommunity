'use client'
import PageTitle from '@/components/admin/PageTitle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSearchParams, useRouter } from 'next/navigation'
import Community from './community'
import Notification from './notification'
import Branding from './branding'
import Subscription from './subscription'
import Permissions from './permissions'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'subscription'

  const handleTabChange = (value: string) => {
    router.push(`/admin/settings?tab=${value}`)
  }
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-2">
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center mb-5">
          <PageTitle title="Settings" subTitle="Manage platform settings and configurations." />
        </div>

        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex-col sm:flex-row w-full sm:w-auto h-auto md:h-auto max-w-[587px]">
            <TabsTrigger value="subscription">Membership Tiers</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>
          <TabsContent value="subscription" className="settings-tab mt-5">
            <Subscription />
          </TabsContent>
          <TabsContent value="communities" className="settings-tab mt-5">
            <Community />
          </TabsContent>
          <TabsContent value="notifications" className="settings-tab mt-5">
            <Notification />
          </TabsContent>
          <TabsContent value="permissions" className="settings-tab mt-5">
            <Permissions />
          </TabsContent>
          <TabsContent value="branding" className="settings-tab mt-5">
            <Branding />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
