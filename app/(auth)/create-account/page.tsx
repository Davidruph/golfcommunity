'use client'
import Input from '@/components/auth/Input'
import Select from '@/components/auth/Select'
import Link from 'next/link'
import { Form } from 'react-final-form'
import validate from 'validate.js'
import { useRegisterMutation } from '../../../service/auth.service'
import rtkMutation from '@/utils/rtkMutation'
import { showAlert } from '@/utils/showAlert'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getErrorMessage } from '@/utils/formatErrorResponse'

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
const Page = () => {
  const router = useRouter()
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
          className="w-full hidden md:block max-w-[611px] h-[95vh]"
          style={{
            backgroundImage: "url('/auth/auth-hero.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        {/* Right */}
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-[490px]">
            <h2 className="auth-header mb-8">Create Account</h2>
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
                    options={[
                      { value: 'us', label: 'United States' },
                      { value: 'uk', label: 'United Kingdom' },
                    ]}
                  />
                  <Select
                    name="state"
                    label="State"
                    placeholder="Select a state"
                    form={form}
                    options={[
                      { value: 'us', label: 'United States' },
                      { value: 'uk', label: 'United Kingdom' },
                    ]}
                  />
                  <Select
                    name="city"
                    label="City"
                    placeholder="Select a city"
                    form={form}
                    options={[
                      { value: 'us', label: 'United States' },
                      { value: 'uk', label: 'United Kingdom' },
                    ]}
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
                  >
                    Create Account
                  </button>
                </form>
              )}
            />
            <p className="auth-question mt-8">
              Have an Account? <Link href="/login">Login</Link>{' '}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page
