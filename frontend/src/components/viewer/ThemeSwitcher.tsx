import { Icon, setCustomIconLoader } from "@iconify/react";
import Button from "../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { act, useState } from "react";
import { cn } from "@/lib/utils";

const themes = [
  { value: "dark", display: "Dark" },
  { value: "light", display: "Light" },
  { value: "system", display: "System" },
] as const;
type Theme = (typeof themes)[number]["value"];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="aspect-square p-2">
          <Icon icon={"proicons:dark-theme"} className="text-xl" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="gap-0 w-40" align="end">
        <div className="border-b px-2 py-2">
          <p className="text-xs text-secondary">Theme</p>
        </div>
        <ul className="p-1">
          {themes.map((theme, i) => {
            const isActive = activeTheme === theme.value;
            return (
              <li
                key={i}
                className={cn(
                  "text-secondary text-xs px-3 py-1 hover:bg-selection rounded-sm flex items-center gap-2 transition duration-75 cursor-pointer",
                  isActive && "bg-selection text-primary",
                )}
                onClick={() => {
                  localStorage.setItem("theme", theme.value);
                  setActiveTheme(theme.value);
                  setIsOpen(false);

                  const systemThemeDark = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                  ).matches;

                  if (
                    theme.value === "dark" ||
                    (theme.value === "system" && systemThemeDark)
                  ) {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                }}
              >
                <p
                  className={cn(
                    "w-1 h-1 bg-primary rounded-full transition duration-75  opacity-0",
                    isActive && "opacity-100",
                  )}
                ></p>
                {theme.display}
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
