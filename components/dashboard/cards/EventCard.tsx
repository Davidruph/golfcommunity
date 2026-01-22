import { Button } from '@/components/ui/button'
import Loader from '@/components/website/loaders/Loader'
type Props = {
  eventName?: string
  eventDate?: string
  eventTime?: string
  eventFee?: string
  totalSpot?: number
  attendanceSpot?: number
  action?: () => void
  userEventStatus?: string
  isLoading?: boolean
}
const EventCard = ({
  eventName,
  eventDate,
  eventTime,
  eventFee,
  totalSpot,
  attendanceSpot,
  action,
  userEventStatus,
  isLoading,
}: Props) => {
  const date = new Date(eventDate || '')
  const month = date.toLocaleString('default', { month: 'short' })
  const day = date.getDate()

  // const handleRegisterClick = () => {
  //   if (window.confirm('Are you sure you want to register for this event?')) {
  //     action?.()
  //   }
  // }

  return (
    <div className="w-full border border-[#EAECF0] py-[8px] px-[12px] flex items-center justify-between">
      <div className="flex gap-2 items-start md:items-center flex-col md:flex-row">
        <div className="w-[82px] p-[16px] bg-[#F0FDFB] h-[76px] flex flex-col items-center justify-center gap-1">
          <p className="event-time-month">{month}</p>
          <p className="event-time-day">{day}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="event-name">{eventName}</p>
          <p className="event-date">
            {eventDate} • {eventTime}
          </p>
        </div>
      </div>

      <div className="flex gap-3 items-center flex-col md:flex-row">
        <p className="event-fee">{eventFee}</p>
        <p className="event-spot">
          {attendanceSpot}/{totalSpot} spots
        </p>
        {userEventStatus == '1' ? (
          <Button className="bg-[#EBF6F2] text-black border-0 w-[100px]" disabled>
            Registered
          </Button>
        ) : (
          <Button
            className="bg-[#069769] text-white hover:bg-[#057a56] w-[100px]"
            onClick={action}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : 'Register'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default EventCard
