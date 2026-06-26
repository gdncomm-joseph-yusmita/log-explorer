import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type Props = {
  size?: number | string;
  color?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function LoadingSpinner({
  size = "80px",
  color = "currentColor",
  ...props
}: Props = {}) {
  const style = {
    "--spinner-size": typeof size === "number" ? `${size}px` : size,
    "--spinner-color": color,
  } as CSSProperties;

  return (
    <div
      {...props}
      className={cn("lds-spinner", props.className)}
      style={style}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} />
      ))}
    </div>
  );
}
