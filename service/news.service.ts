import apiSlice from './apiSlice'
import { NEWS_TOPICS } from './constants'

const newsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNewsTopics: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.search) searchParams.append('search', params.search)
        if (params.status) searchParams.append('status', params.status)
        if (params.filter) searchParams.append('filter', params.filter)

        const queryString = searchParams.toString()

        return {
          url: queryString ? `${NEWS_TOPICS}?${queryString}` : NEWS_TOPICS,
          method: 'GET',
        }
      },
      providesTags: ['news'],
    }),
    registerNewsTopic: builder.mutation({
      query: (newsTopicData) => ({
        url: NEWS_TOPICS,
        method: 'POST',
        body: newsTopicData,
      }),
      invalidatesTags: ['news'],
    }),
  }),
})

export const { useGetNewsTopicsQuery, useRegisterNewsTopicMutation } = newsApiSlice
