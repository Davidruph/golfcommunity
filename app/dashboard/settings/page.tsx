'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import ImageSelector from '@/components/auth/ImageSelector'
import Loader from '@/components/website/loaders/Loader'
import Select from '@/components/auth/Select'
import Input from '@/components/auth/Input'
import { useEffect, useState } from 'react'
import { useCitiesQuery, useCountriesQuery, useStatesQuery } from '@/service/data.service'
import { OnChange } from 'react-final-form-listeners'
import { Form } from 'react-final-form'
import validate from 'validate.js'
import rtkMutation from '@/utils/rtkMutation'
import { showAlert } from '@/utils/showAlert'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import { useUpdateUserProfileMutation } from '@/service/user.service'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '@/redux/slices/user.slice'

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
interface UserState {
  user: {
    id: number
    first_name: string
    last_name: string
    profile_image: string
    phone_number: string
    country_id: number
    state_id: number
    city_id: number
    zip_code: string
  } | null
  token: string | null
}
interface RootState {
  user: UserState
}

export default function Page() {
  const user = useSelector((state: RootState) => state.user.user)
  const [countryID, setCountryID] = useState<number | null>(user?.country_id || null)
  const [stateID, setStateID] = useState<number | null>(user?.state_id || null)
  const dispatch = useDispatch()

  const { data: countries } = useCountriesQuery({})
  const { data: states } = useStatesQuery(countryID, { skip: countryID === null })
  const { data: cities } = useCitiesQuery(stateID, { skip: stateID === null })

  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'account'
  const handleTabChange = (value: string) => {
    router.push(`/dashboard/settings?tab=${value}`)
  }

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [register, { isSuccess, error }] = useUpdateUserProfileMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log(values)
    await rtkMutation(register, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Profile update successful!', 'success')
      dispatch(logoutUser())
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error, router, dispatch])

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full lg:w-auto">
          <TabsList className="flex-col sm:flex-row w-full sm:w-auto h-auto md:h-auto">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-5">
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              initialValues={{
                firstName: user?.first_name,
                lastName: user?.last_name,
                phoneNumber: user?.phone_number,
                country: user?.country_id.toString(),
                state: user?.state_id.toString(),
                city: user?.city_id.toString(),
                zipCode: user?.zip_code,
                profileImage: user?.profile_image,
                id: user ? user?.id.toString() : '',
              }}
              render={({ handleSubmit, form, submitting }) => (
                <form onSubmit={handleSubmit}>
                  <Input
                    // label=""
                    name="id"
                    type="hidden"
                    // placeholder="Enter Zip Code"
                    form={form}
                  />

                  <ImageSelector
                    name="profileImage"
                    label="Profile Image"
                    form={form}
                    // existingImage={event?.banner_image || ''}
                  />

                  <div className="flex items-center gap-0 md:gap-2 flex-col md:flex-row w-full">
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
                  </div>

                  <div className="flex items-center gap-0 md:gap-2 flex-col md:flex-row w-full">
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
                  </div>
                  <OnChange name="country">
                    {(value: number) => {
                      if (value !== user?.country_id) {
                        setCountryID(value)
                        // form.change('state', '')
                      } else {
                        setCountryID(value)
                      }
                    }}
                  </OnChange>
                  <OnChange name="state">
                    {(value: number) => {
                      if (value !== user?.state_id) {
                        setStateID(value)
                        // form.change('city', '')
                      } else {
                        setStateID(value)
                      }
                    }}
                  </OnChange>

                  <div className="flex items-center gap-0 md:gap-2 flex-col md:flex-row w-full">
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
                      label="Phone Number"
                      name="phoneNumber"
                      type="number"
                      placeholder="Enter Phone Number"
                      form={form}
                    />
                  </div>
                  <Input
                    label="Zip Code"
                    name="zipCode"
                    type="text"
                    placeholder="Enter Zip Code"
                    form={form}
                  />

                  <button
                    type="submit"
                    className="auth-submit w-full max-w-[988px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                    disabled={submitting}
                  >
                    {submitting ? <Loader /> : 'Save Changes'}
                  </button>
                </form>
              )}
            />
          </TabsContent>
          <TabsContent value="billing" className="mt-5">
            Billing settings content goes here.
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
