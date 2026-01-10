'use client'
import Button from '@/components/admin/Button'
import { Button as CustomButton } from '@/components/ui/button'
import PageTitle from '@/components/admin/PageTitle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Download, ScanSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Card from '@/components/admin/Card'
import cardicon1 from '@/public/admin/cardicon1.svg'
import cardicon2 from '@/public/admin/cardicon2.svg'
import cardicon3 from '@/public/admin/cardicon3.svg'
import cardicon4 from '@/public/admin/cardicon4.svg'
import DynamicTable, { TableColumn } from '@/components/table/DynamicTable'
import { useState } from 'react'
import { useGetCommunitiesQuery } from '@/service/community.service'
import { GoDotFill } from 'react-icons/go'
import { Eye, EyeOff } from 'lucide-react'

const cardData = [
  {
    title: 'Total Users',
    header: '12,849',
    details: '+12.5% from last month',
    iconSrc: cardicon1,
  },
  {
    title: 'Total Communities',
    header: '342',
    details: '+8 new this week',
    iconSrc: cardicon2,
  },
  {
    title: 'Total Sponsors',
    header: '1,248',
    details: '+23.1% from last month',
    iconSrc: cardicon3,
  },
  {
    title: 'Total Users',
    header: '1,250',
    details: '+23.1% from last month',
    iconSrc: cardicon4,
  },
  {
    title: 'Total Users',
    header: '12,849',
    details: '+12.5% from last month',
    iconSrc: cardicon1,
  },
  {
    title: 'Total Communities',
    header: '342',
    details: '+8 new this week',
    iconSrc: cardicon2,
  },
  {
    title: 'Total Sponsors',
    header: '1,248',
    details: '+23.1% from last month',
    iconSrc: cardicon3,
  },
  {
    title: 'Total Users',
    header: '1,250',
    details: '+23.1% from last month',
    iconSrc: cardicon4,
  },
]

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface Community {
  id: string
  name: string
  captain_email: string
  description: string
  members_count: string
  status: number | null
  timezone: string
  activity: string
  created_at: string
  member_user_id?: string
}

export default function Page() {
  const [page, setPage] = useState(1)
  const [showAll, setShowAll] = useState(false)

  const { data: communitiesData, isLoading } = useGetCommunitiesQuery({
    page,
    limit: 10,
    activity: 'High',
  })

  const communities: Community[] = communitiesData || []

  const columns: TableColumn<Community>[] = [
    {
      key: 'name',
      header: 'COMMUNITY NAME',
      accessor: (row) => row.name,
    },
    {
      key: 'role',
      header: 'CAPTAIN',
      accessor: (row) => row.captain_email,
      render: (value) => (
        <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
          {value}
        </span>
      ),
    },
    {
      key: 'members_count',
      header: 'MEMBERS',
      accessor: (row) => row.members_count,
      render: (value) => (
        <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
          {value}
        </span>
      ),
    },
    {
      key: 'timezone',
      header: 'TIMEZONE',
      accessor: (row) => row.timezone,
      render: (value) => (
        <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
          {value}
        </span>
      ),
    },
    {
      key: 'activity',
      header: 'ACTIVITY',
      accessor: (row) => row.activity,
      render: (value) => (
        <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      accessor: (row) => row.status,
      render: (value) => (
        <span className="table-badge px-2 py-1 items-center flex w-[100px] h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB] justify-start">
          <GoDotFill className={`${value == 1 ? 'text-[#069769]' : 'text-[#FF0000]'}`} />
          {value == 1 ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'CREATED',
      accessor: (row) => row.created_at,
      render: (value) => {
        const date = new Date(value as string)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      },
    },
  ]

  const [state, setState] = useState({
    series: [
      {
        name: 'User Growth',
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'area' as const,
        zoom: {
          enabled: false,
        },
      },
      colors: ['#069769'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight' as const,
        width: 1,
      },
      title: {
        text: 'User Growth Trends by Month',
        align: 'left' as const,
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
    },
  })

  // ...existing code...
  const [revenueState, setRevenueState] = useState({
    series: [
      {
        name: 'Revenue',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
      {
        name: 'Sponsorship',
        data: [20, 25, 30, 35, 45, 50, 55, 65, 80],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'area' as const,
        zoom: {
          enabled: false,
        },
      },
      colors: ['#069769', '#F49E0C'], // First color for Revenue, second for Sponsorship
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth' as const, // 'smooth' looks better with multiple lines
        width: 2,
      },
      title: {
        text: 'Revenue & Sponsorship',
        align: 'left' as const,
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
      legend: {
        position: 'top' as const,
        horizontalAlign: 'right' as const,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        },
      },
    },
  })
  // ...existing code...

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const router = useRouter()
  const addUser = () => {
    router.push('/admin/users')
  }
  const exportData = () => {
    console.log('Exporting data...')
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
                <BreadcrumbPage>Dashboard Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-2">
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <PageTitle
            title="Dashboard Overview"
            subTitle="Welcome back! Here's what's happening with your platform."
          />
          <div className="flex flex-col md:flex-row gap-2 items-center justify-start md:justify-end">
            <CustomButton
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-[15px] h-[41px]"
              onClick={exportData}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </CustomButton>
            <Button icon={<ScanSearch />} text="View Users" action={addUser} width="170px" />
          </div>
        </div>

        <div className="mt-5 gap-3 flex flex-col flex-wrap md:flex-row">
          {(showAll ? cardData : cardData.slice(0, 4)).map((card, index) => (
            <Card
              key={index}
              title={card.title}
              header={card.header}
              details={card.details}
              iconSrc={card.iconSrc}
            />
          ))}

          {cardData.length > 4 && (
            <div className="flex items-center gap-4 mt-4 w-full">
              <hr className="flex-1 border-gray-200" />

              <CustomButton
                variant="outline"
                className="border-0 text-gray-700 hover:bg-gray-100 rounded-[15px] h-[41px] px-6 flex items-center gap-2 whitespace-nowrap"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>
                    <EyeOff size={18} />
                    Show Less
                  </>
                ) : (
                  <>
                    <Eye size={18} />
                    See More
                  </>
                )}
              </CustomButton>

              <hr className="flex-1 border-gray-200" />
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col md:flex-row gap-3 items-center">
          <div className="border border-[#F2F2F2] w-full h-[355px] rounded-[20px] bg-transparent p-2">
            {/* <p className="chart-title">User Growth</p> */}
            <Chart options={state.options} series={state.series} type="area" height={300} />
          </div>
          <div className="border border-[#F2F2F2] w-full h-[355px] rounded-[20px] bg-transparent p-2">
            {/* <p className="chart-title">Revenue & Sponsorship</p> */}
            <Chart
              options={revenueState.options}
              series={revenueState.series}
              type="area"
              height={300}
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between items-center mb-4">
            <p className="stats-title">Top Communities</p>
            <CustomButton
              variant="outline"
              className=" text-gray-700 hover:bg-gray-100 rounded-[15px] h-[41px] px-6 flex items-center gap-2 whitespace-nowrap"
              onClick={() => router.push('/admin/communities')}
            >
              <>
                View All
                <Eye size={18} />
              </>
            </CustomButton>
          </div>
          <DynamicTable
            data={communities}
            columns={columns}
            filters={[]}
            // renderActions={() => null}
            onRowClick={(community) => console.log('Clicked row:', community)}
            itemsPerPage={10}
            showFilters={true}
            showPagination={true}
            emptyMessage="No communities found"
            isLoading={isLoading}
            useServerSide={true}
            // onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
          />{' '}
        </div>
      </div>
    </>
  )
}
