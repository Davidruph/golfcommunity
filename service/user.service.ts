import apiSlice from './apiSlice'
import { USERS } from './constants'

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.role) searchParams.append('role', params.role)
        if (params.status) searchParams.append('status', params.status)
        if (params.membership) searchParams.append('membership', params.membership)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${USERS}?${queryString}` : USERS,
          method: 'GET',
        }
      },
      providesTags: ['user'],
    }),
  }),
})

export const { useGetUsersQuery } = userApiSlice
