import type { ButtonHTMLAttributes, ReactNode } from "react";
// import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "../../lib/utils";
import LoadingSpinner from "./LoadingSpinner";

const variants = {
  default:
    "disabled:opacity-50 disabled:hover:bg-primary bg-input text-primary border border-border-strong hover:bg-input-highlight hover:border-border-strong-highlight",
  primary:
    "disabled:opacity-50 disabled:hover:bg-primary bg-primary text-background border border-none hover:bg-primary-highlight",
  accent:
    "disabled:opacity-50 disabled:bg-secondary bg-accent text-background hover:bg-accent/75 shadow-[0_0_4px_0px_#3033fe4e]",
  danger:
    "disabled:opacity-50 disabled:bg-secondary bg-danger text-background hover:bg-danger/75 shadow-danger-glow",
  ghost:
    "disabled:opacity-50 bg-surface-light text-primary hover:opacity-50 border shadow-surface-glow",
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
