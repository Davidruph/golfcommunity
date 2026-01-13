import apiSlice from './apiSlice'
import { CAMPAIGNS, CHANGE_CAMPAIGN_STATUS } from './constants'

const campaignApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.status) searchParams.append('status', params.status)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${CAMPAIGNS}?${queryString}` : CAMPAIGNS,
          method: 'GET',
        }
      },
      providesTags: ['campaign'],
    }),
    registerCampaign: builder.mutation({
      query: (userData) => ({
        url: CAMPAIGNS,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['campaign'],
    }),
    updateCampaign: builder.mutation({
      query: (userData) => ({
        url: `${CAMPAIGNS}/${userData.id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['campaign'],
    }),
    deleteCampaign: builder.mutation({
      query: (userData) => ({
        url: `${CAMPAIGNS}/${userData.id}`,
        method: 'DELETE',
        body: userData,
      }),
      invalidatesTags: ['campaign'],
    }),
    toggleCampaignStatus: builder.mutation({
      query: (userData) => ({
        url: `${CHANGE_CAMPAIGN_STATUS}/${userData.id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['campaign'],
    }),
  }),
})

export const {
  useGetCampaignsQuery,
  useRegisterCampaignMutation,
  useUpdateCampaignMutation,
  useToggleCampaignStatusMutation,
} = campaignApiSlice
