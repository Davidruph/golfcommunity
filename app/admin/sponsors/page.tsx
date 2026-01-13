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
import {
  useCitiesQuery,
  useCountriesQuery,
  useStatesQuery,
  useUsersQuery,
} from '@/service/data.service'
import { Plus, ShieldBan, SquarePen, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { FormApi } from 'final-form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Form } from 'react-final-form'
import { validate } from 'validate.js'
import rtkMutation from '@/utils/rtkMutation'
import { showAlert } from '@/utils/showAlert'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import Input from '@/components/auth/Input'
import Select from '@/components/auth/Select'
import { OnChange } from 'react-final-form-listeners'
import {
  useGetSponsorsQuery,
  useRegisterSponsorMutation,
  useToggleSponsorStatusMutation,
  useUpdateSponsorMutation,
} from '@/service/sponsor.service'
import { GoDotFill } from 'react-icons/go'
import DynamicTable, { TableColumn, TableFilter } from '@/components/table/DynamicTable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PiDotsThreeOutlineLight } from 'react-icons/pi'

const constraints = {
  accountType: {
    presence: true,
  },
  firstName: {
    presence: true,
  },
  lastName: {
    presence: true,
  },
  phoneNumber: {
    presence: true,
  },
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
  },
  country: {
    presence: true,
  },
  state: {
    presence: true,
  },
  city: {
    presence: true,
  },
  zipCode: {
    presence: true,
  },
}

const update_constraints = {
  firstName: {
    presence: true,
  },
  lastName: {
    presence: true,
  },
  phoneNumber: {
    presence: true,
  },
  email: {
    presence: true,
    email: true,
  },
  zipCode: {
    presence: true,
  },
}

type onSubmitProps = {
  [key: string]: undefined | string
}

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role_name: string
  status: number | null
  membership: string
  phone_number: string
  communities_count: number
  created_at: string
  country_id?: number
  state_id?: number
  city_id?: number
  zip_code?: string
  account_type?: string
  kids_sponsored_count?: number | string
  total_donations?: number
  user_id?: number
}

