import { HandCoins } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

type DonatecardProps = {
  name?: string
  profileImage?: string
  bio?: string
  raised?: string
  goal?: string
}

const Donatecard = ({ name, profileImage, bio, raised, goal }: DonatecardProps) => {
  const raisedAmount = Number(raised) || 0
  const goalAmount = Number(goal) || 1 // avoid division by zero
  const progressValue = Math.min(100, Math.round((raisedAmount / goalAmount) * 100))

  return (
    <div className="w-full max-w-[536px] border border-[#EAECF0] p-[16px] flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Avatar className="h-[37px] w-[37px]">
          <AvatarImage src={profileImage} />
          <AvatarFallback>
            {name
              ?.split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <p className="donate-confirm-name">{name}</p>
      </div>

      <p className="donate-info">{bio}</p>

      <Progress value={progressValue} className="h-[12px]" />
      <div className="flex w-full justify-between donate-budget">
        <p className="">Raised: ${raised}</p>
        <p className="">Goal: ${goal}</p>
      </div>
      <button
        type="submit"
        className="auth-submit-donate w-full h-[49px] py-1 px-2 mt-4 cursor-pointer"
      >
        <span className="items-center flex gap-2 w-full justify-center">
          <HandCoins size={20} />
          Sponsor
        </span>
      </button>
    </div>
  )
}

export default Donatecard
