import { Button } from '@/components/ui/button'
import { FaRegImage } from 'react-icons/fa6'
import { GiGraduateCap } from 'react-icons/gi'

type InstructorsCardProps = {
  instructor_name: string
  fee: string
  specialty: string
  philosophy?: string
  user_is_creator: number
  status: number
  avatar?: string
  action: () => void
}
const InstructorsCard = (props: InstructorsCardProps) => {
  return (
    <div className="w-full max-w-[536px] p-[16px] border border-[#EAECF0] flex gap-4 items-center">
      <div className="p-[4px] w-full max-w-[137px] h-full overflow-hidden items-center flex justify-center">
        <FaRegImage className="h-full w-full" />
      </div>
      <div className="w-full flex flex-col gap-2 items-start">
        <div className="flex items-center justify-between w-full">
          <p className="instructor-name">{props.instructor_name}</p>
          <p className="instructor-fee">${props.fee}/hr</p>
        </div>
        <p className="instructor-specialty">{props.specialty}</p>
        <Button
          variant="ghost"
          onClick={props.action}
          className="flex items-center gap-2 p-[4px] rounded-[8px] h-[36px] w-[136px] bg-black text-white hover:bg-gray-800 hover:text-white"
        >
          <GiGraduateCap size={40} /> Book Lessons
        </Button>
      </div>
    </div>
  )
}

export default InstructorsCard
