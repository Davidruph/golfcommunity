'use client'
import Card from '@/components/dashboard/cards/Card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { FaChevronRight } from 'react-icons/fa'
import cupicon from '@/public/dashboard/cup.svg'
import { useSelector } from 'react-redux'
import Action from '@/components/dashboard/cards/Action'
import action1 from '@/public/dashboard/action1.svg'
import action2 from '@/public/dashboard/action2.svg'
import action3 from '@/public/dashboard/action3.svg'
import action4 from '@/public/dashboard/action4.svg'
import action5 from '@/public/dashboard/action5.svg'
import action6 from '@/public/dashboard/action6.svg'
import Link from 'next/link'
import DashboardEventCard from '@/components/dashboard/cards/DashboardEventCard'
import Loader from '@/components/website/loaders/Loader'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import ImageSelector from '@/components/auth/ImageSelector'
import DatalistInput from '@/components/auth/DatalistInput'
import { useGetCourseQuery } from '@/service/data.service'
import Input from '@/components/auth/Input'
import { Form } from 'react-final-form'
import { validate } from 'validate.js'
import rtkMutation from '@/utils/rtkMutation'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import Select from '@/components/auth/Select'
import { useGetEventListQuery, useRegisterEventAttendanceMutation } from '@/service/event.service'
import { useGetScoreLogsQuery, useLogScoreMutation } from '@/service/scorelog.service'
import { showAlert } from '@/utils/showAlert'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '@/components/website/loaders/Spinner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, HandCoins, MapPin, UsersRound } from 'lucide-react'

interface UserState {
  user: {
    first_name: string
    last_name: string
    id: number
  } | null
  token: string | null
}
interface RootState {
  user: UserState
}

const constraints = {
  eventName: {
    presence: true,
  },
  matchType: {
    presence: true,
  },
  grossScore: {
    presence: true,
  },
  fairwayHits: {
    presence: true,
  },
  greensInReg: {
    presence: true,
  },
  puttPerRound: {
    presence: true,
  },
  courseName: {
    presence: true,
  },
  scoreCard: {
    presence: true,
  },
}

type onSubmitProps = {
  [key: string]: undefined | string
}

interface Event {
  id: number
  main_event_id: number
  event_name: string
  event_date: string
  event_time: string
  fees?: number | string
  total_allowed_spots: number
  registered_spots?: number
  user_event_status?: number
  description?: string
  course_name?: string
  location?: string
  created_by?: number
  timezone?: string
  banner_image?: string | null
  community?: number | string
  fee_link?: string | null
}

