type ButtonProps = {
  icon: React.ReactNode
  text: string
  action: () => void
  width: string
}

const Button = ({ icon, text, action, width = '150px' }: ButtonProps) => {
  return (
    <button
      onClick={action}
      style={{ width }}
      className={`admin-dashboard-add-btn bg-[#069769] rounded-[15px] p-[10px] flex items-center justify-center gap-1 hover:bg-[#057a5c] transition-colors`}
    >
      {icon}
      {text}
    </button>
  )
}

export default Button
