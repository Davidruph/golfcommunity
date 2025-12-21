'use client'

import toast, { Toaster } from 'react-hot-toast'

type AlertType = 'success' | 'error' | 'warning'

export const showAlert = (message: string, type: AlertType = 'success') => {
  switch (type) {
    case 'success':
      toast.success(message)
      break
    case 'error':
      toast.error(message)
      break
    case 'warning':
      toast(message, {
        icon: '⚠️',
        style: {
          background: '#f59e0b',
          color: '#fff',
        },
      })
      break
    default:
      toast(message)
  }
}

export default function CustomToast() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        success: {
          duration: 3000,
          style: {
            background: '#10b981',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#ef4444',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
      }}
    />
  )
}
