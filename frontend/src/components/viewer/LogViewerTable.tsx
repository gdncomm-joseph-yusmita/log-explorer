import Skeleton from "react-loading-skeleton";
import type {
  ApplicationSchema,
  ApplicationLog,
} from "../../applications/types";
import { cn } from "../../lib/utils";
import { useLogsStore } from "../../stores/useLogsStore";
import HighlightText from "../ui/HighlightText";
import { Icon } from "@iconify/react";
import LogViewerEmpty from "./LogViewerEmpty";
import { useLogsOptionsStore } from "@/stores/useLogsOptionsStore";

type Props<T extends ApplicationLog> = {
  schema: ApplicationSchema<T>[];
  logs?: T[];
  isLoading?: boolean;
};

export default function LogViewerTable<T extends ApplicationLog>({
  schema,
  logs,
  isLoading,
}: Props<T>) {
  const { activeLog, setActiveLog } = useLogsOptionsStore();
  const { searchQuery, toggleLogExpansion, expandedLogs } = useLogsStore();

  const gridTemplateColumns =
    "0.25rem " +
    schema
      .filter((s) => !s.hidden)
      .map((s) => s.columnSize || "")
      .join(" ") +
    ` 1rem`;

  const filteredLogs = logs?.filter((log) =>
    log.raw.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-auto relative">
      <div className="flex flex-col flex-1 min-w-full w-fit">
        <div className="grid  bg-background grid-cols-[2rem_1fr] border-y border-border sticky left-0 right-0 top-0 z-10">
          <div></div>
          <ul className="grid px-3 py-2 " style={{ gridTemplateColumns }}>
            <div></div>
            {schema.map((col, i) => {
              if (col.hidden) return;
              return (
                <li key={i} className="text-gray-500 text-xs font-light">
                  {col.header}
                </li>
              );
            })}
            <div></div>
          </ul>
        </div>

        <ul className="p-2 flex-1 min-h-0 bg-white viewer-body">
          {!isLoading && filteredLogs && filteredLogs.length <= 0 && (
            <LogViewerEmpty />
          )}
          {isLoading &&
            new Array(24).fill("x").map((_, i) => {
              return (
                <div key={i}>
                  <Skeleton key={i} containerClassName="flex-1 h-6 flex mb-2" />
                </div>
              );
            })}
          {filteredLogs?.map((_, i) => {
            // HACK: Performant way to read from the end of the array to the front without allocating new memory
            const reverseIndex = filteredLogs.length - 1 - i;
            const log = filteredLogs[reverseIndex];

            // TODO: Change this into id based later!
            const isActive = activeLog && log.raw === activeLog.raw;
            const isExpanded = expandedLogs.includes(log.raw);

            return (
              <div
                key={`item-${i}`}
                className="relative grid grid-cols-[2rem_1fr] odd:bg-mist-50 rounded-md mb-0.5"
              >
                <div
                  className={cn(
                    " flex items-center flex-col justify-center rounded-sm self-start aspect-square hover:bg-mist-100 cursor-pointer h-fit",
                    !isActive && "",
                  )}
                  onClick={() => {
                    toggleLogExpansion(log.raw);
                  }}
                >
                  <Icon
                    icon={"mdi:chevron-down"}
                    className={cn(
                      "text-lg text-secondary -rotate-90",
                      isExpanded && "rotate-0",
                    )}
                  />
                  <div className="w-px bg-secondary/50 absolute bottom-0 left-4 top-8"></div>
                </div>

                <li
                  onClick={() => {
                    setActiveLog(activeLog === log ? undefined : log);
                  }}
                  className={cn(
                    "grid rounded-md cursor-pointer items-start",
                    isActive
                      ? "bg-gray-200! opacity-100"
                      : "hover:bg-mist-100 hover:has-[.expand:hover]:bg-transparent opacity-90",
                  )}
                  style={{ gridTemplateColumns }}
                  key={i}
                >
                  <div></div>
                  {schema.map((col, j) => {
                    if (col.hidden) return;
                    return (
                      <div
                        className={cn(
                          "px-1 py-1 min-w-0 text-xs leading-[200%] font-[Geist_Mono]! **:font-[Geist_Mono]! text-mist-700 font-normal",
                          isExpanded
                            ? "break-all whitespace-pre-wrap"
                            : "truncate",
                        )}
                        key={`row-${i}:col-${j}`}
                      >
                        {col.render ? (
                          col.render(log[col.key], searchQuery)
                        ) : (
                          <HighlightText
                            text={String(log[col.key])}
                            query={searchQuery}
                          />
                        )}
                      </div>
                    );
                  })}
                  <div></div>
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
