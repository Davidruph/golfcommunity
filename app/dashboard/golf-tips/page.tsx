'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ListFilter, MapPin, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TipCard from '@/components/dashboard/cards/TipCard'
import Loader from '@/components/website/loaders/Loader'
import Textarea from '@/components/auth/Textarea'
import ImageSelector from '@/components/auth/ImageSelector'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Form } from 'react-final-form'
import { showAlert } from '@/utils/showAlert'
import { validate } from 'validate.js'
import Select from '@/components/auth/Select'
import Input from '@/components/auth/Input'
import {
  useGetTipsQuery,
  useRegisterTipsMutation,
  useUpdateTipsMutation,
} from '@/service/tip.service'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import rtkMutation from '@/utils/rtkMutation'
import { useSelector } from 'react-redux'
import Spinner from '@/components/website/loaders/Spinner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatdatestring } from '@/utils/formatDate'

type onSubmitProps = {
  [key: string]: undefined | string
}

const constraints = {
  tipTitle: {
    presence: true,
  },
  skillLevel: {
    presence: true,
  },
  category: {
    presence: true,
  },
  oneSentenceSummary: {
    presence: true,
  },
  description: {
    presence: true,
  },
}

interface GolfTip {
  id: number
  category: string
  created_at: string
  one_sentence_summary: string
  skill_level: string
  status: number
  tip_title: string
  user_is_creator?: number
  description?: string
  created_by?: number
  banner_image?: string | null
  poster_name?: string
}