export default function Page() {
  const { data: courseData } = useGetCourseQuery({})
  const { data: eventListData, isLoading: isEventListLoading } = useGetEventListQuery({})
  const { data: activityData, isLoading: isActivityLoading } = useGetScoreLogsQuery({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [event, setEvent] = useState<Event | null>(null)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { user } = useSelector((state: RootState) => state.user)

  const logScore = () => {
    setIsSheetOpen(true)
  }

  const handleAttendEvent = async (event: Event) => {
    if (!event) return
    setIsDialogOpen(true)
    setEvent(event)
  }

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [registerScoreLog, { isSuccess, error }] = useLogScoreMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log('Form Values:', values)
    await rtkMutation(registerScoreLog, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Score log creation successful!', 'success')
      setIsSheetOpen(false)
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error])

  const [attendEvent, { isSuccess: attendSuccess, error: attendError, isLoading: attendLoading }] =
    useRegisterEventAttendanceMutation()

  const handleAttendConfirm = async () => {
    if (!event) return

    const confirmed = window.confirm('Are you sure you want to register for this event?')
    if (!confirmed) return

    await rtkMutation(attendEvent, { eventId: event.main_event_id })
    setIsDialogOpen(false)
    setEvent(null)
  }

  useEffect(() => {
    if (attendSuccess) {
      showAlert('Event attendance registered successfully!', 'success')
    } else if (attendError) {
      showAlert(getErrorMessage(attendError), 'error')
    }
  }, [attendSuccess, attendError])

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col p-4 pt-0">
        <div className="md:flex-row gap-4 flex flex-col mb-8">
          <div
            className="border border-[#EAECF0] w-full h-[260px] flex flex-col justify-between p-4"
            style={{
              background:
                'url(/dashboard/dashboard-hero.png), linear-gradient(179.58deg, rgba(0, 0, 0, 0) 27.02%, rgba(0, 0, 0, 0.8) 99.64%)',
            }}
          >
            <div className="flex justify-between items-center">
              <p className="dashboard-community">G4C Community</p>
              <div className="border border-black bg-white text-black h-[28px] w-[28px] flex items-center justify-center">
                <FaChevronRight />
              </div>
            </div>

            <div>
              <p className="dashboard-user-name">
                Welcome Back {user?.first_name + ' ' + user?.last_name} 👋
              </p>
            </div>
          </div>
          <Card
            title="Latest Score"
            value="82"
            stat="Trend Last 7 days"
            icon={<FaChevronRight />}
            bgIcon={cupicon}
          />
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <p className="quick-actions">Quick Actions</p>

          <div className="flex flex-col items-center gap-3 md:flex-row">
            <Action title="Log Score" icon={action1} link="#" action={logScore} />
            <Action title="Events" icon={action2} link="/dashboard/events" />
            <Action title="Sponsor" icon={action3} link="/dashboard/sponsorship" />
          </div>
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <Action title="Communities" icon={action4} link="/dashboard/communities" />
            <Action title="Instructors" icon={action5} link="/dashboard/instructors" />
            <Action title="Tips" icon={action6} link="/dashboard/golf-tips" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-3 mt-5">
          <div className="w-full flex-col border border-[#EAECF0] p-4 h-[410px] overflow-y-auto">
            <div className="flex w-full justify-between items-center">
              <p className="quick-actions">Activity Feed</p>
              <Link
                href="/dashboard/stats"
                className="border border-[#DFE4EC] bg-white text-[#928FA8] h-[28px] w-[28px] flex items-center justify-center"
              >
                <FaChevronRight />
              </Link>
            </div>

            {isActivityLoading ? (
              <Spinner loading={isActivityLoading} />
            ) : (
              <div className="mt-8 flex flex-col gap-1">
                {activityData?.data?.map(
                  (item: {
                    id: number
                    created_at: string
                    course_name: string
                    gross_score: number
                    diff?: string
                    match_type: string
                  }) => (
                    <DashboardEventCard
                      key={item.id}
                      title={item.match_type + ' | ' + item.course_name}
                      date={new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      type="user"
                    />
                  )
                )}
              </div>
            )}
          </div>
          <div className="w-full flex-col border border-[#EAECF0] p-4 h-[410px] overflow-y-auto">
            <div className="flex w-full justify-between items-center">
              <p className="quick-actions">Upcoming Events</p>
              <Link
                href="/dashboard/events"
                className="border border-[#DFE4EC] bg-white text-[#928FA8] h-[28px] w-[28px] flex items-center justify-center"
              >
                <FaChevronRight />
              </Link>
            </div>

            {isEventListLoading ? (
              <Spinner loading={isEventListLoading} />
            ) : (
              <div className="mt-8 flex flex-col gap-1">
                {eventListData?.map((item: Event) => (
                  <DashboardEventCard
                    key={item.id}
                    title={item.event_name}
                    date={formatDistanceToNow(new Date(item.event_date + ' ' + item.event_time), {
                      addSuffix: true,
                    })}
                    user_event_status={item.user_event_status}
                    type="event"
                    link={`/dashboard/events/${item.id}`}
                    action={() => {
                      handleAttendEvent(item)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Create Event</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Select
                      label="Event Name"
                      name="eventName"
                      placeholder="Select Event Name"
                      form={form}
                      options={
                        eventListData?.map(
                          (event: { id: number; event_name: string; course_name: string }) => ({
                            label: event.event_name,
                            value: event.id,
                          })
                        ) || []
                      }
                    />

                    <DatalistInput
                      label="Course Name"
                      name="courseName"
                      placeholder="Type or select course name"
                      form={form}
                      options={
                        courseData?.map((course: { course_name: string }) => ({
                          label: course.course_name,
                          value: course.course_name,
                        })) || []
                      }
                    />

                    <Select
                      label="Match Type"
                      name="matchType"
                      placeholder="Select Match Type"
                      form={form}
                      options={[
                        { label: 'Stroke Play', value: 'stroke_play' },
                        { label: 'Match Play', value: 'match_play' },
                        { label: 'Stableford', value: 'stableford' },
                        { label: 'Scramble', value: 'scramble' },
                        { label: 'Best Ball', value: 'best_ball' },
                        { label: 'Fourball', value: 'fourball' },
                        { label: 'Foursomes (Alternate Shot)', value: 'foursomes' },
                        { label: 'Skins', value: 'skins' },
                        { label: 'Medal Play', value: 'medal_play' },
                        { label: 'Texas Scramble', value: 'texas_scramble' },
                        { label: 'Greensomes', value: 'greensomes' },
                        { label: 'Flag Tournament', value: 'flag_tournament' },
                        { label: 'Chapman (Pinehurst)', value: 'chapman' },
                        { label: 'Shamble', value: 'shamble' },
                      ]}
                    />

                    <div className="flex gap-3 items-center">
                      <Input
                        label="Gross Score"
                        name="grossScore"
                        type="number"
                        placeholder="Enter gross score"
                        form={form}
                      />
                      <Input
                        label="Fairway Hits"
                        name="fairwayHits"
                        type="number"
                        placeholder="Enter fairway hits"
                        form={form}
                      />
                    </div>

                    <div className="flex gap-3 items-center">
                      <Input
                        label="Greens In Reg (GIR)"
                        name="greensInReg"
                        type="number"
                        placeholder="Enter greens in reg"
                        form={form}
                      />
                      <Input
                        label="Putt Per Round"
                        name="puttPerRound"
                        type="number"
                        placeholder="Enter putt per round"
                        form={form}
                      />
                    </div>

                    <ImageSelector name="scoreCard" label="Upload Score Card" form={form} />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader /> : 'Submit for verification'}
                    </button>
                  </form>
                )
              }}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Dialog open={!!event} onOpenChange={() => setEvent(null)}>
        <DialogContent className="lg:max-w-[713px] sm:max-w-sm w-full px-2 p-0 max-h-[588px]">
          <DialogHeader className="hidden">
            <DialogTitle>{event?.event_name}</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col items-center md:flex-row max-h-full">
            <div
              className="relative w-full hidden md:block h-full p-[24px] rounded-md"
              style={{
                backgroundImage: "url('/dashboard/event.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <span className="text-white flex items-center gap-2 absolute bottom-5 left-5">
                <MapPin />
                {event?.location}
              </span>
            </div>
            <div className="w-full flex flex-col gap-4 mt-5 p-5">
              <div className="flex justify-start gap-2 flex-col mb-2">
                <span className="entry-fee-text flex items-center gap-2">
                  <Calendar size={16} />
                  Date & Time
                </span>
                <span className="entry-course">
                  {event?.event_date} @ {event?.event_time}
                </span>
              </div>

              <article className="flex flex-col gap-2 mb-2">
                <span className="entry-fee-text flex items-center gap-2">
                  <HandCoins size={16} />
                  Entry Fee
                </span>
                <span className="entry-fee">{event?.fees ? `$${event.fees}` : 'Free'}</span>
              </article>

              <article className="flex flex-col gap-2 mb-2">
                <span className="entry-fee-text flex items-center gap-2">
                  <MapPin size={16} />
                  Golf Course
                </span>
                <span className="entry-course">{event?.course_name}</span>
              </article>

              <article className="flex flex-col gap-2 mb-6">
                <span className="entry-fee-text flex items-center gap-2">
                  <UsersRound size={16} /> Registrations
                </span>
                <span className="entry-course">{event?.registered_spots} Registrations</span>
              </article>

              <article className="flex flex-col gap-2 mb-3">
                <span className="entry-fee-text">About Event</span>
                <span className="entry-course">{event?.description}</span>
              </article>

              <button
                disabled={attendLoading}
                onClick={handleAttendConfirm}
                className="px-4 py-2 bg-[#069769] text-white rounded hover:bg-[#057a56] w-full mt-3"
              >
                {attendLoading ? <Loader /> : 'Secure A Spot'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
