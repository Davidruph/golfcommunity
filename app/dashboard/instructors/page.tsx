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
import { Info, ListFilter, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Form } from 'react-final-form'
import { validate } from 'validate.js'
import Input from '@/components/auth/Input'
import Select from '@/components/auth/Select'
import Textarea from '@/components/auth/Textarea'
import Loader from '@/components/website/loaders/Loader'
import ImageSelector from '@/components/auth/ImageSelector'
import Image from 'next/image'
import { useGetInstructorsQuery, useRegisterInstructorMutation } from '@/service/instructor.service'
import rtkMutation from '@/utils/rtkMutation'
import { getErrorMessage } from '@/utils/formatErrorResponse'
import { showAlert } from '@/utils/showAlert'
import Spinner from '@/components/website/loaders/Spinner'
import InstructorsCard from '@/components/dashboard/cards/InstructorsCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type onSubmitProps = {
  [key: string]: undefined | string
}

type InstructorType = {
  id: number
  instructor_name: string
  teaching_specialty: string
  price_per_hour: string
  teaching_philosophy: string
  user_is_creator: number
  status: number
  avatar?: string
}

const constraints = {
  teachingSpecialty: {
    presence: true,
  },
  pricePerHour: {
    presence: true,
  },
  experienceLevel: {
    presence: true,
  },
  teachingPhilosophy: {
    presence: true,
  },
  avatar: {
    presence: true,
  },
}
export default function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [filtersVal, setFiltersVal] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [instructor, setInstructor] = useState<InstructorType | null>(null)

  const { data: instructorsData, isLoading } = useGetInstructorsQuery({
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

  const [registerInstructor, { isSuccess, error }] = useRegisterInstructorMutation()
  const onSubmit = async (values: onSubmitProps) => {
    console.log('Form Values:', values)
    await rtkMutation(registerInstructor, values)
  }

  useEffect(() => {
    if (isSuccess) {
      showAlert('Instructor application successful!', 'success')
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
                <BreadcrumbPage>Instructors</BreadcrumbPage>
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
            <Plus size={18} /> Apply
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
              {instructorsData?.data.map((instructor: InstructorType) => (
                <InstructorsCard
                  key={instructor.id}
                  instructor_name={instructor.instructor_name}
                  fee={instructor.price_per_hour}
                  specialty={instructor.teaching_specialty}
                  // philosophy={instructor.teaching_philosophy}
                  user_is_creator={instructor.user_is_creator}
                  status={instructor.status}
                  avatar={instructor.avatar}
                  action={() => setInstructor(instructor)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Apply as instructor</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Input
                      label="Teaching Specialty"
                      name="teachingSpecialty"
                      type="text"
                      placeholder="e.g. swing Mechanics, Mental Game"
                      form={form}
                    />
                    <Input
                      label="Price Per Hour ($)"
                      name="pricePerHour"
                      type="text"
                      placeholder="Enter Price Per Hour"
                      form={form}
                    />

                    <Select
                      label="Experience Level"
                      name="experienceLevel"
                      placeholder="Select Experience Level"
                      form={form}
                      options={[
                        { label: 'Beginner', value: 'beginner' },
                        { label: 'Intermediate', value: 'intermediate' },
                        { label: 'Advanced', value: 'advanced' },
                      ]}
                    />

                    <Textarea
                      label="Teaching Philosophy"
                      name="teachingPhilosophy"
                      placeholder="Enter Full Content"
                      form={form}
                    />

                    <ImageSelector name="avatar" label="Upload a picture of yourself" form={form} />

                    <div className="flex items-start gap-2 mt-20 mb-5">
                      <Image src="/dashboard/info.svg" alt="info" width={20} height={20} />
                      <p className="instructor-msg">
                        By clicking submit, your default email client will open with these details
                        formatted for our review team. Final verification involves a background
                        check and credentials audit.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? <Loader /> : 'Apply'}
                    </button>
                  </form>
                )
              }}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Dialog open={!!instructor} onOpenChange={() => setInstructor(null)}>
        <DialogContent className="lg:max-w-[713px] sm:max-w-sm w-full px-2 p-0 max-h-[588px] h-full">
          <DialogHeader className="hidden">
            <DialogTitle></DialogTitle>
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
              <div className="text-white flex flex-col items-start gap-2 absolute bottom-5 left-5 pr-5">
                <p className="instructor-book-name">{instructor?.instructor_name}</p>
                <p className="instructor-book-specialty">{instructor?.teaching_specialty}</p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-4 mt-5 p-5">
              <p className="instructor-approach mb-3">Teaching Approach</p>
              <p className="instructor-book-philosophy">{instructor?.teaching_philosophy}</p>
              <button
                disabled
                // onClick={handleAttendConfirm}
                className="px-4 py-2 bg-[#069769] text-white rounded hover:bg-[#057a56] w-full mt-5"
              >
                Request Mentorship Session
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
