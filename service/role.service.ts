import apiSlice from './apiSlice'
import { ROLES } from './constants'

const roleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => ({
        url: ROLES,
        method: 'GET',
      }),
      providesTags: ['role'],
    }),
  }),
})

export const { useGetRolesQuery } = roleApiSlice
