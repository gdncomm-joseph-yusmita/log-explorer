import { applications } from "@/applications";
import { useLogsFilterStore } from "@/stores/useLogsFilterStore";
import { useLogsLayoutStore } from "@/stores/useLogsLayoutStore";

import hljs from "highlight.js";
import "@/highlight-theme.css";
import typescript from "highlight.js/lib/languages/typescript";
import { useMemo } from "react";
import CopyText from "../ui/CopyText";

hljs.registerLanguage("typescript", typescript);

export default function LogDetailsMessage() {
  const { activeLog } = useLogsLayoutStore();
  const { app } = useLogsFilterStore();

  const formatter = applications[app].schema.find(
    (s) => s.key === "message",
  )?.formatter;

  const message = useMemo(() => {
    const message = formatter
      ? formatter(activeLog?.message || "")
      : activeLog?.message;

    return hljs.highlight(message || "", {
      language: "typescript",
    }).value;
  }, [activeLog]);
  const lineCount = message.split("\n").length;

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col relative">
      <CopyText text={message} className="absolute right-4 top-2 z-10" />
      <div className="bg-code-editor-background relative flex-1 min-h-0 overflow-auto">
        <div className="flex px-8 py-4">
          <div className="pr-6">
            {Array.from({ length: lineCount + 2 }).map((_, i) => {
              return (
                <p
                  className="text-xs font-[Geist_Mono]! font-normal leading-[200%] text-secondary select-none"
                  key={i}
                >
                  {i + 1}
                </p>
              );
            })}
          </div>
          <p
            className="text-xs font-[Geist_Mono]! **:font-[Geist_Mono]! font-normal whitespace-pre-wrap leading-[200%] text-primary"
            // Inserting the html string directly is better for performance
            // since we're by passing react's virtual dom
            dangerouslySetInnerHTML={{ __html: message }}
          ></p>
        </div>
      </div>
    </div>
  );
}
