import newsicon from '@/public/dashboard/news.svg'
import usericon from '@/public/dashboard/user.svg'
import verifiedicon from '@/public/dashboard/verified.svg'
import eventicon from '@/public/dashboard/event.svg'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type Props = {
  link?: string
  title: string
  date: string
  type?: string
  action?: () => void
  action_text?: string | undefined
  feedback?: string
}
const DashboardEventCard = (props: Props) => {
  return (
    <div className="border-b border-[#EAEDF1] py-[8px] px-[12px] w-full bg-white flex items-start justify-start gap-3">
      {props.type === 'news' ? (
        <Image src={newsicon} alt="news icon" />
      ) : props.type === 'user' ? (
        <Image src={usericon} alt="user icon" />
      ) : props.type === 'verified' ? (
        <Image src={verifiedicon} alt="verified icon" />
      ) : (
        <Image src={eventicon} alt="event icon" />
      )}
      <div className="flex flex-col gap-1 items-start justify-start">
        <p className="dashboard-event-card-title">{props.title}</p>
        <p className="dashboard-event-card-date">{props.date}</p>
        {props.action ? (
          <button onClick={props.action} className="dashboard-event-card-btn">
            {props.action_text}
          </button>
        ) : props.feedback ? (
          <p className="dashboard-event-card-btn">{props.feedback}</p>
        ) : null}
      </div>
    </div>
  )
}

export default DashboardEventCard
