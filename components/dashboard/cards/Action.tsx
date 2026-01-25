import Image from 'next/image'
import Link from 'next/link'
import { FaChevronRight } from 'react-icons/fa'

type Props = {
  title: string
  icon: string
  link: string
  action?: () => void
}
const Action = ({ title, icon, link, action }: Props) => {
  return (
    <div className="w-full h-[84px] flex justify-between items-center bg-black p-4">
      <div className="flex items-center gap-3">
        <Image src={icon} alt={title} />
        <p className="action-title">{title}</p>
      </div>
      <Link
        href={link}
        onClick={action}
        className="border border-black bg-white text-black h-[28px] w-[28px] flex items-center justify-center"
      >
        <FaChevronRight />
      </Link>
    </div>
  )
}

export default Action
