import type { ButtonHTMLAttributes, ReactNode } from "react";
// import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "../../lib/utils";
import LoadingSpinner from "./LoadingSpinner";

const variants = {
  default:
    "disabled:opacity-50 disabled:hover:bg-primary bg-white text-black border border-border hover:bg-mist-50 hover:border-black/30",
  primary:
    "disabled:opacity-50 disabled:hover:bg-black bg-black text-white border border-none hover:bg-mist-700",
  accent:
    "disabled:opacity-50 disabled:bg-secondary bg-accent text-white hover:bg-accent/75 shadow-[0_0_4px_0px_#3033fe4e]",
  danger:
    "disabled:opacity-50 disabled:bg-secondary bg-[#EA4E4E] text-white hover:bg-[#EA4E4E]/75 shadow-[0_0_14px_1px_rgba(255,17,17,0.21)]",
  ghost:
    "disabled:opacity-50 bg-[#F9F9FB] text-primary hover:opacity-50 border shadow-[0_0_4px_0px_#e8e9ff4e]",
};
type Props = {
  children: ReactNode;
  isLoading?: boolean;
  href?: string;
  variant?: keyof typeof variants;
};
export default function Button({
  children,
  isLoading,
  href,
  variant = "default",
  ...props
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={props.disabled || isLoading}
      className={cn(
        "transition duration-100 cursor-pointer active:scale-95 justify-center  px-3.75 py-2.25 h-fit rounded-md flex gap-2 items-center text-sm",
        variants[variant],
        (props.disabled || isLoading) && "pointer-events-none",
        props.className,
      )}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
      }}
    >
      {isLoading && <LoadingSpinner size={16} />}
      {children}
    </button>
  );
}
