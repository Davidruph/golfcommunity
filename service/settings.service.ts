import apiSlice from './apiSlice'
import {
  COMMUNITY_SETTINGS,
  NOTIFICATION_SETTINGS,
  BRANDING_SETTINGS,
  MEMBERSHIP_TIERS,
} from './constants'

const settingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommunitySettings: builder.query({
      query: () => ({
        url: COMMUNITY_SETTINGS,
        method: 'GET',
      }),
      providesTags: ['settings'],
    }),
    communitySettings: builder.mutation({
      query: (settings) => ({
        url: COMMUNITY_SETTINGS,
        method: 'POST',
        body: settings,
      }),
      invalidatesTags: ['settings'],
    }),
    getNotificationSettings: builder.query({
      query: ({ userId }) => `${NOTIFICATION_SETTINGS}/${userId}`,
    }),
    notificationSettings: builder.mutation({
      query: (data) => ({
        url: NOTIFICATION_SETTINGS,
        method: data.id ? 'PUT' : 'POST',
        body: data,
      }),
      invalidatesTags: ['settings'],
    }),
    getBrandingSettings: builder.query({
      query: () => ({
        url: BRANDING_SETTINGS,
        method: 'GET',
      }),
    }),
    brandingSettings: builder.mutation({
      query: (data) => ({
        url: BRANDING_SETTINGS,
        method: data.id ? 'PUT' : 'POST',
        body: data,
      }),
      invalidatesTags: ['settings'],
    }),
    getMembershipTiers: builder.query({
      query: () => ({
        url: MEMBERSHIP_TIERS,
        method: 'GET',
      }),
      providesTags: ['settings'],
    }),
    membershipTiers: builder.mutation({
      query: (data) => ({
        url: MEMBERSHIP_TIERS,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['settings'],
    }),
  }),
})

export const {
  useGetCommunitySettingsQuery,
  useCommunitySettingsMutation,
  useGetNotificationSettingsQuery,
  useNotificationSettingsMutation,
  useGetBrandingSettingsQuery,
  useBrandingSettingsMutation,
  useMembershipTiersMutation,
  useGetMembershipTiersQuery,
} = settingApiSlice
