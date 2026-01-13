import apiSlice from './apiSlice'
import { CHANGE_SPONSOR_STATUS, SPONSORS } from './constants'

const sponsorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSponsors: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.status) searchParams.append('status', params.status)
        if (params.donation_range) searchParams.append('donation_range', params.donation_range)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${SPONSORS}?${queryString}` : SPONSORS,
          method: 'GET',
        }
      },
      providesTags: ['sponsor'],
    }),
    registerSponsor: builder.mutation({
      query: (userData) => ({
        url: SPONSORS,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['sponsor'],
    }),
    updateSponsor: builder.mutation({
      query: (userData) => ({
        url: `${SPONSORS}/${userData.id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['sponsor'],
    }),
    deleteSponsor: builder.mutation({
      query: (userData) => ({
        url: `${SPONSORS}/${userData.id}`,
        method: 'DELETE',
        body: userData,
      }),
      invalidatesTags: ['sponsor'],
    }),
    toggleSponsorStatus: builder.mutation({
      query: (userData) => ({
        url: `${CHANGE_SPONSOR_STATUS}/${userData.id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['sponsor'],
    }),
  }),
})

export const {
  useGetSponsorsQuery,
  useRegisterSponsorMutation,
  useUpdateSponsorMutation,
  useToggleSponsorStatusMutation,
} = sponsorApiSlice
