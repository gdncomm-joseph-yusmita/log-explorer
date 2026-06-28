import { Icon } from "@iconify/react";
import { applications, type Application } from "../../applications";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { useState } from "react";
import { useLogsFilterStore } from "@/stores/useLogsFilterStore";
import { useLogsLayoutStore } from "@/stores/useLogsLayoutStore";

export default function LogAppSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { app, setApp } = useLogsFilterStore();
  const { setActiveLog } = useLogsLayoutStore();

  const selectedApp = applications[app];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <div
          className={cn(
            "flex items-center gap-4 bg-input border border-border-strong hover:bg-input-highlight hover:border-border-strong-highlight px-3 py-2 rounded-md cursor-pointer",
          )}
        >
          <div className="flex items-center gap-2.5 text-primary">
            <Icon className="text-base" icon={selectedApp.icon} />
            <p className="text-sm font-light truncate">{selectedApp.name}</p>
          </div>
          <Icon
            className="text-base text-primary"
            icon={"mdi:chevron-up-down"}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent align="start">
        <ul className="p-1.5 min-w-64 bg-foreground">
          {Object.entries(applications).map(([name, application]) => {
            const isActive = name === app;
            return (
              <div
                key={name}
                className={cn(
                  "flex items-center justify-between gap-2.5 text-secondary hover:bg-selection px-3 py-2 transition duration-75 hover:text-primary-highlight rounded-md cursor-pointer",
                  isActive && "bg-selection text-primary",
                )}
                onClick={() => {
                  setApp(name as Application);
                  setIsOpen(false);
                  if (app !== name) {
                    setActiveLog(undefined);
                  }
                }}
              >
                <div className="flex gap-2.5">
                  <Icon className="text-lg" icon={application.icon} />
                  <p className="text-sm font-light">{application.name}</p>
                </div>
                {isActive && (
                  <div className="w-1.5 ring-secondary ring-offset-2 ring aspect-square rounded-full bg-primary"></div>
                )}
              </div>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
