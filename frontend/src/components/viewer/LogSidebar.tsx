import { Icon } from "@iconify/react";
import { useLogsStore } from "../../stores/useLogsStore";
import { applications } from "../../applications";
import { cn } from "../../lib/utils";

export default function LogSidebar() {
  const { app } = useLogsStore();

  return (
    <div className="border-r border-border overflow-x-hidden **:whitespace-nowrap">
      <div className="px-3 py-3 mb-4 border-b border-border">
        <p className="text-base tracking-tight">Log Explorer</p>
      </div>
      <div className="px-3 font-light mb-2">
        <p className="text-[0.625rem] font-medium text-secondary">
          APPLICATION
        </p>
      </div>
      <ul className="px-2">
        {Object.entries(applications).map(([name, application]) => {
          const isActive = name === app;
          return (
            <div
              className={cn(
                "flex items-center gap-2.5 hover:bg-mist-100 px-3 py-2 rounded-md cursor-pointer",
                isActive && "bg-mist-100",
              )}
            >
              <Icon className="text-lg" icon={application.icon} />
              <p className="text-sm font-light">{application.name}</p>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
