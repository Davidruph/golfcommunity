'use client'
import Button from '@/components/admin/Button'
import PageTitle from '@/components/admin/PageTitle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Loader from '@/components/website/loaders/Loader'
import { Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useState } from 'react'
import { Form } from 'react-final-form'
import Select from '@/components/auth/Select'
import Input from '@/components/auth/Input'
import { validate } from 'validate.js'
import type { FormApi } from 'final-form'
import { useUsersQuery } from '@/service/data.service'
import Textarea from '@/components/auth/Textarea'
import ImageSelector from '@/components/auth/ImageSelector'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { showAlert } from '@/utils/showAlert'
import enviroment from '@/configuration/siteConfig'
import { useGetCampaignsQuery } from '@/service/campaign.service'

const constraints = {
  campaignTitle: {
    presence: true,
  },
  sponsoredKids: {
    presence: true,
  },
  targetAmount: {
    presence: true,
  },
  description: {
    presence: true,
  },
  bannerImage: {
    presence: true,
  },
  deadline: {
    presence: true,
  },
}

type onSubmitProps = {
  [key: string]: undefined | string
}

export default function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [formApi, setFormApi] = useState<FormApi<onSubmitProps> | null>(null)
  const { data: usersData } = useUsersQuery({})
  const { token } = useSelector((state: { user: { token: string | null } }) => state.user)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const { data: campaignsData, isLoading: campaignsLoading } = useGetCampaignsQuery({
    page,
    limit: 10,
    search: filtersVal.search || '',
    status: filtersVal.status || '',
  })

  const addSponsorKids = () => {
    setIsSheetOpen(true)
  }

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const onSubmit = async (values: onSubmitProps) => {
    setFormSubmitting(true)
    console.log('Form Values:', values)

    // Create FormData to properly send file
    const formData = new FormData()

    // Append all form fields to FormData
    Object.keys(values).forEach((key) => {
      const value = values[key]
      if (value !== undefined && value !== null) {
        // If it's a File object, append it as-is
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          // For other values, convert to string
          formData.append(key, String(value))
        }
      }
    })

    const apiUrl = enviroment.API_BASE_URL
    axios
      .post(`${apiUrl}/campaigns`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((data) => {
        if (data?.status === 201) {
          console.log('Submitted Successfully!!')
          showAlert('Campaign Created Successfully', 'success')
          formApi?.reset()
          setIsSheetOpen(false)
        }
      })
      .catch((err) => {
        showAlert(err?.response?.data?.message || 'An error occurred', 'error')
        console.log('The error is: ', err)
      })
      .finally(() => {
        setFormSubmitting(false)
      })
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
                <BreadcrumbPage>Sponsored Kids</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <PageTitle
            title="Sponsored Kids"
            subTitle="Manage sponsored children, their sponsors, and funded tools."
          />
          <Button icon={<Plus />} text="Add Sponsor" action={addSponsorKids} width="150px" />
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add Campaign</SheetTitle>
            <SheetDescription></SheetDescription>
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => {
                if (!formApi) {
                  setFormApi(form)
                }
                return (
                  <form onSubmit={handleSubmit}>
                    <Input
                      label="Campaign Title"
                      name="campaignTitle"
                      type="text"
                      placeholder="Enter Campaign Title"
                      form={form}
                    />

                    <Select
                      label="Select Sponsored Kids"
                      name="sponsoredKids"
                      placeholder="Select Sponsored Kids"
                      form={form}
                      options={
                        usersData?.map(
                          (user: {
                            id: number
                            first_name: string
                            last_name: string
                            email: string
                          }) => ({
                            label: `${user.first_name} ${user.last_name} (${user.email})`,
                            value: user.id,
                          })
                        ) || []
                      }
                    />
                    <Input
                      label="Target Amount"
                      name="targetAmount"
                      type="number"
                      placeholder="Enter Target Amount"
                      form={form}
                    />

                    <Input
                      label="Deadline"
                      name="deadline"
                      type="date"
                      placeholder="Enter Deadline"
                      form={form}
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Enter Description"
                      form={form}
                    />

                    <ImageSelector
                      name="bannerImage"
                      label="Banner Image"
                      form={form}
                      accept="image/png,image/jpeg"
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? <Loader /> : 'Add Campaign'}
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
