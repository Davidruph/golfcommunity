import apiSlice from './apiSlice'
import { USERS, CHANGE_STATUS } from './constants'

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
    registerUser: builder.mutation({
      query: (userData) => ({
        url: USERS,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['user'],
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: `${USERS}/${userData.id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['user'],
    }),
    deleteUser: builder.mutation({
      query: (userData) => ({
        url: `${USERS}/${userData.id}`,
        method: 'DELETE',
        body: userData,
      }),
      invalidatesTags: ['user'],
    }),
    toggleUserStatus: builder.mutation({
      query: (userData) => ({
        url: `${CHANGE_STATUS}/${userData.id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['user'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} = userApiSlice
