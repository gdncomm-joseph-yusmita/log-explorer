import { cn } from "../../lib/utils";
import { Icon } from "@iconify/react";
import { useLogsLayoutStore } from "@/stores/useLogsLayoutStore";
import { useState } from "react";
import LogDetailsOverview from "./LogDetailsOverview";
import LogDetailsMessage from "./LogDetailsMessage";

const views = [
  { value: "overview", display: "Overview", component: <LogDetailsOverview /> },
  { value: "message", display: "Message", component: <LogDetailsMessage /> },
] as const;
type DetailView = (typeof views)[number]["value"];

export default function LogDetails() {
  const [activeView, setActiveView] = useState<DetailView>("overview");
  const { setActiveLog } = useLogsLayoutStore();

  const detailComponent = views.find((v) => v.value === activeView)?.component;

  return (
    <div
      className={cn(
        "border-t border-border bottom-0 border-l bg-sidebar w-full h-full min-h-0 transition-all transition-easing duration-200 flex flex-col",
      )}
    >
      <div className="flex justify-between items-center px-5 border-b border-border relative">
        <ul className="flex gap-5">
          {views.map((view, i) => {
            const isActive = activeView === view.value;
            return (
              <li
                key={i}
                className={cn(
                  "font-[Geist_Mono]! tracking-wide font-light text-xs text-secondary py-3 border-b border-transparent cursor-pointer transition duration-200",
                  isActive
                    ? "text-primary border-primary"
                    : "hover:text-secondary-highlight",
                )}
                onClick={() => setActiveView(view.value)}
              >
                {view.display.toUpperCase()}
              </li>
            );
          })}
        </ul>
        <div
          className="hover:bg-input-highlight hover:**:text-primary cursor-pointer transition duration-75 p-1 rounded-md"
          onClick={() => {
            setActiveLog(undefined);
          }}
        >
          <Icon
            className="text-lg text-secondary transition duration-75"
            icon={"material-symbols:close"}
          />
        </div>
      </div>
      {detailComponent}
    </div>
  );
}
