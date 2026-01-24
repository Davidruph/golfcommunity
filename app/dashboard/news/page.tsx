'use client'
import ImageSelector from '@/components/auth/ImageSelector'
import Input from '@/components/auth/Input'
import Select from '@/components/auth/Select'
import Textarea from '@/components/auth/Textarea'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Loader from '@/components/website/loaders/Loader'
import { ListFilter, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { validate } from 'validate.js'
import rtkMutation from '@/utils/rtkMutation'
import { Form } from 'react-final-form'
import { useGetNewsTopicsQuery, useRegisterNewsTopicMutation } from '@/service/news.service'
import { showAlert } from '@/utils/showAlert'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import Spinner from '@/components/website/loaders/Spinner'
import CommunityNewsCard from '@/components/dashboard/CommunityNewsCard'
import { formatDistanceToNow } from 'date-fns'

interface NewsTopic {
  id: number
  user_id: number
  topic_title: string
  category: 'forum' | 'news'
  discussion_details: string
  topic_image?: string
  status: number
  views_count: number
  created_at: string
  updated_at: string
  author_name?: string
  author_avatar?: string
  comments_count: number
  likes_count: number
  user_has_liked?: boolean
  poster_name: string
}

interface NewsComment {
  id: number
  news_topic_id: number
  user_id: number
  comment_text: string
  parent_comment_id?: number
  status: number
  created_at: string
  updated_at: string
  author_name?: string
  author_avatar?: string
  likes_count?: number
  replies_count?: number
  user_has_liked?: boolean
  replies?: NewsComment[]
}

type onSubmitProps = {
  [key: string]: undefined | string
}

const constraints = {
  topicTitle: {
    presence: true,
  },
  category: {
    presence: true,
  },
  discussionDetails: {
    presence: true,
  },
}

export default function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)

  const { data: newsTopicsData, isLoading } = useGetNewsTopicsQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    status: filtersVal.status || '',
    filter: filtersVal.filter || '',
  })

  const applyAsInstructor = () => {
    setIsSheetOpen(true)
  }

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [createNewsTopic, { isSuccess, error }] = useRegisterNewsTopicMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log('Form Values:', values)
    await rtkMutation(createNewsTopic, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('News topic created successfully!', 'success')
      setIsSheetOpen(false)
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error])

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFiltersVal(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>News</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-between items-center flex-col md:flex-row gap-3 mb-5">
          <Button
            variant="ghost"
            className="flex items-center gap-2 add-event-btn border-0"
            onClick={applyAsInstructor}
          >
            <Plus size={18} /> Create Topic
          </Button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={20} className="absolute top-2 left-2" />
              <input
                type="search"
                className="event-input border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] w-[212px] bg-white pl-8 text-sm placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search"
                value={filtersVal.search || ''}
                onChange={(e) => handleFilterChange({ ...filtersVal, search: e.target.value })}
              />
            </div>

            <Button
              variant="ghost"
              className="flex items-center gap-2 border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] w-[79px] bg-white"
            >
              <ListFilter size={18} /> Filter
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <Spinner loading={isLoading} />
          ) : (
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
              {newsTopicsData?.data.map((topic: NewsTopic) => (
                <CommunityNewsCard
                  key={topic.id}
                  content={topic.discussion_details}
                  title={topic.topic_title}
                  posterName={topic.poster_name}
                  postDate={formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                  likesCount={topic.likes_count}
                  commentsCount={topic.comments_count}
                  topicImage={topic.topic_image}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add Topics</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Input
                      label="Topic Title"
                      name="topicTitle"
                      type="text"
                      placeholder="Enter Topic Title"
                      form={form}
                    />

                    <Select
                      label="Category"
                      name="category"
                      placeholder="Select Category"
                      form={form}
                      options={[
                        { label: 'Forum', value: 'forum' },
                        { label: 'News', value: 'news' },
                      ]}
                    />

                    <Textarea
                      label="Discussion Details"
                      name="discussionDetails"
                      placeholder="Enter Discussion Details"
                      form={form}
                    />

                    <ImageSelector
                      name="topicImage"
                      label="Upload topic image (optional)"
                      form={form}
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader /> : 'Create'}
                    </button>
                  </form>
                )
              }}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}
