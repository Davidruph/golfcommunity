'use client'
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
import { Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

export default function Page() {
  const [userGrowthState, setUserGrowthState] = useState({
    series: [
      {
        name: 'New Users',
        data: [145, 178, 192, 234, 289, 312, 378, 445, 512],
      },
      {
        name: 'Active Users',
        data: [678, 745, 823, 891, 934, 1012, 1089, 1156, 1234],
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
      colors: ['#069769', '#3B82F6'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth' as const,
        width: 2,
      },
      title: {
        text: 'User Growth (New vs Active)',
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

  const [revenueAnalyticsState, setRevenueAnalyticsState] = useState({
    series: [
      {
        name: 'Subscription Revenue',
        data: [12000, 15000, 18000, 22000, 25000, 28000, 32000, 35000, 40000],
      },
      {
        name: 'Event Revenue',
        data: [8000, 9500, 11000, 13500, 15000, 17500, 19000, 21000, 24000],
      },
      {
        name: 'Merchandise',
        data: [5000, 5800, 6500, 7200, 8000, 9200, 10500, 12000, 14000],
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
      colors: ['#069769', '#F49E0C', '#8B5CF6'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth' as const,
        width: 2,
      },
      title: {
        text: 'Revenue Analytics',
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
      yaxis: {
        labels: {
          formatter: (value: number) => `$${value.toLocaleString()}`,
        },
      },
    },
  })

  const [sponsorshipState, setSponsorshipState] = useState({
    series: [
      {
        name: 'Gold Sponsors',
        data: [25, 28, 32, 35, 38, 42, 45, 48, 52],
      },
      {
        name: 'Silver Sponsors',
        data: [45, 50, 55, 58, 62, 68, 72, 78, 85],
      },
      {
        name: 'Bronze Sponsors',
        data: [78, 85, 92, 98, 105, 112, 120, 128, 135],
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
      colors: ['#FFD700', '#C0C0C0', '#CD7F32'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth' as const,
        width: 2,
      },
      title: {
        text: 'Sponsorship Trends',
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

  const [engagementState, setEngagementState] = useState({
    series: [
      {
        name: 'Post Engagement',
        data: [65, 68, 72, 75, 78, 82, 85, 88, 92],
      },
      {
        name: 'Event Participation',
        data: [55, 58, 62, 65, 68, 72, 75, 78, 82],
      },
      {
        name: 'Comment Activity',
        data: [45, 48, 52, 55, 58, 62, 65, 70, 75],
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
      colors: ['#069769', '#F43F5E', '#3B82F6'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth' as const,
        width: 2,
      },
      title: {
        text: 'Community Engagement (%)',
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
      yaxis: {
        labels: {
          formatter: (value: number) => `${value}%`,
        },
        min: 0,
        max: 100,
      },
    },
  })

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
            title="Reports & Analytics"
            subTitle="Comprehensive analytics and insights for your platform."
          />
          <div className="flex flex-col md:flex-row gap-2 items-center justify-start md:justify-end">
            <CustomButton
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-[15px] h-[41px]"
              onClick={exportData}
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </CustomButton>
          </div>
        </div>

        <div className="mt-5 flex flex-col md:flex-row justify-between gap-3 items-center">
          <div className="border border-[#F2F2F2] w-full h-[355px] rounded-[20px] bg-transparent p-2">
            <Chart
              options={userGrowthState.options}
              series={userGrowthState.series}
              type="area"
              height={340}
            />
          </div>
          <div className="border border-[#F2F2F2] w-full h-[355px] rounded-[20px] bg-transparent p-2">
            <Chart
              options={revenueAnalyticsState.options}
              series={revenueAnalyticsState.series}
              type="area"
              height={340}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col md:flex-row justify-between gap-3 items-center">
          <div className="border border-[#F2F2F2] w-full h-[355px] rounded-[20px] bg-transparent p-2">
            <Chart
              options={sponsorshipState.options}
              series={sponsorshipState.series}
              type="area"
              height={340}
            />
          </div>
          <div className="border border-[#F2F2F2] w-full h-[355px] rounded-[20px] bg-transparent p-2">
            <Chart
              options={engagementState.options}
              series={engagementState.series}
              type="area"
              height={340}
            />
          </div>
        </div>
      </div>
    </>
  )
}
