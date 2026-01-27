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
import Loader from '@/components/website/loaders/Loader'
import { Plus, ShieldBan, SquarePen } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import Select from '@/components/auth/Select'
import Input from '@/components/auth/Input'
import { validate } from 'validate.js'
import type { FormApi } from 'final-form'
import { useUsersQuery } from '@/service/data.service'
import Textarea from '@/components/auth/Textarea'
import ImageSelector from '@/components/auth/ImageSelector'
import { useSelector } from 'react-redux'
import { showAlert } from '@/utils/showAlert'
import {
  useGetCampaignsQuery,
  useRegisterCampaignMutation,
  useToggleCampaignStatusMutation,
  useUpdateCampaignMutation,
} from '@/service/campaign.service'
import DynamicTable, { TableColumn, TableFilter } from '@/components/table/DynamicTable'
import { GoDotFill } from 'react-icons/go'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PiDotsThreeOutlineLight } from 'react-icons/pi'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import rtkMutation from '@/utils/rtkMutation'
import { getErrorMessage } from '@/utils/formatErrorResponse'

const constraints = {
  campaignTitle: {
    presence: true,
  },
  sponsoredKids: {
    presence: true,
  },
  targetAmount: {
    presence: true,
  },
  description: {
    presence: true,
  },
  bannerImage: {
    presence: true,
  },
  deadline: {
    presence: true,
  },
}

type onSubmitProps = {
  [key: string]: undefined | string
}

type Campaign = {
  id: number
  campaign_title: string
  description: string
  first_name: string
  last_name: string
  email: string
  target_amount: string
  status: number
  created_at: string
  sponsored_kid: string
  deadline: string
  banner_image: string
}

