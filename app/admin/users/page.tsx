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
  SheetTrigger,
} from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import rtkMutation from '@/utils/rtkMutation'
import { useRegisterMutation } from '@/service/auth.service'
import { useCitiesQuery, useCountriesQuery, useStatesQuery } from '@/service/data.service'
import { validate } from 'validate.js'
import { showAlert } from '@/utils/showAlert'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import { Form } from 'react-final-form'
import Input from '@/components/auth/Input'
import Select from '@/components/auth/Select'
import { OnChange } from 'react-final-form-listeners'
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
import { useGetUsersQuery } from '@/service/user.service'
import { useGetRolesQuery } from '@/service/role.service'

const constraints = {
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

type onSubmitProps = {
  [key: string]: undefined | string
}

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role_name: string
  status: string | null
  membership: string
  phone_number: string
  communities_count: number
  created_at: string
}

export default function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})

  const addUser = () => {
    setIsSheetOpen(true)
  }

  const [countryID, setCountryID] = useState<number | null>(null)
  const [stateID, setStateID] = useState<number | null>(null)
  const { data: usersData, isLoading } = useGetUsersQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    role: filtersVal.role || '',
    status: filtersVal.status || '',
    membership: filtersVal.membership || '',
  })
  const { data: countries } = useCountriesQuery({})
  const { data: states } = useStatesQuery(countryID, { skip: countryID === null })
  const { data: cities } = useCitiesQuery(stateID, { skip: stateID === null })

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [register, { isSuccess, error }] = useRegisterMutation()
  const onSubmit = async (values: onSubmitProps) => {
    await rtkMutation(register, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Registration successful!', 'success')
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error])

  const { data: rolesData } = useGetRolesQuery({})
  const roleOptions =
    rolesData?.map((role: { id: number; name: string }) => ({
      label: role.name,
      value: role.name,
    })) || []

  const users: User[] = usersData || []

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
      key: 'role',
      header: 'ROLE',
      accessor: (row) => row.role_name,
      render: (value) => (
        <span className="table-badge px-2 py-1 inline-flex items-center h-[26px] gap-2 rounded-[100px] border-[0.5px] border-[#EBEBEB]">
          {value}
        </span>
      ),
    },
    {
      key: 'membership',
      header: 'MEMBERSHIP',
      accessor: (row) => row.membership,
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
      key: 'communities',
      header: 'COMMUNITIES',
      accessor: (row) => row.communities_count,
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
      key: 'role',
      type: 'select',
      placeholder: 'All Roles',
      options: roleOptions,
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
      key: 'membership',
      type: 'select',
      placeholder: 'All Tiers',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Premium', value: 'premium' },
        { label: 'Pro', value: 'pro' },
      ],
    },
  ]

  // Custom actions render with dropdown
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
          <DropdownMenuItem onClick={() => console.log('Edit', user)}>
            <BadgeCheck className="mr-2" />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Delete', user)} className="text-red-600">
            <Trash2 className="mr-2" />
            Delete User
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
                <BreadcrumbPage>Users Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-2">
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <PageTitle
            title="Users Management"
            subTitle="Manage all platform users, roles, and memberships."
          />
          <Button icon={<Plus />} text="Add New User" action={addUser} width="150px" />
        </div>
        <DynamicTable
          data={users}
          columns={columns}
          filters={filters}
          renderActions={renderActions}
          onRowClick={(user) => console.log('Clicked row:', user)}
          itemsPerPage={10}
          showFilters={true}
          showPagination={true}
          emptyMessage="No users found"
          isLoading={isLoading}
          useServerSide={true}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
        />{' '}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add Users</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => (
                <form onSubmit={handleSubmit}>
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
                    disabled={submitting}
                  >
                    {submitting ? <Loader /> : 'Create Account'}
                  </button>
                </form>
              )}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}
