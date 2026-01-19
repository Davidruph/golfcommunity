import Image from 'next/image'
import { Button } from '../ui/button'
import defaultImage from '@/public/admin/default-community-image.png'

type CommunityListCardProps = {
  title: string
  description: string
  memberCount: number
  imageUrl?: string
  action?: () => void
}
const CommunityListCard = ({
  title,
  description,
  memberCount,
  imageUrl,
  action,
}: CommunityListCardProps) => {
  return (
    <div className="border border-[#EAECF0] w-full max-w-[352px] p-[16px] flex flex-col gap-2">
      <Image
        src={imageUrl || defaultImage}
        alt="Community List image"
        width={320}
        height={143}
        className="h-[143px] w-[320px]"
      />
      <p className="community-list-title">{title}</p>
      <p className="community-list-desc">{description}</p>
      <div className="flex items-center justify-between w-full">
        <p className="community-list-count">{memberCount} Members</p>
        <p className="community-list-join">
          <Button onClick={action}>Join</Button>
        </p>
      </div>
    </div>
  )
}

export default CommunityListCard
