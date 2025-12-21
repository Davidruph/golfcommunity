import apiSlice from './apiSlice'
import { REGISTER } from './constants'

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: REGISTER,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useRegisterMutation } = authApiSlice
