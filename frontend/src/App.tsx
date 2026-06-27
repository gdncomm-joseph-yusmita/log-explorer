import LogViewer from "./components/viewer/LogViewer";
import useLogsQuery from "./hooks/useLogsQuery";
import { applications } from "./applications";
import LogHeader from "./components/viewer/LogHeader";
import { useLogsStore } from "./stores/useLogsStore";
import { cn } from "./lib/utils";
import { Icon } from "@iconify/react";

import type { ApplicationSchema, ApplicationLog } from "./applications/types";

export default function App() {
  const { app, amount, isStreaming } = useLogsStore();

  const { data, isLoading } = useLogsQuery({
    amount,
    app,
    stream: isStreaming,
  });
  const schema = applications[app].schema;

  return (
    <div
      className={cn(
        "h-dvh overflow-hidden bg-background grid content-stretch ",
      )}
    >
      <div className="flex flex-col h-full min-w-0 min-h-0">
        <LogHeader />
        <LogViewer
          schema={schema as ApplicationSchema<ApplicationLog>[]}
          logs={data as ApplicationLog[]}
          isLoading={isLoading}
        />
        <div className="text-xs bg-background border-t border-border py-2 px-4 text-secondary">
          <div className="flex items-center gap-2">
            <Icon
              icon={"material-symbols:info-outline"}
              className="text-base"
            />
            Showing {data?.length || "--"} Entries
          </div>
        </div>
      </div>
    </div>
  );
}
