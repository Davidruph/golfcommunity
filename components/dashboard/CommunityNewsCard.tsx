import Image from 'next/image'
import defaultImage from '@/public/admin/default-community-image.png'
import { Button } from '../ui/button'
import { MessageSquare, ThumbsUp } from 'lucide-react'
import { RxAvatar } from 'react-icons/rx'

type CommunityNewsCardProps = {
  action?: () => void
  title: string
  content: string
  posterName: string
  postDate: string
  likesCount: number
  commentsCount: number
}
const CommunityNewsCard = ({
  action,
  title,
  content,
  posterName,
  postDate,
  likesCount,
  commentsCount,
}: CommunityNewsCardProps) => {
  return (
    <div className="border border-[#EAECF0] w-full max-w-[616px] p-[16px] flex gap-3">
      <Image src={defaultImage} alt="Community News image" width={159} height={203} className="" />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center mb-2">
          <RxAvatar size={35} />
          <div className="flex flex-col items-start">
            <p className="poster-name">{posterName}</p>
            <p className="post-date">{postDate}</p>
          </div>
        </div>
        <p className="community-news-title">{title}</p>
        <p className="community-news-desc">{content}</p>
        <Button className="text-sm w-[100px] mt-2" size={'sm'} onClick={action}>
          Read More
        </Button>
        <div className="w-full flex gap-3 items-center mt-4">
          <p className="comment-likes flex items-center gap-2">
            <ThumbsUp size={20} /> {likesCount} Like
          </p>
          <p className="comment-likes flex items-center gap-2">
            <MessageSquare size={20} />
            {commentsCount} Comments
          </p>
        </div>
      </div>
    </div>
  )
}

export default CommunityNewsCard
