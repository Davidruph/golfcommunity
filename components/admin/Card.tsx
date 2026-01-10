import Image from 'next/image'

type CardProps = {
  title: string
  header: string
  details: string
  iconSrc: string
}
const Card = ({ title, header, details, iconSrc }: CardProps) => {
  return (
    <div className="flex flex-col gap-2 w-[274px] h-[112px] rounded-[15px] border border-[#F2F2F2] py-[15px] px-[20px] bg-transparent">
      <p className="admin-card-title">{title}</p>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <p className="admin-card-header">{header}</p>
          <p className="admin-card-details">{details}</p>
        </div>
        <Image src={iconSrc} alt="Icon" width={36} height={36} />
      </div>
    </div>
  )
}

export default Card
