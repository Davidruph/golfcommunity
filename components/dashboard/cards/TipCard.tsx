import { Button } from '@/components/ui/button'
import tip from '@/public/dashboard/tip.svg'
import { Pencil } from 'lucide-react'
import Image from 'next/image'

type TipCardProps = {
  title: string
  description: string
  coverImageUrl?: string
  user_is_creator?: number
  action: () => void
  onEdit?: () => void
}
const TipCard = ({
  title,
  description,
  coverImageUrl,
  action,
  user_is_creator,
  onEdit,
}: TipCardProps) => {
  return (
    <div className="items-center w-full max-w-[536px] flex gap-3 border border-[#EAECF0] py-[8px] px-[12px]">
      {coverImageUrl ? (
        <div className="p-[16px] bg-[#F0FDFB] h-full flex items-center justify-center">
          <Image src={coverImageUrl} alt="Tip" className="w-[93.86842346191406px] h-[87px]" />
        </div>
      ) : (
        <Image src={tip} alt="Tip" className="h-full" />
      )}
      <div className="flex flex-col justify-between flex-1 items-start">
        <p className="tip-card-title">{title}</p>
        <p className="tip-card-description mb-5">
          {description.length > 50 ? `${description.slice(0, 50)}...` : description}
        </p>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 add-event-btn border"
            onClick={action}
          >
            Read Article
          </Button>

          {user_is_creator === 1 ? (
            <Button
              className="bg-[#069769] text-white hover:bg-[#057a56] w-auto flex items-center gap-2"
              onClick={onEdit}
            >
              <Pencil size={16} /> Edit
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default TipCard