export default function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [countryID, setCountryID] = useState<number | null>(null)
  const [stateID, setStateID] = useState<number | null>(null)
  const [formApi, setFormApi] = useState<FormApi<onSubmitProps> | null>(null)
  const [userToDisable, setUserToDisable] = useState<User | null>(null)

  const { data: countries } = useCountriesQuery({})
  const { data: states } = useStatesQuery(countryID, { skip: countryID === null })
  const { data: cities } = useCitiesQuery(stateID, { skip: stateID === null })
  const { data: sponsorData, isLoading } = useGetSponsorsQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    status: filtersVal.status || '',
    donation_range: filtersVal.donation_range || '',
  })

  const addSponsor = () => {
    setIsSheetOpen(true)
  }

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [registerSponsor, { isSuccess, error, isLoading: isRegistering }] =
    useRegisterSponsorMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log('Form Values:', values)
    await rtkMutation(registerSponsor, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Sponsor registration successful!', 'success')
      formApi?.reset()
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error, formApi])

  const handleEditUser = (user: User) => {
    // Set country and state IDs before opening the sheet
    console.log('User to edit:', user)
    if (user.country_id) {
      setCountryID(user.country_id)
    }
    if (user.state_id) {
      setStateID(user.state_id)
    }
    setSelectedUser(user)
    setIsEditSheetOpen(true)
  }

  const validateUpdateForm = (values: onSubmitProps) => {
    return validate(values, update_constraints) || {}
  }

  const [updateUser, { isSuccess: isUpdateSuccess, error: updateError }] =
    useUpdateSponsorMutation()
  const onUpdateSubmit = async (values: onSubmitProps) => {
    const payload = { ...values, id: selectedUser?.user_id }
    console.log('Update Payload:', payload)
    await rtkMutation(updateUser, payload)
    setIsEditSheetOpen(false)
    setSelectedUser(null)
  }

  useEffect(() => {
    if (isUpdateSuccess) {
      showAlert('Update successful!', 'success')
    } else if (updateError) {
      showAlert(getErrorMessage(updateError), 'error')
    }
  }, [isUpdateSuccess, updateError])

  const [toggleUserStatus, { isLoading: isToggleLoading }] = useToggleSponsorStatusMutation()
  const handleDisableUser = async () => {
    if (userToDisable) {
      // Add your disable mutation here
      await toggleUserStatus({ id: userToDisable.id, type: 'disable' })
      showAlert(
        `User "${userToDisable.first_name} ${userToDisable.last_name}" has been disabled`,
        'success'
      )
      setUserToDisable(null)
    }
  }

  const handleEnableUser = async () => {
    if (userToDisable) {
      // Add your disable mutation here
      await toggleUserStatus({ id: userToDisable.id, type: 'enable' })
      showAlert(
        `User "${userToDisable.first_name} ${userToDisable.last_name}" has been enabled`,
        'success'
      )
      setUserToDisable(null)
    }
  }

  const sponsors: User[] = sponsorData || []

  // Define columns
  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      header: 'NAME',
      accessor: (row) => row.first_name + ' ' + row.last_name,
    },
    {
      key: 'email',
      header: 'EMAIL',
      accessor: (row) => row.email,
    },
    {
      key: 'total_donated',
      header: 'TOTAL DONATED',
      accessor: (row) => row.total_donations,
      render: (value) => (
        <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
          {value}
        </span>
      ),
    },
    {
      key: 'kids_sponsored',
      header: 'KIDS SPONSORED',
      accessor: (row) => row.kids_sponsored_count,
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
  ]

  // Define filters
  const filters: TableFilter[] = [
    {
      key: 'search',
      type: 'search',
      placeholder: 'Search sponsors...',
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
    {
      key: 'donation_range',
      type: 'select',
      placeholder: 'Donation Range',
      options: [
        { label: '0 – 499', value: '0-499' },
        { label: '500 – 1,999', value: '500-1999' },
        { label: '2,000 – 4,999', value: '2000-4999' },
        { label: '5,000+', value: '5000+' },
      ],
    },
  ]

  const renderActions = (user: User) => (
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
          <DropdownMenuItem onClick={() => handleEditUser(user)}>
            <SquarePen className="mr-2" />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUserToDisable(user)} className="text-red-600">
            <ShieldBan className="mr-2" />
            {user?.status === 1 ? 'Disable' : 'Enable'} User
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
                <BreadcrumbPage>Sponsors Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <PageTitle
            title="Sponsors Management"
            subTitle="Manage sponsored children, their sponsors, and funded tools."
          />
          <Button icon={<Plus />} text="Add Sponsor" action={addSponsor} width="150px" />
        </div>
        <DynamicTable
          data={sponsors}
          columns={columns}
          filters={filters}
          renderActions={renderActions}
          onRowClick={(user) => console.log('Clicked row:', user)}
          itemsPerPage={10}
          showFilters={true}
          showPagination={true}
          emptyMessage="No sponsors found"
          isLoading={isLoading}
          useServerSide={true}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add Sponsor</SheetTitle>
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
                    <Select
                      name="accountType"
                      label="Account Type"
                      placeholder="Select an account type"
                      form={form}
                      options={[
                        { label: 'Golfer', value: 'Golfer' },
                        { label: 'Sponsor', value: 'Sponsor' },
                        {
                          label: 'Golf Teaching Professional',
                          value: 'Golf Teaching Professional',
                        },
                        { label: 'Tournament Director', value: 'Tournament Director' },
                        { label: 'Non Profit Organization', value: 'Non Profit Organization' },
                        { label: 'Business Owner', value: 'Business Owner' },
                        {
                          label: 'Early Thanksgiving Day Golf',
                          value: 'Early Thanksgiving Day Golf',
                        },
                        { label: 'Church Owner', value: 'Church Owner' },
                      ]}
                    />
                    <Input
                      label="SponsorFirst Name"
                      name="firstName"
                      type="text"
                      placeholder="Enter Sponsor First Name"
                      form={form}
                    />
                    <Input
                      label="Sponsor Last Name"
                      name="lastName"
                      type="text"
                      placeholder="Enter Sponsor Last Name"
                      form={form}
                    />
                    <Input
                      label="Sponsor Email"
                      name="email"
                      type="email"
                      placeholder="Enter Email"
                      form={form}
                    />
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Enter Password"
                      form={form}
                    />
                    <Input
                      label="Phone Number"
                      name="phoneNumber"
                      type="number"
                      placeholder="Enter Phone Number"
                      form={form}
                    />
                    <Select
                      name="country"
                      label="Country"
                      placeholder="Select a country"
                      form={form}
                      options={
                        countries?.map((country: { id: number; name: string }) => ({
                          value: country.id,
                          label: country.name,
                        })) || []
                      }
                    />
                    <OnChange name="country">
                      {(value: number) => {
                        setCountryID(value)
                        form.change('state', '')
                      }}
                    </OnChange>
                    <Select
                      name="state"
                      label="State"
                      placeholder="Select a state"
                      form={form}
                      options={
                        states?.map((state: { id: number; name: string }) => ({
                          value: state.id,
                          label: state.name,
                        })) || []
                      }
                    />
                    <OnChange name="state">
                      {(value: number) => {
                        setStateID(value)
                        form.change('city', '')
                      }}
                    </OnChange>
                    <Select
                      name="city"
                      label="City"
                      placeholder="Select a city"
                      form={form}
                      options={
                        cities?.map((city: { id: number; name: string }) => ({
                          value: city.id,
                          label: city.name,
                        })) || []
                      }
                    />
                    <Input
                      label="Zip Code"
                      name="zipCode"
                      type="text"
                      placeholder="Enter Zip Code"
                      form={form}
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={isRegistering || submitting}
                    >
                      {submitting ? <Loader /> : 'Create Sponsor'}
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
            <SheetTitle>Edit Users</SheetTitle>
            <SheetDescription></SheetDescription>
            {selectedUser && (
              <Form
                onSubmit={onUpdateSubmit}
                validate={validateUpdateForm}
                initialValues={{
                  firstName: selectedUser.first_name,
                  lastName: selectedUser.last_name,
                  email: selectedUser.email,
                  phoneNumber: selectedUser.phone_number,
                  zipCode: selectedUser.zip_code,
                  accountType: selectedUser.account_type,
                }}
                render={({ handleSubmit, form, submitting }) => (
                  <form onSubmit={handleSubmit}>
                    <Select
                      name="accountType"
                      label="Account Type"
                      placeholder="Select an account type"
                      form={form}
                      options={[
                        { label: 'Golfer', value: 'Golfer' },
                        { label: 'Sponsor', value: 'Sponsor' },
                        {
                          label: 'Golf Teaching Professional',
                          value: 'Golf Teaching Professional',
                        },
                        { label: 'Tournament Director', value: 'Tournament Director' },
                        { label: 'Non Profit Organization', value: 'Non Profit Organization' },
                        { label: 'Business Owner', value: 'Business Owner' },
                        {
                          label: 'Early Thanksgiving Day Golf',
                          value: 'Early Thanksgiving Day Golf',
                        },
                        { label: 'Church Owner', value: 'Church Owner' },
                      ]}
                    />
                    <Input
                      label="First Name"
                      name="firstName"
                      type="text"
                      placeholder="Enter First Name"
                      form={form}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      type="text"
                      placeholder="Enter Last Name"
                      form={form}
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Enter Email"
                      form={form}
                    />
                    <Input
                      label="Phone Number"
                      name="phoneNumber"
                      type="number"
                      placeholder="Enter Phone Number"
                      form={form}
                    />

                    <Input
                      label="Zip Code"
                      name="zipCode"
                      type="text"
                      placeholder="Enter Zip Code"
                      form={form}
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader /> : ' Update Account'}
                    </button>
                  </form>
                )}
              />
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Dialog open={!!userToDisable} onOpenChange={() => setUserToDisable(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{userToDisable?.status === 1 ? 'Disable' : 'Enable'} User</DialogTitle>
            <DialogDescription>
              Are you sure you want to {userToDisable?.status === 1 ? 'disable' : 'enable'}{' '}
              {userToDisable?.first_name} {userToDisable?.last_name}? This action will make the user
              inactive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start gap-2">
            <DialogClose asChild>
              <button type="button" className="px-4 py-2 border rounded hover:bg-gray-100">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={userToDisable?.status === 1 ? handleDisableUser : handleEnableUser}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={isToggleLoading}
            >
              {isToggleLoading ? <Loader /> : userToDisable?.status === 1 ? 'Disable' : 'Enable'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
