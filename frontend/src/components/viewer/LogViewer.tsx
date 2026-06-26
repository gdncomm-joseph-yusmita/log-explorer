import Skeleton from "react-loading-skeleton";
import type {
  ApplicationColumn,
  ApplicationLog,
} from "../../applications/types";
import { cn } from "../../lib/utils";
import { useLogsStore } from "../../stores/useLogsStore";
import HighlightText from "../ui/HighlightText";
import { Icon } from "@iconify/react";
import Button from "../ui/Button";
import LogViewerEmpty from "./LogViewerEmpty";

type Props<T extends ApplicationLog> = {
  columns: ApplicationColumn<T>[];
  logs?: T[];
  onSelect: (value?: T) => void;
  activeLog?: T;
  isLoading?: boolean;
};

export default function LogViewer<T extends ApplicationLog>({
  columns,
  logs,
  onSelect,
  activeLog,
  isLoading,
}: Props<T>) {
  const { searchQuery, toggleLogExpansion, expandedLogs } = useLogsStore();

  const gridTemplateColumns =
    "0.25rem " +
    columns
      .filter((s) => !s.hidden)
      .map((s) => s.columnSize || "")
      .join(" ") +
    ` 1rem`;

  const filteredLogs = logs?.filter((log) =>
    log.raw.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
      <div className="grid grid-cols-[2rem_1fr] border-b border-border">
        <div></div>
        <ul
          className="grid bg-background px-3 py-2 "
          style={{ gridTemplateColumns }}
        >
          <div></div>
          {columns.map((col, i) => {
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

      <ul className="p-2 overflow-y-scroll flex-1 min-h-0 bg-white">
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

          // All logs should be expanded if a user searches
          const isExpanded = expandedLogs.includes(log.raw);

          return (
            <div className="grid grid-cols-[2rem_1fr] odd:bg-mist-50 rounded-md mb-0.5">
              <div
                className={cn(
                  "flex items-center justify-center rounded-sm self-start aspect-square hover:bg-mist-100 cursor-pointer h-fit",
                  !isActive && "",
                )}
                onClick={() => {
                  toggleLogExpansion(log.raw);
                }}
              >
                <Icon
                  icon={"mdi:chevron-down"}
                  className="text-lg text-secondary"
                />
              </div>

              <li
                onClick={() => {
                  onSelect(activeLog === log ? undefined : log);
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
                {columns.map((col, j) => {
                  if (col.hidden) return;
                  return (
                    <div
                      className={cn(
                        "px-1 py-2 min-w-0 text-xs font-[Geist_Mono]! **:font-[Geist_Mono]! text-mist-700 font-normal",
                        isExpanded
                          ? "break-all whitespace-pre-wrap leading-[170%]"
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
  );
}
