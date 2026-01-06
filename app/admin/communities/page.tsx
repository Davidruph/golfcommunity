'use client'
import Button from '@/components/admin/Button'
import PageTitle from '@/components/admin/PageTitle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { BadgeCheck, Plus, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import rtkMutation from '@/utils/rtkMutation'
import { useRegisterCommunityMutation } from '@/service/community.service'
import { validate } from 'validate.js'
import { showAlert } from '@/utils/showAlert'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import { Form } from 'react-final-form'
import Input from '@/components/auth/Input'
import Select from '@/components/auth/Select'
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
import { useGetCommunitiesQuery } from '@/service/community.service'
import Textarea from '@/components/auth/Textarea'
import { useUsersQuery } from '@/service/data.service'
import { useSelector } from 'react-redux'
import type { FormApi } from 'final-form'

const constraints = {
  name: {
    presence: true,
  },
  captain: {
    presence: true,
  },
  timezone: {
    presence: true,
  },
}

type onSubmitProps = {
  [key: string]: undefined | string
}

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
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})
  const { data: usersData } = useUsersQuery({})
  const { user } = useSelector((state: RootState) => state.user)
  const [formApi, setFormApi] = useState<FormApi<onSubmitProps> | null>(null)

  const addCommunity = () => {
    setIsSheetOpen(true)
  }

  const { data: communitiesData, isLoading } = useGetCommunitiesQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    timezone: filtersVal.timezone || '',
    status: filtersVal.status || '',
    activity: filtersVal.activity || '',
  })

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [createCommunity, { isSuccess, error }] = useRegisterCommunityMutation()
  const onSubmit = async (values: onSubmitProps) => {
    const payload = {
      ...values,
      created_by: user?.id,
    }

    // console.log('Payload:', payload)
    await rtkMutation(createCommunity, payload)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Registration successful!', 'success')
      formApi?.reset()
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error, formApi])

  const communities: Community[] = communitiesData || []
  const timezoneOptions = Intl.supportedValuesOf('timeZone').map((tz) => ({
    label: tz,
    value: tz,
  }))

  // Define columns
  const columns: TableColumn<Community>[] = [
    {
      key: 'name',
      header: 'COMMUNITY NAME',
      accessor: (row) => row.name,
    },
    // {
    //   key: 'description',
    //   header: 'DESCRIPTION',
    //   accessor: (row) => row.description,
    // },
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

  // Define filters
  const filters: TableFilter[] = [
    {
      key: 'search',
      type: 'search',
      placeholder: 'Search users by name or email...',
      onChange: (value) => console.log('Search:', value),
    },
    {
      key: 'status',
      type: 'select',
      placeholder: 'All Statuses',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 },
      ],
    },
    {
      key: 'activity',
      type: 'select',
      placeholder: 'Activity Level',
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
      ],
    },
    {
      key: 'timezone',
      type: 'select',
      placeholder: 'Timezone',
      options: timezoneOptions,
    },
  ]

  // Custom actions render with dropdown
  const renderActions = (community: Community) => (
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
          <DropdownMenuItem onClick={() => console.log('Edit', community)}>
            <BadgeCheck className="mr-2" />
            Edit Community
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log('Delete', community)}
            className="text-red-600"
          >
            <Trash2 className="mr-2" />
            Delete Community
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
                <BreadcrumbPage>Communities Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-2">
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <PageTitle
            title="Communities Management"
            subTitle="Manage communities, captains, and membership settings."
          />
          <Button icon={<Plus />} text="Add Community" action={addCommunity} width="160px" />
        </div>
        <DynamicTable
          data={communities}
          columns={columns}
          filters={filters}
          renderActions={renderActions}
          onRowClick={(community) => console.log('Clicked row:', community)}
          itemsPerPage={10}
          showFilters={true}
          showPagination={true}
          emptyMessage="No communities found"
          isLoading={isLoading}
          useServerSide={true}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
        />{' '}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add Communities</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => {
                if (!formApi) {
                  setFormApi(form)
                }
                return (
                  <form onSubmit={handleSubmit}>
                    <Input
                      label="Community Name"
                      name="name"
                      type="text"
                      placeholder="Enter community Name"
                      form={form}
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Enter Description"
                      form={form}
                    />
                    <Select
                      label="Select Captain"
                      name="captain"
                      placeholder="Select Captain"
                      form={form}
                      options={
                        usersData?.map(
                          (user: {
                            id: number
                            first_name: string
                            last_name: string
                            email: string
                          }) => ({
                            label: `${user.first_name} ${user.last_name} (${user.email})`,
                            value: user.id,
                          })
                        ) || []
                      }
                    />
                    <Select
                      label="Select Timezone"
                      name="timezone"
                      placeholder="Select Timezone"
                      form={form}
                      options={timezoneOptions}
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader /> : 'Create Community'}
                    </button>
                  </form>
                )
              }}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}
