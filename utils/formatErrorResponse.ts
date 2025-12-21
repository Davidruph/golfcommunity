import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError): string => {
  if ('data' in error && error.data && typeof error.data === 'object' && 'error' in error.data) {
    return (error.data as { error: string }).error
  }
  if ('message' in error && error.message) {
    return error.message
  }
  return 'An error occurred'
}
