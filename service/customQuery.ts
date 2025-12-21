import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import enviroment from '../configuration/siteConfig'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/redux/store'

const baseQuery = fetchBaseQuery({
  baseUrl: enviroment.API_BASE_URL,
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
