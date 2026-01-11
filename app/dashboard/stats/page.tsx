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
import cupicon from '@/public/dashboard/cup.svg'
import hash from '@/public/dashboard/hash.svg'
import stats from '@/public/dashboard/stats.svg'
import rounds from '@/public/dashboard/rounds.svg'

const pagestats = [
  { title: 'Handicap Score', value: '12.4', stat: '0.2', bgIcon: hash },
  { title: 'Average Score', value: '83.6', stat: '0.2', bgIcon: stats },
  { title: 'Best Round', value: '79', stat: '0.2', bgIcon: cupicon },
  { title: 'Rounds', value: '5', stat: '0.2', bgIcon: rounds },
]

import dynamic from 'next/dynamic'
import { useState } from 'react'
import DynamicTable, { TableColumn } from '@/components/table/DynamicTable'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface ActivityFeed {
  id: string
  date: string
  course: string
  score: number
  diff: string
  matchType: string
}

export default function Page() {
  const [scoringTrendState, setScoringTrendState] = useState({
    series: [
      {
        name: 'Score',
        data: [85, 82, 88, 79, 83, 81, 84, 78, 80],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'area' as const,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#069769'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight' as const,
        width: 2,
      },
      title: {
        text: 'Scoring Trend',
        align: 'left' as const,
        style: {
          fontSize: '18px',
          fontWeight: '600',
        },
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          'Round 1',
          'Round 2',
          'Round 3',
          'Round 4',
          'Round 5',
          'Round 6',
          'Round 7',
          'Round 8',
          'Round 9',
        ],
      },
      yaxis: {
        reversed: true, // Lower scores are better in golf
        title: {
          text: 'Score',
        },
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

  const gameInsights = [
    { stat: 'Fairways Hit', value: 72, color: '#069769' },
    { stat: 'Greens in Regulation', value: 58, color: '#3B82F6' },
    { stat: 'Putts per Round', value: 85, color: '#F49E0C' },
  ]

  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Dummy activity feed data
  const activityFeed: ActivityFeed[] = [
    {
      id: '1',
      date: '2026-01-10',
      course: 'Pebble Beach Golf Links',
      score: 82,
      diff: '-3',
      matchType: 'Stroke Play',
    },
    {
      id: '2',
      date: '2026-01-08',
      course: 'Augusta National',
      score: 88,
      diff: '+4',
      matchType: 'Match Play',
    },
    {
      id: '3',
      date: '2026-01-05',
      course: 'St Andrews Old Course',
      score: 79,
      diff: '-6',
      matchType: 'Stroke Play',
    },
    {
      id: '4',
      date: '2026-01-03',
      course: 'Pinehurst No. 2',
      score: 85,
      diff: '+1',
      matchType: 'Scramble',
    },
    {
      id: '5',
      date: '2025-12-28',
      course: 'TPC Sawgrass',
      score: 81,
      diff: '-4',
      matchType: 'Stroke Play',
    },
    {
      id: '6',
      date: '2025-12-22',
      course: 'Whistling Straits',
      score: 84,
      diff: '+2',
      matchType: 'Match Play',
    },
    {
      id: '7',
      date: '2025-12-18',
      course: 'Torrey Pines',
      score: 78,
      diff: '-7',
      matchType: 'Stroke Play',
    },
    {
      id: '8',
      date: '2025-12-15',
      course: 'Bethpage Black',
      score: 91,
      diff: '+8',
      matchType: 'Best Ball',
    },
    {
      id: '9',
      date: '2025-12-10',
      course: 'Oakmont Country Club',
      score: 83,
      diff: '-2',
      matchType: 'Stroke Play',
    },
    {
      id: '10',
      date: '2025-12-05',
      course: 'Shinnecock Hills',
      score: 86,
      diff: '+3',
      matchType: 'Scramble',
    },
  ]

  const columns: TableColumn<ActivityFeed>[] = [
    {
      key: 'date',
      header: 'DATE',
      accessor: (row) => row.date,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">
          {new Date(value as string).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'course',
      header: 'COURSE',
      accessor: (row) => row.course,
      render: (value) => <span className="text-sm font-medium text-gray-700">{value}</span>,
    },
    {
      key: 'score',
      header: 'SCORE',
      accessor: (row) => row.score,
      render: (value) => <span className="text-sm font-semibold text-gray-900">{value}</span>,
    },
    {
      key: 'diff',
      header: 'DIFF',
      accessor: (row) => row.diff,
      render: (value) => {
        const diff = value as string
        const isPositive = diff.startsWith('+')
        const isNegative = diff.startsWith('-')

        return (
          <span
            className={`text-sm font-semibold ${
              isNegative ? 'text-green-600' : isPositive ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {diff}
          </span>
        )
      },
    },
    {
      key: 'matchType',
      header: 'MATCH TYPE',
      accessor: (row) => row.matchType,
      render: (value) => (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {value}
        </span>
      ),
    },
  ]

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
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
                <BreadcrumbPage>My Stats</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col md:flex-row gap-3">
          {pagestats.map((stat) => (
            <Card
              key={stat.title}
              title={stat.title}
              value={stat.value}
              stat={stat.stat}
              bgIcon={stat.bgIcon}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-col md:flex-row gap-3 items-center">
          <div className="border border-[#F2F2F2] w-full rounded-[20px] bg-transparent p-2">
            <Chart
              options={scoringTrendState.options}
              series={scoringTrendState.series}
              type="area"
              height={380}
            />
          </div>
          <div className="border border-[#F2F2F2] w-full rounded-[20px] bg-transparent p-6">
            <h3 className="text-lg font-semibold mb-6">Game Insights</h3>
            <div className="flex flex-col gap-6">
              {gameInsights.map((insight, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{insight.stat}</span>
                    <span className="text-sm font-semibold" style={{ color: insight.color }}>
                      {insight.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${insight.value}%`,
                        backgroundColor: insight.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">Performance Summary</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Best Stat</p>
                    <p className="text-sm font-semibold text-gray-900">Putts per Round</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Focus Area</p>
                    <p className="text-sm font-semibold text-gray-900">GIR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="quick-actions mb-5">Activity Feed</p>
          <DynamicTable
            data={activityFeed}
            columns={columns}
            filters={[]}
            onRowClick={(activity) => console.log('Clicked row:', activity)}
            itemsPerPage={10}
            showFilters={false}
            showPagination={true}
            emptyMessage="No activity found"
            isLoading={isLoading}
            useServerSide={false}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  )
}
