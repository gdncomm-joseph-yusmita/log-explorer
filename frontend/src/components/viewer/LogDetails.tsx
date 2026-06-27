import type {
  ApplicationSchema,
  ApplicationLog,
} from "../../applications/types";
import { cn } from "../../lib/utils";
import { Icon } from "@iconify/react";
import HighlightText from "../ui/HighlightText";
import { useLogsStore } from "../../stores/useLogsStore";
import { useLogsOptionsStore } from "@/stores/useLogsOptionsStore";

type Props<T extends ApplicationLog> = {
  schema: ApplicationSchema<T>[];
};
export default function LogDetails<T extends ApplicationLog>({
  schema,
}: Props<T>) {
  const { setActiveLog, activeLog } = useLogsOptionsStore();
  const { searchQuery } = useLogsStore();

  return (
    <div
      className={cn(
        "border-t border-border bottom-0 border-l bg-white w-full transition-all transition-easing duration-200 flex flex-col",
      )}
    >
      <div className="flex justify-between items-center border-b border-gray-200 px-5 py-2">
        <div className="text-base">Log Details</div>
        <div
          className="hover:bg-mist-50 cursor-pointer transition duration-75 p-1 rounded-md"
          onClick={() => setActiveLog(undefined)}
        >
          <Icon className="text-lg" icon={"material-symbols:close"} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {activeLog &&
          schema.map((col, i) => {
            const value = (activeLog as T)[col.key];
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
