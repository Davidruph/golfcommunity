import { createApi } from '@reduxjs/toolkit/query/react'
import customBaseQuery from './customQuery'

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ['user', 'data'],
  endpoints: (builder) => ({}),
  keepUnusedDataFor: 60,
})

export default apiSlice
