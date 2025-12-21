'use client'
import Input from '@/components/auth/Input'
import Link from 'next/link'
import { Form } from 'react-final-form'
import validate from 'validate.js'

const constraints = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
  },
}

type onSubmitProps = {
  [key: string]: undefined | string
}
const page = () => {
  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const onSubmit = (values: onSubmitProps) => {
    console.log(values)
  }

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
            <h2 className="auth-header mb-8">Login</h2>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => (
                <form onSubmit={handleSubmit}>
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

                  <button
                    type="submit"
                    className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4"
                  >
                    Login
                  </button>
                </form>
              )}
            />
            <p className="auth-question mt-8">
              No Account yet? <Link href="/create-account">Sign Up</Link>{' '}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default page
