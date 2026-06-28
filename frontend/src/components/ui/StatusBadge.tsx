import { cn } from "@/lib/utils";

type Props = {
  status: string;
};

const colorMap: Record<string, string> = {
  INFO: "bg-accent text-white [html.dark_&]:bg-accent/25 [html.dark_&]:text-accent-foreground ",
  ERROR:
    "bg-danger text-white [html.dark_&]:bg-danger/30 [html.dark_&]:text-danger-foreground",
  WARN: "bg-warn text-white [html.dark_&]:bg-warn/25 [html.dark_&]:text-warn-foreground",
  WARNING:
    "bg-warn text-white [html.dark_&]:bg-warn/25 [html.dark_&]:text-warn-foreground",
};

const defaultColor =
  "bg-secondary text-white dark:bg-secondary/20 dark:text-secondary-highlight";

export default function StatusBadge({ status }: Props) {
  const normalized = status.toUpperCase();
  const colorClass = colorMap[normalized] || defaultColor;

  return (
    <span
      className={cn(
        "px-1 py-0.5 rounded-sm text-[0.7rem] font-light tracking-wide",
        colorClass,
      )}
    >
      {status}
    </span>
  );
}
