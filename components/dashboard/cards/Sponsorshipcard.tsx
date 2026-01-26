import signalicon from '@/public/dashboard/signal.svg'
import Image from 'next/image'
type CardProps = {
  title: string
  value: string | number
  stat: string
  icon?: React.ReactNode
  bgIcon: string
}
const Sponsorshipcard = ({ title, value, stat, icon, bgIcon }: CardProps) => {
  return (
    <div className="relative flex flex-col border border-[#EAECF0] bg-[#EEEBE5] p-[16px] w-full h-[160px] gap-2">
      <div className="flex justify-between items-center">
        <div className="dashboard-card-title">{title}</div>
        {icon && (
          <div className="border border-black bg-black text-white h-[28px] w-[28px] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="dashboard-card-value mb-1">{value}</div>
      <div className="dashboard-card-stat flex items-center gap-2">
        {stat}
        <Image src={signalicon} alt="Signal Icon" />
        Last 28 days
      </div>
      <div className="opacity-10 w-full justify-end absolute bottom-0 right-3 flex">
        <Image src={bgIcon} alt="Signal Icon" />
      </div>
    </div>
  )
}

export default Sponsorshipcard
