import apiSlice from './apiSlice'
import { EVENTS, REGISTER_EVENT } from './constants'

const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.status) searchParams.append('status', params.status)
        if (params.filter) searchParams.append('filter', params.filter)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${EVENTS}?${queryString}` : EVENTS,
          method: 'GET',
        }
      },
      providesTags: ['golf_event'],
    }),
    registerEvent: builder.mutation({
      query: (eventData) => ({
        url: EVENTS,
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['golf_event'],
    }),
    registerEventAttendance: builder.mutation({
      query: (eventData) => ({
        url: REGISTER_EVENT,
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['golf_event'],
    }),
    updateEvent: builder.mutation({
      query: (eventData) => ({
        url: EVENTS,
        method: 'PATCH',
        body: eventData,
      }),
      invalidatesTags: ['golf_event'],
    }),
  }),
})

export const {
  useGetEventsQuery,
  useRegisterEventMutation,
  useRegisterEventAttendanceMutation,
  useUpdateEventMutation,
} = eventApiSlice