interface UserState {
  user: {
    id: number
    first_name: string
    last_name: string
  } | null
  token: string | null
}
interface RootState {
  user: UserState
}

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'beginner-tips'
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [selectedTip, setSelectedTip] = useState<GolfTip | null>(null)
  const [tip, setTip] = useState<GolfTip | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const { user } = useSelector((state: RootState) => state.user)

  const { data: tipsData, isLoading } = useGetTipsQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    status: filtersVal.status || '',
    filter: filtersVal.filter || '',
  })

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/golf-tips?tab=${value}`)
  }

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const addTips = () => {
    setIsSheetOpen(true)
  }

  const handleEditTip = (tip: GolfTip) => {
    setSelectedTip(tip)
    setIsEditSheetOpen(true)
  }

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [registerTips, { isSuccess, error }] = useRegisterTipsMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log('Form Values:', values)
    await rtkMutation(registerTips, values)
  }

  const [updateTips, { isSuccess: isUpdateSuccess, error: updateError }] = useUpdateTipsMutation()
  const onUpdateSubmit = async (values: onSubmitProps) => {
    console.log('Form Values for Update:', values)
    const payload = { id: selectedTip?.id, ...values }
    await rtkMutation(updateTips, payload)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Tips creation successful!', 'success')
      setIsSheetOpen(false)
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error])

  useEffect(() => {
    if (isUpdateSuccess) {
      showAlert('Tips update successful!', 'success')
      setIsEditSheetOpen(false)
    } else if (updateError) {
      showAlert(getErrorMessage(updateError), 'error')
    }
  }, [isUpdateSuccess, updateError])

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFiltersVal(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  const handleReadArticle = (tip: GolfTip) => {
    setTip(tip)
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 w-full justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Golf Tips</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-2 add-event-btn border-0"
            onClick={addTips}
          >
            <Plus size={18} /> Add Tips
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full lg:w-auto">
            <TabsList className="flex-col sm:flex-row w-full sm:w-auto h-auto md:h-auto">
              <TabsTrigger value="beginner-tips">Beginner Tips</TabsTrigger>
              <TabsTrigger value="swing-tips">Swing Tips</TabsTrigger>
              <TabsTrigger value="strategy-tip">Strategy Tip</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search size={20} className="absolute top-2 left-2" />
              <input
                type="search"
                className="event-input border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] w-full lg:w-[212px] bg-white pl-8 text-sm placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search"
                value={filtersVal.search || ''}
                onChange={(e) => handleFilterChange({ ...filtersVal, search: e.target.value })}
              />
            </div>

            <Button
              variant="ghost"
              className="flex items-center gap-2 border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] min-w-[79px] bg-white"
            >
              <ListFilter size={18} /> Filter
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Spinner loading={isLoading} />
        ) : (
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsContent value="beginner-tips" className="mt-5">
              {tipsData?.data?.filter((tip: GolfTip) => tip.category === 'beginner').length > 0 ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {tipsData?.data
                    ?.filter((tip: GolfTip) => tip.category === 'beginner')
                    .map((tip: GolfTip) => (
                      <TipCard
                        key={tip.id}
                        title={tip.tip_title}
                        description={tip.one_sentence_summary}
                        coverImageUrl={tip.banner_image || undefined}
                        action={() => handleReadArticle(tip)}
                        user_is_creator={tip.user_is_creator}
                        onEdit={() => handleEditTip(tip)}
                      />
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 w-full py-8">No beginner tips available</p>
              )}
            </TabsContent>
            <TabsContent value="swing-tips" className="mt-5">
              {tipsData?.data?.filter((tip: GolfTip) => tip.category === 'swing').length > 0 ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {tipsData?.data
                    ?.filter((tip: GolfTip) => tip.category === 'swing')
                    .map((tip: GolfTip) => (
                      <TipCard
                        key={tip.id}
                        title={tip.tip_title}
                        description={tip.one_sentence_summary}
                        coverImageUrl={tip.banner_image || undefined}
                        action={() => handleReadArticle(tip)}
                        user_is_creator={tip.user_is_creator}
                        onEdit={() => handleEditTip(tip)}
                      />
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 w-full py-8">No swing tips available</p>
              )}
            </TabsContent>
            <TabsContent value="strategy-tip" className="mt-5">
              {tipsData?.data?.filter((tip: GolfTip) => tip.category === 'strategy').length > 0 ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {tipsData?.data
                    ?.filter((tip: GolfTip) => tip.category === 'strategy')
                    .map((tip: GolfTip) => (
                      <TipCard
                        key={tip.id}
                        title={tip.tip_title}
                        description={tip.one_sentence_summary}
                        coverImageUrl={tip.banner_image || undefined}
                        action={() => handleReadArticle(tip)}
                        user_is_creator={tip.user_is_creator}
                        onEdit={() => handleEditTip(tip)}
                      />
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 w-full py-8">No strategy tips available</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Golf Tips</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Input
                      label="Tip Title"
                      name="tipTitle"
                      type="text"
                      placeholder="Enter Tip Title"
                      form={form}
                    />
                    <Select
                      label="Skill Level"
                      name="skillLevel"
                      placeholder="Select Skill Level"
                      form={form}
                      options={[
                        { label: 'Beginner', value: 'beginner' },
                        { label: 'Intermediate', value: 'intermediate' },
                        { label: 'Advanced', value: 'advanced' },
                      ]}
                    />

                    <Select
                      label="Category"
                      name="category"
                      placeholder="Select Category"
                      form={form}
                      options={[
                        { label: 'Beginner Tips', value: 'beginner' },
                        { label: 'Swing Tips', value: 'swing' },
                        { label: 'Strategy Tip', value: 'strategy' },
                      ]}
                    />

                    <Input
                      label="One Sentence Summary"
                      name="oneSentenceSummary"
                      type="text"
                      placeholder="Enter One Sentence Summary"
                      form={form}
                    />

                    <Textarea
                      label="Full Content"
                      name="description"
                      placeholder="Enter Full Content"
                      form={form}
                    />

                    <ImageSelector name="bannerImage" label="Upload Cover Image" form={form} />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader /> : 'Post Tip'}
                    </button>
                  </form>
                )
              }}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Edit Golf Tips</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onUpdateSubmit}
              validate={validateForm}
              initialValues={
                selectedTip
                  ? {
                      tipTitle: selectedTip.tip_title,
                      description: selectedTip.description,
                      skillLevel: selectedTip.skill_level,
                      category: selectedTip.category,
                      oneSentenceSummary: selectedTip.one_sentence_summary,
                      bannerImage: selectedTip.banner_image || undefined,
                    }
                  : {}
              }
              render={({ handleSubmit, form, submitting }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Input
                      label="Tip Title"
                      name="tipTitle"
                      type="text"
                      placeholder="Enter Tip Title"
                      form={form}
                    />
                    <Select
                      label="Skill Level"
                      name="skillLevel"
                      placeholder="Select Skill Level"
                      form={form}
                      options={[
                        { label: 'Beginner', value: 'beginner' },
                        { label: 'Intermediate', value: 'intermediate' },
                        { label: 'Advanced', value: 'advanced' },
                      ]}
                    />

                    <Select
                      label="Category"
                      name="category"
                      placeholder="Select Category"
                      form={form}
                      options={[
                        { label: 'Beginner Tips', value: 'beginner' },
                        { label: 'Swing Tips', value: 'swing' },
                        { label: 'Strategy Tip', value: 'strategy' },
                      ]}
                    />

                    <Input
                      label="One Sentence Summary"
                      name="oneSentenceSummary"
                      type="text"
                      placeholder="Enter One Sentence Summary"
                      form={form}
                    />

                    <Textarea
                      label="Full Content"
                      name="description"
                      placeholder="Enter Full Content"
                      form={form}
                    />

                    <ImageSelector name="bannerImage" label="Upload Cover Image" form={form} />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader /> : 'Post Tip'}
                    </button>
                  </form>
                )
              }}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Dialog open={!!tip} onOpenChange={() => setTip(null)}>
        <DialogContent className="lg:max-w-[713px] sm:max-w-sm w-full px-2 p-0 max-h-[588px]">
          <DialogHeader className="hidden">
            <DialogTitle>{tip?.tip_title}</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col items-center max-h-full overflow-auto">
            <div
              className="relative w-full h-[272px] p-[24px] rounded-md"
              style={{
                backgroundImage: "url('/dashboard/event.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <span className="text-white flex items-center gap-2 absolute bottom-5 left-5">
                <div className="bg-[#069467] rounded-[4px] h-[18px] w-auto items-center flex px-[8px] py-[4px] tip-skill-level-text">
                  {tip?.skill_level === 'beginner'
                    ? 'Beginner Tips'
                    : tip?.skill_level === 'intermediate'
                      ? 'Intermediate Tips'
                      : 'Advanced Tips'}
                </div>
              </span>
            </div>

            <div className="bg-white w-full py-[36px] px-[24px]">
              <div className="w-full items-center">
                <div className="flex gap-2 items-center mb-8">
                  <Avatar>
                    <AvatarFallback>
                      {tip?.poster_name ? tip.poster_name[0] : user?.first_name[0]}
                      {tip?.poster_name ? tip.poster_name.split(' ')[1][0] : user?.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="tip-poster-name">{tip?.poster_name}</p>
                    <p className="tip-poster-date">{formatdatestring(tip?.created_at || '')}</p>
                  </div>
                </div>
              </div>
              <p className="tips-title mb-3">{tip?.tip_title}</p>
              <div className="tips-on-sentence h-[52px] border-l-[2px] border-[#079769] px-[24px] flex flex-col items-start justify-center">
                {tip?.one_sentence_summary}
              </div>
              <p className="tips-description mt-10">{tip?.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
