'use client'
import Input from '@/components/auth/Input'
import Link from 'next/link'
import { Form } from 'react-final-form'
import validate from 'validate.js'
import { useLoginMutation } from '@/service/auth.service'
import { useEffect } from 'react'
import { showAlert } from '@/utils/showAlert'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '@/redux/slices/user.slice'
import rtkMutation from '@/utils/rtkMutation'
import Loader from '@/components/website/loaders/Loader'

const constraints = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
  },
}

type User = {
  role?: string
  [key: string]: unknown
}

type LoginResponse = {
  user: User
  token: string
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

  const dispatch = useDispatch()

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [login, { isSuccess, error, data }] = useLoginMutation({})

  const onSubmit = async (values: onSubmitProps) => {
    await rtkMutation(login, values)
  }

  useEffect(() => {
    if (isSuccess && data) {
      if (data) {
        // Store user and token in Redux
        dispatch(
          updateUser({
            user: (data as LoginResponse).user,
            token: (data as LoginResponse).token,
          })
        )

        const { user } = data as LoginResponse
        // Redirect based on role
        if (user && (user as User).role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
      showAlert('Login successful!', 'success')
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error, data, router, dispatch])

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
                    disabled={submitting}
                  >
                    {submitting ? <Loader /> : 'Login'}
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

export default Page
