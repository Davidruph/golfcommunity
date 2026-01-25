import { createApi } from '@reduxjs/toolkit/query/react'
import customBaseQuery from './customQuery'

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: [
    'user',
    'data',
    'role',
    'community',
    'settings',
    'sponsor',
    'campaign',
    'golf_event',
    'golf_tip',
    'instructors',
    'news',
    'score_log',
  ],
  endpoints: (builder) => ({}),
  keepUnusedDataFor: 60,
})

export default apiSlice
