import apiSlice from './apiSlice'
import { COUNTRIES, STATES, CITIES, USER_LIST, COMMUNITY_LIST, COURSES } from './constants'

const dataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    countries: builder.query({
      query: () => ({
        url: COUNTRIES,
        method: 'GET',
      }),
    }),
    states: builder.query({
      query: (countryId) => ({
        url: `${STATES}/${countryId}`,
        method: 'GET',
      }),
    }),
    cities: builder.query({
      query: (stateId) => ({
        url: `${CITIES}/${stateId}`,
        method: 'GET',
      }),
    }),
    users: builder.query({
      query: () => ({
        url: USER_LIST,
        method: 'GET',
      }),
    }),
    communities: builder.query({
      query: () => ({
        url: COMMUNITY_LIST,
        method: 'GET',
      }),
    }),
    getCourse: builder.query({
      query: () => ({
        url: COURSES,
        method: 'GET',
      }),
    }),
    getAdminOverview: builder.query({
      query: () => ({
        url: 'admin_overview',
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useCountriesQuery,
  useStatesQuery,
  useCitiesQuery,
  useUsersQuery,
  useCommunitiesQuery,
  useGetCourseQuery,
  useGetAdminOverviewQuery,
} = dataApiSlice
