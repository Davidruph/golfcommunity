import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/redux/store'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json')
    const state = getState() as RootState
    const token = state?.user?.token
    //console.log(`Token: ${token}`);
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions)

  // Always return result, never undefined
  if (result.error) {
    // Handle error (e.g., redirect on 401)
    return result
  }

  return result
}

export default customBaseQuery
