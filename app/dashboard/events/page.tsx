'use client'
import EventCard from '@/components/dashboard/cards/EventCard'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Calendar,
  Coins,
  HandCoins,
  ListFilter,
  MapPin,
  Plus,
  Search,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
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
import type { FormApi } from 'final-form'
import Input from '@/components/auth/Input'
import Textarea from '@/components/auth/Textarea'
import Select from '@/components/auth/Select'
import rtkMutation from '@/utils/rtkMutation'
import ImageSelector from '@/components/auth/ImageSelector'
import { useCommunitiesQuery, useGetCourseQuery } from '@/service/data.service'
import {
  useGetEventsQuery,
  useRegisterEventAttendanceMutation,
  useRegisterEventMutation,
  useUpdateEventMutation,
} from '@/service/event.service'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import Loader from '@/components/website/loaders/Loader'
import Spinner from '@/components/website/loaders/Spinner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSelector } from 'react-redux'
import DatalistInput from '@/components/auth/DatalistInput'

const constraints = {
  eventName: {
    presence: true,
  },
  location: {
    presence: true,
  },
  timezone: {
    presence: true,
  },
  eventDate: {
    presence: true,
  },
  eventTime: {
    presence: true,
  },
  description: {
    presence: true,
  },
  community: {
    presence: true,
  },
  courseName: {
    presence: true,
  },
  totalAllowedSpots: {
    presence: true,
  },
}

type onSubmitProps = {
  [key: string]: undefined | string
}
interface Event {
  id: number
  event_name: string
  event_date: string
  event_time: string
  fees?: number | string
  total_allowed_spots: number
  registered_spots?: number
  user_event_status?: string
  description?: string
  course_name?: string
  location?: string
  created_by?: number
  timezone?: string
  banner_image?: string | null
  community?: number | string
  fee_link?: string | null
}

interface UserState {
  user: {
    id: number
  } | null
  token: string | null
}
interface RootState {
  user: UserState
}

