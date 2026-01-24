import apiSlice from './apiSlice'
import { EVENTS, INSTRUCTORS, REGISTER_EVENT } from './constants'

const instructorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstructors: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.status) searchParams.append('status', params.status)
        if (params.filter) searchParams.append('filter', params.filter)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${INSTRUCTORS}?${queryString}` : INSTRUCTORS,
          method: 'GET',
        }
      },
      providesTags: ['instructors'],
    }),
    registerInstructor: builder.mutation({
      query: (instructorData) => ({
        url: INSTRUCTORS,
        method: 'POST',
        body: instructorData,
      }),
      invalidatesTags: ['instructors'],
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
  useGetInstructorsQuery,
  useRegisterInstructorMutation,
  useRegisterEventAttendanceMutation,
  useUpdateEventMutation,
} = instructorApiSlice
