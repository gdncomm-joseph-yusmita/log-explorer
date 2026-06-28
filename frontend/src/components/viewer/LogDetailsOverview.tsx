import { applications } from "@/applications";
import { useLogsFilterStore } from "@/stores/useLogsFilterStore";
import { useLogsLayoutStore } from "@/stores/useLogsLayoutStore";
import HighlightText from "../ui/HighlightText";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Button from "../ui/Button";
import CopyText from "../ui/CopyText";

export default function LogDetailsOverview() {
  const { activeLog } = useLogsLayoutStore();
  const { searchQuery, app } = useLogsFilterStore();
  const schema = applications[app].schema;

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      {activeLog &&
        schema.map((col, i) => {
          const value = activeLog[col.key].toString();
          return (
            <div key={i} className="mb-4 relative">
              <p className="text-xs text-secondary font-light">{col.header}</p>
              <div
                className={cn(
                  "flex justify-between border border-border-strong rounded-lg mt-2 bg-input px-4 py-2 overflow-x-auto ",
                )}
              >
                <p className="text-xs font-[Geist_Mono]! **:font-[Geist_Mono]! whitespace-pre-wrap leading-[170%] text-primary">
                  {col.renderDetail?.(value, searchQuery) ||
                    col.render?.(value) || (
                      <HighlightText text={String(value)} query={searchQuery} />
                    )}
                </p>
                <CopyText
                  className="absolute right-1 top-7"
                  text={value.toString()}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
