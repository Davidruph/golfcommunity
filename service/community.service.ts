import apiSlice from './apiSlice'
import { COMMUNITIES, COMMUNITY_CAPTAINS } from './constants'

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommunities: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.timezone) searchParams.append('timezone', params.timezone)
        if (params.status) searchParams.append('status', params.status)
        if (params.activity) searchParams.append('activity', params.activity)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${COMMUNITIES}?${queryString}` : COMMUNITIES,
          method: 'GET',
        }
      },
      providesTags: ['community'],
    }),
    registerCommunity: builder.mutation({
      query: (communityData) => ({
        url: COMMUNITIES,
        method: 'POST',
        body: communityData,
      }),
      invalidatesTags: ['community'],
    }),
    updateCommunity: builder.mutation({
      query: (communityData) => ({
        url: COMMUNITIES,
        method: 'PATCH',
        body: communityData,
      }),
      invalidatesTags: ['community'],
    }),
    toggleCommunityStatus: builder.mutation({
      query: (communityData) => ({
        url: `${COMMUNITIES}/${communityData.id}`,
        method: 'PATCH',
        body: communityData,
      }),
      invalidatesTags: ['community'],
    }),

    getCommunityCaptains: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.activity) searchParams.append('activity', params.activity)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${COMMUNITY_CAPTAINS}?${queryString}` : COMMUNITY_CAPTAINS,
          method: 'GET',
        }
      },
      providesTags: ['community'],
    }),
    toggleCommunityCaptainStatus: builder.mutation({
      query: (communityData) => ({
        url: `${COMMUNITY_CAPTAINS}/${communityData.id}`,
        method: 'PATCH',
        body: communityData,
      }),
      invalidatesTags: ['community'],
    }),
  }),
})

export const {
  useGetCommunitiesQuery,
  useRegisterCommunityMutation,
  useUpdateCommunityMutation,
  useToggleCommunityStatusMutation,
  useGetCommunityCaptainsQuery,
  useToggleCommunityCaptainStatusMutation,
} = userApiSlice
