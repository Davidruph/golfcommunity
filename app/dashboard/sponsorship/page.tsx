'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HandCoins, HeartHandshake, Send, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { showAlert } from '@/utils/showAlert'
import { validate } from 'validate.js'
import Loader from '@/components/website/loaders/Loader'
import Textarea from '@/components/auth/Textarea'
import ImageSelector from '@/components/auth/ImageSelector'
import Input from '@/components/auth/Input'
import { Form } from 'react-final-form'
import coins from '@/public/dashboard/coins.svg'
import userd from '@/public/dashboard/user-d.svg'
import Sponsorshipcard from '@/components/dashboard/cards/Sponsorshipcard'
import DonateConfirmcard from '@/components/dashboard/cards/DonateConfirmcard'
import Donatecard from '@/components/dashboard/cards/Donatecard'

const constraints = {
  message: {
    presence: true,
  },
  kidName: {
    presence: true,
  },
  kidImage: {
    presence: true,
  },
}

type onSubmitProps = {
  [key: string]: undefined | string
}

const pagestats = [
  {
    title: 'My Donations',
    value: '250',
    stat: '0.2',
    bgIcon: coins,
    name: 'John Doe',
    profileImage: '',
  },
  {
    title: 'Children Sponsored',
    value: '75',
    stat: '0.2',
    bgIcon: userd,
    name: 'Jane Smith',
    profileImage: '',
  },
]

const browsechildren = [
  {
    name: 'Alice Johnson',
    profileImage: '',
    bio: 'Aspiring golfer from a small town.',
    raised: '500',
    goal: '1000',
  },
  {
    name: 'Bob Smith',
    profileImage: '',
    bio: 'Passionate about golf and community service.',
    raised: '300',
    goal: '800',
  },
  {
    name: 'Cathy Lee',
    profileImage: '',
    bio: 'Young golfer with big dreams.',
    raised: '700',
    goal: '1200',
  },
]

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'browse-children'
  const handleTabChange = (value: string) => {
    router.push(`/dashboard/sponsorship?tab=${value}`)
  }

  const validateForm = (values: onSubmitProps) => {
    return validate(values, constraints) || {}
  }

  const onSubmit = async (values: onSubmitProps) => {
    console.log('Form Values:', values)
    if (!values.kidImage) {
      showAlert('Please upload an image of the child.', 'error')
      return
    }
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
                <BreadcrumbPage>Sponsorship</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div
          className="w-full h-[257px] p-[16px] border border-[#EAECF0] mb-2"
          style={{
            backgroundImage: "url('/dashboard/sponsorship.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-col justify-between h-full text-white">
            <p className="sponsorship-title">G4C Community</p>
            <div className="flex justify-between items-end">
              <p className="sponsorship-join-text w-full">
                Sponsor a <br /> Junior Golfer
              </p>
              <p className="sponsorship-title w-full hidden lg:block">
                Your contribution help provides equipment, lessons, and course access to
                underprivileged youth in your community. +50 Points for every sponsorship.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full lg:w-auto">
            <TabsList className="flex-col sm:flex-row w-full sm:w-auto h-auto md:h-auto">
              <TabsTrigger value="browse-children" className="gap-2 flex items-center">
                <UserRound size={16} />
                Browse Children
              </TabsTrigger>
              <TabsTrigger value="my-contributions" className="gap-2 flex items-center">
                <HandCoins size={16} />
                My Contribution
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button onClick={() => setIsOpen(true)}>
              <HeartHandshake />
              Submit a Child For Sponsorship
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsContent value="browse-children" className="mt-5">
            <div className="flex w-full gap-3 flex-col md:flex-row flex-wrap">
              {browsechildren.map((child) => (
                <Donatecard key={child.name} {...child} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="my-contributions" className="mt-5">
            <div className="flex flex-col md:flex-row gap-3">
              {pagestats.map((stat) => (
                <Sponsorshipcard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  stat={stat.stat}
                  bgIcon={stat.bgIcon}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-5">
              {pagestats.map((stat) => (
                <DonateConfirmcard
                  key={stat.title}
                  name={stat.name}
                  amount={stat.value}
                  profileImage={stat.stat}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="lg:max-w-[421px] sm:max-w-sm w-full px-2 p-0 max-h-[588px]">
          <DialogHeader className="px-5 pt-5 pb-0">
            <DialogTitle>Submit A Child</DialogTitle>
          </DialogHeader>

          <div className="w-full flex flex-col items-center md:flex-row max-h-full">
            <Form
              onSubmit={onSubmit}
              validate={validateForm}
              render={({ handleSubmit, form, submitting }) => {
                return (
                  <form onSubmit={handleSubmit} className="w-full p-5 mt-5">
                    <Input
                      label="Kid's Name"
                      name="kidName"
                      type="text"
                      placeholder="Enter Kid's Name"
                      form={form}
                    />

                    <ImageSelector name="kidImage" label="Upload Kid's Image" form={form} />

                    <Textarea
                      label="Message"
                      name="message"
                      placeholder="Enter Message"
                      form={form}
                    />

                    <button
                      type="submit"
                      className="auth-submit w-full max-w-[490px] h-[49px] py-1 px-2 mt-4 cursor-pointer"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader />
                      ) : (
                        <span className="items-center flex gap-2 w-full justify-center">
                          <Send />
                          Send A Message
                        </span>
                      )}
                    </button>
                  </form>
                )
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
