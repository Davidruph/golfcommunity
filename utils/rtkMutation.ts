import { getErrorMessage } from './formatErrorResponse'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

interface MutationResult<T> {
  data: T
}

const rtkMutation = async <T, C>(
  request: (credentials: C) => { unwrap: () => Promise<MutationResult<T>> },
  credentials: C
) => {
  let data: T | null = null
  let errorData = null
  try {
    const result = await request(credentials).unwrap()
    data = result.data
  } catch (error) {
    errorData = getErrorMessage(error as FetchBaseQueryError | SerializedError)
    console.error('API Error:', errorData)
  }

  return { data, errorData }
}

export default rtkMutation
