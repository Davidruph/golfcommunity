'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HandCoins, UserRound } from 'lucide-react'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'browse-children'
  const handleTabChange = (value: string) => {
    router.push(`/dashboard/sponsorship?tab=${value}`)
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
                <BreadcrumbPage>Sponsorship</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div
          className="w-full h-[257px] p-[16px] border border-[#EAECF0] mb-2"
          style={{
            backgroundImage: "url('/dashboard/sponsorship.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-col justify-between h-full text-white">
            <p className="sponsorship-title">G4C Community</p>
            <div className="flex justify-between items-end">
              <p className="sponsorship-join-text w-full">
                Sponsor a <br /> Junior Golfer
              </p>
              <p className="sponsorship-title w-full">
                Your contribution help provides equipment, lessons, and course access to
                underprivileged youth in your community. +50 Points for every sponsorship.
              </p>
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={handleTabChange} className="w-full lg:w-auto">
          <TabsList className="flex-col sm:flex-row w-full sm:w-auto h-auto md:h-auto">
            <TabsTrigger value="browse-children" className="gap-2 flex items-center">
              <UserRound size={16} />
              Browse Children
            </TabsTrigger>
            <TabsTrigger value="my-contributions" className="gap-2 flex items-center">
              <HandCoins size={16} />
              My Contribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse-children" className="mt-5">
            Browse children content goes here.
          </TabsContent>
          <TabsContent value="my-contributions" className="mt-5">
            My contributions content goes here.
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
