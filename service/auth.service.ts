import apiSlice from './apiSlice'
import { REGISTER, LOGIN } from './constants'

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: REGISTER,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['user'],
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: LOGIN,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['user'],
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation } = authApiSlice
