'use client'
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
import { ListFilter, Search } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

const leaderboard = [
  {
    rank: 1,
    name: 'Sam Lee',
    points: 180,
    image: '/website/exploreimage1.svg',
    topImage: '/website/exploretop1.svg',
  },
  {
    rank: 2,
    name: 'Jasmine Clark',
    points: 172,
    image: '/website/exploreimage2.svg',
    topImage: '/website/exploretop2.svg',
  },
  {
    rank: 3,
    name: 'Mike Ramos',
    points: 160,
    image: '/website/exploreimage3.svg',
    topImage: '/website/exploretop3.svg',
  },
  {
    rank: 4,
    name: 'Emily Davis',
    points: 150,
    image: '',
    topImage: '',
  },
  {
    rank: 5,
    name: 'David Johnson',
    points: 140,
    image: '',
    topImage: '',
  },
]
export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'global'
  const handleTabChange = (value: string) => {
    router.push(`/dashboard/leaderboard?tab=${value}`)
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
                <BreadcrumbPage>Leaderboards</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full lg:w-auto">
            <TabsList className="flex-col sm:flex-row w-full sm:w-auto h-auto md:h-auto">
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
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
          <TabsContent value="global" className="mt-5">
            <div className="flex flex-col w-full mt-14 pb-15">
              {leaderboard.map((player, index) => (
                <div
                  key={index}
                  className={`border-b border-[#0000001C]group flex justify-between items-center h-[164px] cursor-pointer transition-colors duration-300 animate-slide-in-up ${
                    index === 1 ? 'bg-black hover:bg-opacity-80' : ''
                  }`}
                  style={index === 1 ? { animationDelay: '0.1s' } : {}}
                >
                  <div className="flex gap-14 items-center">
                    {player.image ? (
                      <Image
                        src={player.image}
                        alt={`explore ${player.rank}`}
                        width={151}
                        height={132}
                      />
                    ) : (
                      <div style={{ width: 151, height: 132, background: '#f3f3f3' }} />
                    )}

                    <p
                      className={`explore-top-count group-hover:text-white transition-colors duration-300 ${
                        index === 1 ? 'explore-top-counts text-white' : ''
                      }`}
                    >
                      {player.rank.toString().padStart(2, '0')} {'//'}{' '}
                      <span className={index === 1 ? 'text-white' : ''}>{player.name}</span>
                    </p>
                  </div>

                  <div className="hidden lg:flex">
                    {player.topImage ? (
                      <Image
                        src={player.topImage}
                        alt={`explore ${player.rank}`}
                        width={261}
                        height={162}
                        className="text-[#00000080]"
                      />
                    ) : (
                      <div style={{ width: 261, height: 162, background: 'transparent' }} />
                    )}
                  </div>
                  <div className="gap-2 items-center hidden lg:flex">
                    <Image src="/website/explorecrown.svg" alt="crown" width={28} height={28} />
                    <span
                      className={`explore-points group-hover:text-white transition-colors duration-300 ${
                        index === 1 ? 'explore-score text-white' : ''
                      }`}
                    >
                      {player.points} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="community" className="mt-5">
            <div className="flex flex-col w-full mt-14 pb-15">
              {leaderboard.map((player, index) => (
                <div
                  key={index}
                  className={`border-b border-[#0000001C]group flex justify-between items-center h-[164px] cursor-pointer transition-colors duration-300 animate-slide-in-up ${
                    index === 1 ? 'bg-black hover:bg-opacity-80' : ''
                  }`}
                  style={index === 1 ? { animationDelay: '0.1s' } : {}}
                >
                  <div className="flex gap-14 items-center">
                    {player.image ? (
                      <Image
                        src={player.image}
                        alt={`explore ${player.rank}`}
                        width={151}
                        height={132}
                      />
                    ) : (
                      <div style={{ width: 151, height: 132, background: '#f3f3f3' }} />
                    )}

                    <p
                      className={`explore-top-count group-hover:text-white transition-colors duration-300 ${
                        index === 1 ? 'explore-top-counts text-white' : ''
                      }`}
                    >
                      {player.rank.toString().padStart(2, '0')} {'//'}{' '}
                      <span className={index === 1 ? 'text-white' : ''}>{player.name}</span>
                    </p>
                  </div>

                  <div className="hidden lg:flex">
                    {player.topImage ? (
                      <Image
                        src={player.topImage}
                        alt={`explore ${player.rank}`}
                        width={261}
                        height={162}
                        className="text-[#00000080]"
                      />
                    ) : (
                      <div style={{ width: 261, height: 162, background: 'transparent' }} />
                    )}
                  </div>
                  <div className="gap-2 items-center hidden lg:flex">
                    <Image src="/website/explorecrown.svg" alt="crown" width={28} height={28} />
                    <span
                      className={`explore-points group-hover:text-white transition-colors duration-300 ${
                        index === 1 ? 'explore-score text-white' : ''
                      }`}
                    >
                      {player.points} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
