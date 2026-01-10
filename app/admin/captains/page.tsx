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
import { ShieldBan } from 'lucide-react'
import Loader from '@/components/website/loaders/Loader'
import DynamicTable, { TableColumn, TableFilter } from '@/components/table/DynamicTable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GoDotFill } from 'react-icons/go'
import { PiDotsThreeOutlineLight } from 'react-icons/pi'
import {
  useToggleCommunityCaptainStatusMutation,
  useGetCommunityCaptainsQuery,
} from '@/service/community.service'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { showAlert } from '@/utils/showAlert'
import { useState } from 'react'
interface Captain {
  id: string
  captain_id: number
  captain_first_name: string
  captain_last_name: string
  captain_email: string
  communities_count: string
  total_members: string
  is_active: number | null
  timezone: string
  activity: string
  post_count: string
}

interface UserState {
  user: {
    id: number
  } | null
  token: string | null
}
interface RootState {
  user: UserState
}

export default function Page() {
  const [captainToDisable, setcaptainToDisable] = useState<Captain | null>(null)
  const [page, setPage] = useState(1)
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})

  const { data: captainData, isLoading: isCaptainLoading } = useGetCommunityCaptainsQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    activity: filtersVal.activity || '',
  })

  const [toggleCommunityCaptainStatus, { isLoading: isToggleLoading }] =
    useToggleCommunityCaptainStatusMutation()
  const handleDisableCommunity = async () => {
    if (captainToDisable) {
      // Add your disable mutation here
      await toggleCommunityCaptainStatus({ id: captainToDisable.captain_id, type: 'disable' })
      showAlert(
        `Community "${captainToDisable.captain_first_name + ' ' + captainToDisable.captain_last_name}" has been disabled`,
        'success'
      )
      setcaptainToDisable(null)
    }
  }

  const handleEnableCommunity = async () => {
    if (captainToDisable) {
      // Add your disable mutation here
      await toggleCommunityCaptainStatus({ id: captainToDisable.captain_id, type: 'enable' })
      showAlert(
        `Community "${captainToDisable.captain_first_name + ' ' + captainToDisable.captain_last_name}" has been enabled`,
        'success'
      )
      setcaptainToDisable(null)
    }
  }

  const captains: Captain[] = captainData || []

  // Define columns
  const columns: TableColumn<Captain>[] = [
    {
      key: 'name',
      header: 'CAPTAIN NAME',
      accessor: (row) => row.captain_first_name + ' ' + row.captain_last_name,
    },
    {
      key: 'email',
      header: 'EMAIL',
      accessor: (row) => row.captain_email,
    },
    {
      key: 'role',
      header: 'COMMUNITIES MANAGED',
      accessor: (row) => row.communities_count,
      render: (value) => (
        <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
          {value}
        </span>
      ),
    },
    {
      key: 'members_count',
      header: 'TOTAL MEMBERS',
      accessor: (row) => row.total_members,
      render: (value) => (
        <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
          {value}
        </span>
      ),
    },
    {
      key: 'activity',
      header: 'PERFORMANCE SCORE',
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
      accessor: (row) => row.is_active,
      render: (value) => (
        <span className="table-badge px-2 py-1 items-center flex w-[100px] h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB] justify-start">
          <GoDotFill className={`${value == 1 ? 'text-[#069769]' : 'text-[#FF0000]'}`} />
          {value == 1 ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  // Define filters
  const filters: TableFilter[] = [
    {
      key: 'search',
      type: 'search',
      placeholder: 'Search captains...',
      onChange: (value) => console.log('Search:', value),
    },
    {
      key: 'activity',
      type: 'select',
      placeholder: 'Performance',
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
      ],
    },
  ]

  // Custom actions render with dropdown
  const renderActions = (captain: Captain) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <button className="p-2 hover:bg-gray-100 rounded">
          <PiDotsThreeOutlineLight size={20} color="black" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setcaptainToDisable(captain)} className="text-red-600">
            <ShieldBan className="mr-2" />
            {captain?.is_active === 1 ? 'Disable' : 'Enable'} Captain
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFiltersVal(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  // Handle page changes
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
                <BreadcrumbPage>Captains Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-2">
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <PageTitle
            title="Captains Management"
            subTitle="View and manage community captains and their performance."
          />
        </div>
        <DynamicTable
          data={captains}
          columns={columns}
          filters={filters}
          renderActions={renderActions}
          onRowClick={(captain) => console.log('Clicked row:', captain)}
          itemsPerPage={10}
          showFilters={true}
          showPagination={true}
          emptyMessage="No captains found"
          isLoading={isCaptainLoading}
          useServerSide={true}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
        />{' '}
      </div>

      <Dialog open={!!captainToDisable} onOpenChange={() => setcaptainToDisable(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {captainToDisable?.is_active == 1 ? 'Disable' : 'Enable'} Captain
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {captainToDisable?.is_active == 1 ? 'disable' : 'enable'}{' '}
              {captainToDisable?.captain_first_name + ' ' + captainToDisable?.captain_last_name}?
              This action will make the captain{' '}
              {captainToDisable?.is_active == 1 ? 'inactive' : 'active'}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start gap-2">
            <DialogClose asChild>
              <button type="button" className="px-4 py-2 border rounded hover:bg-gray-100">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={
                captainToDisable?.is_active == 1 ? handleDisableCommunity : handleEnableCommunity
              }
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={isToggleLoading}
            >
              {isToggleLoading ? (
                <Loader />
              ) : captainToDisable?.is_active == 1 ? (
                'Disable'
              ) : (
                'Enable'
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
