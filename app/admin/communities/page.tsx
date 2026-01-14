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
import { BadgeCheck, Plus, ShieldBan, SquarePen, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import rtkMutation from '@/utils/rtkMutation'
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
import {
  useGetCommunitiesQuery,
  useUpdateCommunityMutation,
  useRegisterCommunityMutation,
  useToggleCommunityStatusMutation,
} from '@/service/community.service'
import Textarea from '@/components/auth/Textarea'
import { useUsersQuery } from '@/service/data.service'
import { useSelector } from 'react-redux'
import type { FormApi } from 'final-form'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ImageSelector from '@/components/auth/ImageSelector'
import enviroment from '@/configuration/siteConfig'
import axios from 'axios'
import Image from 'next/image'

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
  // bannerImage: {
  //   presence: true,
  // },
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
  member_user_id?: string
  banner_image?: string
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
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [communityToDisable, setCommunityToDisable] = useState<Community | null>(null)
  const [page, setPage] = useState(1)
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})
  const { data: usersData } = useUsersQuery({})
  const { user } = useSelector((state: RootState) => state.user)
  const [formApi, setFormApi] = useState<FormApi<onSubmitProps> | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const { token } = useSelector((state: { user: { token: string | null } }) => state.user)

  const addCommunity = () => {
    setIsSheetOpen(true)
  }

  const {
    data: communitiesData,
    isLoading,
    refetch,
  } = useGetCommunitiesQuery({
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

  const [registerCommunity, { isSuccess, isLoading: communityLoading, error }] =
    useRegisterCommunityMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log('Form Values:', values)
    if (!values.bannerImage) {
      showAlert('Please upload a banner image', 'error')
      return
    }
    const createdBy = user?.id || 0
    values['created_by'] = String(createdBy)
    setFormApi(formApi)
    await rtkMutation(registerCommunity, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Community registration successful!', 'success')
      formApi?.reset()
      setIsSheetOpen(false)
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error, formApi])

  const [
    updateCommunity,
    { isLoading: isUpdateLoading, error: updateError, isSuccess: isUpdateSuccess },
  ] = useUpdateCommunityMutation()
  const onUpdateSubmit = async (values: onSubmitProps) => {
    if (!selectedCommunity) return
    console.log('Form Values:', values)

    values['id'] = String(selectedCommunity.id)
    await rtkMutation(updateCommunity, values)
    setIsEditSheetOpen(false)
    setSelectedCommunity(null)
  }

  useEffect(() => {
    if (isUpdateSuccess) {
      showAlert('Community updated successfully!', 'success')
      formApi?.reset()
    } else if (updateError) {
      showAlert(getErrorMessage(updateError), 'error')
    }
  }, [isUpdateSuccess, updateError, formApi])

  const [toggleCommunityStatus, { isLoading: isToggleLoading }] = useToggleCommunityStatusMutation()
  const handleDisableCommunity = async () => {
    if (communityToDisable) {
      // Add your disable mutation here
      await toggleCommunityStatus({ id: communityToDisable.id, type: 'disable' })
      showAlert(`Community "${communityToDisable.name}" has been disabled`, 'success')
      setCommunityToDisable(null)
    }
  }

  const handleEnableCommunity = async () => {
    if (communityToDisable) {
      // Add your disable mutation here
      await toggleCommunityStatus({ id: communityToDisable.id, type: 'enable' })
      showAlert(`Community "${communityToDisable.name}" has been enabled`, 'success')
      setCommunityToDisable(null)
    }
  }

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
    {
      key: 'description',
      header: 'DESCRIPTION',
      accessor: (row) => row.description,
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
      key: 'banner_image',
      header: 'BANNER',
      accessor: (row) => row.banner_image,
      render: (value) => {
        const imageUrl = typeof value === 'string' ? value : ''
        return imageUrl ? (
          <Image
            src={imageUrl}
            alt="Banner Image"
            width={30}
            height={12}
            className="w-20 h-12 object-cover rounded"
          />
        ) : (
          'No Image'
        )
      },
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
      placeholder: 'Search communities...',
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
          <DropdownMenuItem
            onClick={() => {
              setSelectedCommunity(community)
              setIsEditSheetOpen(true)
            }}
          >
            <SquarePen className="mr-2" />
            Edit Community
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setCommunityToDisable(community)}
            className="text-red-600"
          >
            <ShieldBan className="mr-2" />
            {community?.status === 1 ? 'Disable' : 'Enable'} Community
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
                    <ImageSelector name="bannerImage" label="Banner Image" form={form} />

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
                      label="Community Admin/Captain"
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
                      disabled={communityLoading || submitting}
                    >
                      {communityLoading ? <Loader /> : 'Create Community'}
                    </button>
                  </form>
                )
              }}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Update Community</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onUpdateSubmit}
              validate={validateForm}
              initialValues={
                selectedCommunity
                  ? {
                      name: selectedCommunity.name,
                      description: selectedCommunity.description,
                      captain: selectedCommunity.member_user_id,
                      timezone: selectedCommunity.timezone,
                      bannerImage: selectedCommunity.banner_image,
                    }
                  : {}
              }
              render={({ handleSubmit, form, submitting }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <ImageSelector
                      name="bannerImage"
                      label="Banner Image"
                      form={form}
                      existingImage={selectedCommunity?.banner_image}
                    />

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
                      disabled={isUpdateLoading || submitting}
                    >
                      {isUpdateLoading || submitting ? <Loader /> : 'Update Community'}
                    </button>
                  </form>
                )
              }}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Dialog open={!!communityToDisable} onOpenChange={() => setCommunityToDisable(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {communityToDisable?.status === 1 ? 'Disable' : 'Enable'} Community
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {communityToDisable?.status === 1 ? 'disable' : 'enable'}{' '}
              {communityToDisable?.name}? This action will make the community inactive.
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
                communityToDisable?.status === 1 ? handleDisableCommunity : handleEnableCommunity
              }
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={isToggleLoading}
            >
              {isToggleLoading ? (
                <Loader />
              ) : communityToDisable?.status === 1 ? (
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
