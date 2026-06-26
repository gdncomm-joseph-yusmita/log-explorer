import Skeleton from "react-loading-skeleton";
import type {
  ApplicationColumn,
  ApplicationLog,
} from "../../applications/types";
import { cn } from "../../lib/utils";
import { Icon } from "@iconify/react";
import HighlightText from "../ui/HighlightText";
import { useLogsStore } from "../../stores/useLogsStore";

type Props<T extends ApplicationLog> = {
  columns: ApplicationColumn<T>[];
  log: T | undefined;
  onClose: () => void;
};
export default function LogDetails<T extends ApplicationLog>({
  log,
  columns,
  onClose,
}: Props<T>) {
  const { searchQuery } = useLogsStore();

  return (
    <div
      className={cn(
        "absolute right-0 top-8 border-t border-border bottom-0 border-l bg-white w-full max-w-160 overflow-y-auto transition-all transition-easing duration-200 flex flex-col",
        log
          ? "translate-x-0 opacity-100 visible"
          : "translate-x-6 opacity-0 invisible",
      )}
    >
      <div className="flex justify-between items-center border-b border-gray-200 px-5 py-2">
        <div className="text-base">Log Details</div>
        <div
          className="hover:bg-mist-50 cursor-pointer transition duration-75 p-1 rounded-md"
          onClick={onClose}
        >
          <Icon className="text-lg" icon={"material-symbols:close"} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {log &&
          columns.map((col, i) => {
            const value = log[col.key];
            return (
              <div key={i} className="mb-4">
                <p className="text-xs text-gray-500 font-light">{col.header}</p>
                <div
                  className={cn(
                    "border border-mist-200 rounded-lg mt-2 bg-mist-50 px-4 py-2 overflow-x-auto",
                  )}
                >
                  <p className="text-xs font-[Geist_Mono]! **:font-[Geist_Mono]! whitespace-pre-wrap leading-[170%]">
                    {col.renderDetail?.(value, searchQuery) ||
                      col.render?.(value) || (
                        <HighlightText
                          text={String(value)}
                          query={searchQuery}
                        />
                      )}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
