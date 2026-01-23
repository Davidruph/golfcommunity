import apiSlice from './apiSlice'
import { GOLF_TIPS } from './constants'

const tipApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTips: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.status) searchParams.append('status', params.status)
        if (params.filter) searchParams.append('filter', params.filter)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${GOLF_TIPS}?${queryString}` : GOLF_TIPS,
          method: 'GET',
        }
      },
      providesTags: ['golf_tip'],
    }),
    registerTips: builder.mutation({
      query: (newTip) => ({
        url: GOLF_TIPS,
        method: 'POST',
        body: newTip,
      }),
      invalidatesTags: ['golf_tip'],
    }),
    updateTips: builder.mutation({
      query: (updatedTip) => ({
        url: GOLF_TIPS,
        method: 'PATCH',
        body: updatedTip,
      }),
      invalidatesTags: ['golf_tip'],
    }),
  }),
})

export const { useGetTipsQuery, useRegisterTipsMutation, useUpdateTipsMutation } = tipApiSlice
