import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type DonateConfirmcardProps = {
  name?: string
  amount?: string | number
  profileImage?: string
}
const DonateConfirmcard = ({ name, amount, profileImage }: DonateConfirmcardProps) => {
  return (
    <div className="w-full h-[69px] border border-[#EBECF0] py-[16px] px-[8px] flex justify-between items-center">
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
      <div className="flex gap-5 items-center">
        <p className="donate-confirm-fee">${amount}</p>
        <Button className="donate-confirm-btn bg-[#069768] text-white hover:bg-[#057a5e]">
          Confirmed
        </Button>
      </div>
    </div>
  )
}

export default DonateConfirmcard
