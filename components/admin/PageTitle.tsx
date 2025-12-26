type Props = {
  title: string
  subTitle: string
}
const PageTitle = ({ title, subTitle }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="page-title">{title}</p>
      <p className="page-subtitle">{subTitle}</p>
    </div>
  )
}

export default PageTitle
