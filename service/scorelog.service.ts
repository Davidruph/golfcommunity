import apiSlice from './apiSlice'
import { LOG_SCORE } from './constants'

const scorelogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getScoreLogs: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.status) searchParams.append('status', params.status)
        if (params.filter) searchParams.append('filter', params.filter)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${LOG_SCORE}?${queryString}` : LOG_SCORE,
          method: 'GET',
        }
      },
      providesTags: ['score_log'],
    }),
    logScore: builder.mutation({
      query: (logData) => ({
        url: LOG_SCORE,
        method: 'POST',
        body: logData,
      }),
      invalidatesTags: ['score_log'],
    }),
  }),
})

export const { useLogScoreMutation, useGetScoreLogsQuery } = scorelogApiSlice
