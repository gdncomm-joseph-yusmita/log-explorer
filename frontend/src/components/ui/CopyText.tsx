import { Icon } from "@iconify/react";
import Button from "./Button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

type Props = {
  text: string;
  timer?: number;
};

export default function CopyText({
  text,
  timer = 1000,
  ...props
}: Props & Omit<React.ComponentProps<typeof Button>, "children">) {
  const [hasCopied, setHasCopied] = useState(false);
  const timerRef = useRef<number>(null);

  const handleCopy = () => {
    if (hasCopied) return;
    if (timerRef.current) {
      timerRef.current = null;
    }

    setHasCopied(true);
    navigator.clipboard.writeText(text);

    timerRef.current = setTimeout(() => {
      setHasCopied(false);
    }, timer);
  };
  return (
    <Button
      {...props}
      className={cn(
        "h-7 p-1.5 active:scale-100 shadow-background/20 shadow-lg",
        props.className,
      )}
      onClick={handleCopy}
    >
      {hasCopied ? (
        <div className="flex gap-1.5 h-fit items-center">
          <Icon
            icon={"material-symbols:check"}
            className="text-[0.9rem] text-secondary"
          />
          <p className="text-xs font-light">Copied</p>
        </div>
      ) : (
        <Icon icon={"tabler:copy"} className="text-[0.9rem] rounded-sm" />
      )}
    </Button>
  );
}
