import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  onClick?: () => void;
  borderColor?: string;
  href?: string;
  width?: string;
  height?: string;
  className?: string;
}

const Button = ({
  label,
  icon,
  backgroundColor,
  textColor,
  onClick,
  borderColor,
  href,
  width,
  height,
  className = ""
}: ButtonProps) => {
  return (
    <Link
      style={{
        width: width,
        backgroundColor: backgroundColor,
        color: textColor,
        borderColor: borderColor,
        height: height
      }}
      href={href || "#"}
      className={`py-[11px] border-[1.5px] px-4 flex items-center justify-center gap-2 ${className}`}
    >
      {label}

      <span className="button-icon">{icon || <FaArrowRightLong />}</span>
    </Link>
  );
};

export default Button;
