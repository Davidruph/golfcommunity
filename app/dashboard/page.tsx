'use client'

import { updateUser } from '@/redux/slices/user.slice'
import { showAlert } from '@/utils/showAlert'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = () => {
    // Clear user and token from Redux
    dispatch(
      updateUser({
        user: null,
        token: null,
      })
    )

    showAlert('Logged out successfully', 'success')
    router.push('/login')
  }

  return (
    <div>
      {' '}
      <button
        onClick={handleLogout}
        className={'px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'}
      >
        Logout
      </button>
    </div>
  )
}

export default DashboardPage
