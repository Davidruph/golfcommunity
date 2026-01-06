'use client'
import Button from '@/components/admin/Button'
import PageTitle from '@/components/admin/PageTitle'
import Table from '@/components/admin/Table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Plus } from 'lucide-react'
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

export default function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const addUser = () => {
    setIsSheetOpen(true)
  }

  const [countryID, setCountryID] = useState<number | null>(null)
  const [stateID, setStateID] = useState<number | null>(null)

  const { data: countries } = useCountriesQuery({})
  const { data: states } = useStatesQuery(countryID, { skip: countryID === null })
  const { data: cities } = useCitiesQuery(stateID, { skip: stateID === null })

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [register, { isSuccess, error }] = useRegisterMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log(values)
    await rtkMutation(register, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Registration successful!', 'success')
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error])

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
          <Button icon={<Plus />} text="Add Community" action={addUser} width="160px" />
        </div>

        <Table />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent className="w-[490px] sm:w-[540px]">
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