export default function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})
  const [formApi, setFormApi] = useState<FormApi<onSubmitProps> | null>(null)
  const { data: usersData } = useUsersQuery({})
  const { token } = useSelector((state: { user: { token: string | null } }) => state.user)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const [campaignToDisable, setCampaignToDisable] = useState<Campaign | null>(null)

  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    refetch,
  } = useGetCampaignsQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    status: filtersVal.status || '',
  })

  const addSponsoredKids = () => {
    setIsSheetOpen(true)
  }

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }
  const [registerCampaign, { isLoading: isRegistering, isSuccess, error }] =
    useRegisterCampaignMutation()
  const onSubmit = async (values: onSubmitProps) => {
    if (!values.bannerImage) {
      showAlert('Please upload a banner image', 'error')
      return
    }
    console.log('Form Values:', values)
    await rtkMutation(registerCampaign, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Campaign registration successful!', 'success')
      formApi?.reset()
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error, formApi])

  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation()
  const onUpdateSubmit = async (values: onSubmitProps) => {
    if (!selectedCampaign) return
    await rtkMutation(updateCampaign, { id: selectedCampaign.id, ...values })
    setIsEditSheetOpen(false)
    setSelectedCampaign(null)
    showAlert('Campaign updated successfully!', 'success')
  }

  const handleEditCampaign = (campaign: Campaign) => {
    // Set country and state IDs before opening the sheet
    console.log('Campaign to edit:', campaign)
    setSelectedCampaign(campaign)
    setIsEditSheetOpen(true)
  }

  const campaigns: Campaign[] = campaignsData || []

  // Define columns
  const columns: TableColumn<Campaign>[] = [
    {
      key: 'campaign_title',
      header: 'CAMPAIGN TITLE',
      accessor: (row) => row.campaign_title,
    },
    {
      key: 'campaign_description',
      header: 'DESCRIPTION',
      accessor: (row) => row.description,
    },
    {
      key: 'kid_name',
      header: 'KID NAME',
      accessor: (row) => row.first_name + ' ' + row.last_name,
    },
    {
      key: 'email',
      header: 'KID EMAIL',
      accessor: (row) => row.email,
    },
    {
      key: 'target_amount',
      header: 'TARGET AMOUNT',
      accessor: (row) => row.target_amount,
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

  const filters: TableFilter[] = [
    {
      key: 'search',
      type: 'search',
      placeholder: 'Search...',
      onChange: (value) => console.log('Search:', value),
    },
    {
      key: 'status',
      type: 'select',
      placeholder: 'All Statuses',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 },
        { label: 'Pending', value: 2 },
      ],
    },
  ]

  const renderActions = (campaign: Campaign) => (
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
          <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
            <SquarePen className="mr-2" />
            Edit Campaign
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCampaignToDisable(campaign)} className="text-red-600">
            <ShieldBan className="mr-2" />
            {campaign?.status === 1 ? 'Disable' : 'Enable'} Campaign
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

  const [toggleCampaignStatus, { isLoading: isToggleLoading }] = useToggleCampaignStatusMutation()
  const handleDisableCampaign = async () => {
    if (campaignToDisable) {
      // Add your disable mutation here
      await toggleCampaignStatus({ id: campaignToDisable.id, type: 'disable' })
      showAlert(`Campaign "${campaignToDisable.campaign_title}" has been disabled`, 'success')
      setCampaignToDisable(null)
    }
  }

  const handleEnableCampaign = async () => {
    if (campaignToDisable) {
      // Add your disable mutation here
      await toggleCampaignStatus({ id: campaignToDisable.id, type: 'enable' })
      showAlert(`Campaign "${campaignToDisable.campaign_title}" has been enabled`, 'success')
      setCampaignToDisable(null)
    }
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
                <BreadcrumbPage>Sponsored Kids</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <PageTitle
            title="Sponsored Kids"
            subTitle="Manage sponsored children, their sponsors, and funded tools."
          />
          <Button
            icon={<Plus />}
            text="Add Sponsored Kids"
            action={addSponsoredKids}
            width="190px"
          />
        </div>
        <DynamicTable
          data={campaigns}
          columns={columns}
          filters={filters}
          renderActions={renderActions}
          onRowClick={(user) => console.log('Clicked row:', user)}
          itemsPerPage={10}
          showFilters={true}
          showPagination={true}
          emptyMessage="No campaigns found"
          isLoading={campaignsLoading}
          useServerSide={true}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add Campaign</SheetTitle>
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
                      label="Campaign Title"
                      name="campaignTitle"
                      type="text"
                      placeholder="Enter Campaign Title"
                      form={form}
                    />

                    <Select
                      label="Select Sponsored Kids"
                      name="sponsoredKids"
                      placeholder="Select Sponsored Kids"
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
                    <Input
                      label="Target Amount"
                      name="targetAmount"
                      type="number"
                      placeholder="Enter Target Amount"
                      form={form}
                    />

                    <Input
                      label="Deadline"
                      name="deadline"
                      type="date"
                      placeholder="Enter Deadline"
                      form={form}
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Enter Description"
                      form={form}
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={isRegistering || submitting}
                    >
                      {isRegistering || submitting ? <Loader /> : 'Add Campaign'}
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
            <SheetTitle>Edit Campaign</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onUpdateSubmit}
              validate={validateForm}
              initialValues={
                selectedCampaign
                  ? {
                      campaignTitle: selectedCampaign.campaign_title,
                      targetAmount: selectedCampaign.target_amount,
                      deadline: new Date(selectedCampaign.deadline).toISOString().split('T')[0],
                      description: selectedCampaign.description,
                      sponsoredKids: selectedCampaign.sponsored_kid,
                      bannerImage: selectedCampaign.banner_image,
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
                      existingImage={selectedCampaign?.banner_image}
                    />

                    <Input
                      label="Campaign Title"
                      name="campaignTitle"
                      type="text"
                      placeholder="Enter Campaign Title"
                      form={form}
                    />

                    <Select
                      label="Select Sponsored Kids"
                      name="sponsoredKids"
                      placeholder="Select Sponsored Kids"
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
                    <Input
                      label="Target Amount"
                      name="targetAmount"
                      type="number"
                      placeholder="Enter Target Amount"
                      form={form}
                    />

                    <Input
                      label="Deadline"
                      name="deadline"
                      type="date"
                      placeholder="Enter Deadline"
                      form={form}
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Enter Description"
                      form={form}
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={isUpdating || submitting}
                    >
                      {isUpdating || submitting ? <Loader /> : 'Update Campaign'}
                    </button>
                  </form>
                )
              }}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Dialog open={!!campaignToDisable} onOpenChange={() => setCampaignToDisable(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {campaignToDisable?.status === 1 ? 'Disable' : 'Enable'} Campaign
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {campaignToDisable?.status === 1 ? 'disable' : 'enable'}{' '}
              {campaignToDisable?.campaign_title}? This action will make the campaign inactive.
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
                campaignToDisable?.status === 1 ? handleDisableCampaign : handleEnableCampaign
              }
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={isToggleLoading}
            >
              {isToggleLoading ? (
                <Loader />
              ) : campaignToDisable?.status === 1 ? (
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
