'use client'
import Input from '@/components/auth/Input'
import Select from '@/components/auth/Select'
import Link from 'next/link'
import { Form } from 'react-final-form'
import validate from 'validate.js'
import { useRegisterMutation } from '../../../service/auth.service'
import { useCountriesQuery, useStatesQuery, useCitiesQuery } from '../../../service/data.service'
import rtkMutation from '@/utils/rtkMutation'
import { showAlert } from '@/utils/showAlert'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import { OnChange } from 'react-final-form-listeners'
import Loader from '@/components/website/loaders/Loader'
import { useSelector } from 'react-redux'
import Image from 'next/image'

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

type onSubmitProps = {
  [key: string]: undefined | string
}
interface UserState {
  user: {
    role: string
  } | null
  token: string | null
}
interface RootState {
  user: UserState
}

const Page = () => {
  const router = useRouter()
  const { user, token } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (token && user) {
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [token, user, router])

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
      router.push('/login')
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error, router])

  return (
    <section>
      <div className="mx-auto max-w-[1408px] min-h-[97vh] flex items-center border border-[#EAECF0] bg-white px-3">
        {/* Left */}
        <div
          className="w-full hidden md:flex flex-col justify-between max-w-[611px] h-[95vh] p-5"
          style={{
            backgroundImage:
              "url('/auth/auth-hero.png'), linear-gradient(179.58deg, rgba(0, 0, 0, 0) 27.02%, rgba(0, 0, 0, 0.8) 99.64%)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <p className="auth-bg-title">G4C Community</p>
          <p className="auth-bg-desc">
            Connecting Golfers <br /> <span>Empowering</span> Communities
          </p>
        </div>

        {/* Right */}
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-[490px]">
            <Link href="/" className="w-full flex justify-center mb-10 mt-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={134}
                height={50}
                loading="eager"
                className="w-[134px] h-[90px] cursor-pointer"
              />
            </Link>
            <h2 className="auth-header mb-8">Create Account</h2>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
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
                  </div>
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    type="number"
                    placeholder="Enter Phone Number"
                    form={form}
                  />
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
                      setCountryID(value)
                      form.change('state', '')
                    }}
                  </OnChange>
                  <OnChange name="state">
                    {(value: number) => {
                      setStateID(value)
                      form.change('city', '')
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
                      label="Zip Code"
                      name="zipCode"
                      type="text"
                      placeholder="Enter Zip Code"
                      form={form}
                    />
                  </div>

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
            <p className="auth-question mt-8 mb-4">
              Have an Account? <Link href="/login">Login</Link>{' '}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page