export default function Page() {
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const { data: communityData } = useCommunitiesQuery({})
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [formApi, setFormApi] = useState<FormApi<onSubmitProps> | null>(null)
  const timezoneOptions = Intl.supportedValuesOf('timeZone').map((tz) => ({
    label: tz,
    value: tz,
  }))
  const { user } = useSelector((state: RootState) => state.user)

  const { data: eventsData, isLoading } = useGetEventsQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    status: filtersVal.status || '',
    filter: filtersVal.filter || '',
  })

  const { data: courseData } = useGetCourseQuery({})

  const addEvent = () => {
    setIsSheetOpen(true)
  }

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const [createEvent, { isSuccess, error }] = useRegisterEventMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log('Form Values:', values)
    // if (!values.bannerImage) {
    //   showAlert('Please upload event graphics', 'error')
    //   return
    // }
    if (values.fees && !values.feeLink) {
      showAlert('Please enter fee link', 'error')
      return
    } else if (!values.fees && values.feeLink) {
      showAlert('Please enter fees', 'error')
      return
    }
    await rtkMutation(createEvent, values)
  }

  const [updateEvent, { isSuccess: updateSuccess, error: updateError }] = useUpdateEventMutation()
  const onUpdateSubmit = async (values: onSubmitProps) => {
    console.log('Form Values:', values)
    // if (!values.bannerImage) {
    //   showAlert('Please upload event graphics', 'error')
    //   return
    // }
    if (values.fees && !values.feeLink) {
      showAlert('Please enter fee link', 'error')
      return
    } else if (!values.fees && values.feeLink) {
      showAlert('Please enter fees', 'error')
      return
    }

    const payload = {
      id: selectedEvent?.id,
      ...values,
    }
    await rtkMutation(updateEvent, payload)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Event creation successful!', 'success')
      formApi?.reset()
      setIsSheetOpen(false)
    } else if (error) {
      showAlert(getErrorMessage(error), 'error')
    }
  }, [isSuccess, error, formApi])

  useEffect(() => {
    if (updateSuccess) {
      showAlert('Event update successful!', 'success')
      setIsEditSheetOpen(false)
      setSelectedEvent(null)
    } else if (updateError) {
      showAlert(getErrorMessage(updateError), 'error')
    }
  }, [updateSuccess, updateError])

  const [attendEvent, { isSuccess: attendSuccess, error: attendError, isLoading: attendLoading }] =
    useRegisterEventAttendanceMutation()

  const handleAttendEvent = async (event: Event) => {
    if (!event) return
    setIsDialogOpen(true)
    setEvent(event)
  }

  const handleAttendConfirm = async () => {
    if (!event) return

    const confirmed = window.confirm('Are you sure you want to register for this event?')
    if (!confirmed) return

    await rtkMutation(attendEvent, { eventId: event.id })
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
                <BreadcrumbPage>Event Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between items-center flex-col md:flex-row gap-3 mb-5">
            <Button
              variant="ghost"
              className="flex items-center gap-2 add-event-btn border-0"
              onClick={addEvent}
            >
              <Plus size={18} /> Add Event
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

          <div className="flex-col flex gap-4">
            {eventsData && eventsData.data?.length > 0 ? (
              eventsData?.data
                .filter((event: Event) => event.id !== null && event.event_name !== null)
                .map((event: Event) => (
                  <EventCard
                    key={event.id}
                    eventName={event.event_name}
                    eventDate={event.event_date}
                    eventTime={event.event_time}
                    eventFee={event.fees ? `$${event.fees}` : 'Free'}
                    totalSpot={event.total_allowed_spots}
                    attendanceSpot={event.registered_spots || 0}
                    userEventStatus={event.user_event_status}
                    isCreatedByUser={event.created_by === user?.id}
                    // isLoading={attendLoading}
                    action={() => {
                      handleAttendEvent(event)
                    }}
                    onEdit={() => {
                      setSelectedEvent(event)
                      setIsEditSheetOpen(true)
                    }}
                  />
                ))
            ) : (
              <p className="text-center">No events found.</p>
            )}
          </div>
        </div>
      )}

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
                    <Input
                      label="Event Name"
                      name="eventName"
                      type="text"
                      placeholder="Enter event Name"
                      form={form}
                    />
                    <Select
                      label="Community"
                      name="community"
                      placeholder="Select Community"
                      form={form}
                      options={
                        communityData?.map((community: { id: number; name: string }) => ({
                          label: community.name,
                          value: community.id,
                        })) || []
                      }
                    />

                    <Select
                      label="Select Timezone"
                      name="timezone"
                      placeholder="Select Timezone"
                      form={form}
                      options={timezoneOptions}
                    />

                    <div className="flex gap-3 items-center">
                      <Input
                        label="Event Date"
                        name="eventDate"
                        type="date"
                        placeholder="Enter event Date"
                        form={form}
                      />
                      <Input
                        label="Event Time"
                        name="eventTime"
                        type="time"
                        placeholder="Enter event Time"
                        form={form}
                      />
                    </div>
                    <Input
                      label="Total Allowed Spots"
                      name="totalAllowedSpots"
                      type="number"
                      placeholder="Enter total allowed spots"
                      form={form}
                    />
                    <Input
                      label="Fees (if any)"
                      name="fees"
                      type="text"
                      placeholder="Enter Fees"
                      form={form}
                    />

                    <Input
                      label="Fee Link (if fees applicable)"
                      name="feeLink"
                      type="text"
                      placeholder="Enter Fee Link"
                      form={form}
                    />

                    {/* <Input
                      label="Course Name"
                      name="courseName"
                      type="text"
                      placeholder="Enter Course Name"
                      form={form}
                    /> */}

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

                    <ImageSelector name="bannerImage" label="Upload Event Graphics" form={form} />

                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Enter Description"
                      form={form}
                    />

                    <Input
                      label="Location"
                      name="location"
                      type="text"
                      placeholder="Enter Location"
                      form={form}
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader /> : 'Create Event'}
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
            <SheetTitle>Edit Event</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onUpdateSubmit}
              validate={validateForm}
              initialValues={
                selectedEvent
                  ? {
                      eventName: selectedEvent.event_name,
                      description: selectedEvent.description,
                      timezone: selectedEvent.timezone,
                      community: selectedEvent.community
                        ? selectedEvent.community.toString()
                        : undefined,
                      bannerImage: selectedEvent.banner_image,
                      eventDate: selectedEvent.event_date,
                      eventTime: selectedEvent.event_time,
                      totalAllowedSpots: selectedEvent.total_allowed_spots.toString(),
                      fees: selectedEvent.fees ? selectedEvent.fees.toString() : '',
                      courseName: selectedEvent.course_name,
                      location: selectedEvent.location,
                      feeLink: selectedEvent.fee_link,
                    }
                  : {}
              }
              render={({ handleSubmit, form, submitting }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Input
                      label="Event Name"
                      name="eventName"
                      type="text"
                      placeholder="Enter event Name"
                      form={form}
                    />
                    <Select
                      label="Community"
                      name="community"
                      placeholder="Select Community"
                      form={form}
                      options={
                        communityData?.map((community: { id: number; name: string }) => ({
                          label: community.name,
                          value: community.id,
                        })) || []
                      }
                    />

                    <Select
                      label="Select Timezone"
                      name="timezone"
                      placeholder="Select Timezone"
                      form={form}
                      options={timezoneOptions}
                    />

                    <div className="flex gap-3 items-center">
                      <Input
                        label="Event Date"
                        name="eventDate"
                        type="date"
                        placeholder="Enter event Date"
                        form={form}
                      />
                      <Input
                        label="Event Time"
                        name="eventTime"
                        type="time"
                        placeholder="Enter event Time"
                        form={form}
                      />
                    </div>
                    <Input
                      label="Total Allowed Spots"
                      name="totalAllowedSpots"
                      type="number"
                      placeholder="Enter total allowed spots"
                      form={form}
                    />
                    <Input
                      label="Fees (if any)"
                      name="fees"
                      type="text"
                      placeholder="Enter Fees"
                      form={form}
                    />

                    <Input
                      label="Fee Link (if fees applicable)"
                      name="feeLink"
                      type="text"
                      placeholder="Enter Fee Link"
                      form={form}
                    />

                    {/* <Input
                      label="Course Name"
                      name="courseName"
                      type="text"
                      placeholder="Enter Course Name"
                      form={form}
                    /> */}

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

                    <ImageSelector
                      name="bannerImage"
                      label="Upload Event Graphics"
                      form={form}
                      existingImage={event?.banner_image || ''}
                    />

                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Enter Description"
                      form={form}
                    />

                    <Input
                      label="Location"
                      name="location"
                      type="text"
                      placeholder="Enter Location"
                      form={form}
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader /> : 'Update Event'}
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
