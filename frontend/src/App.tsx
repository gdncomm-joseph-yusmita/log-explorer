import LogViewer from "./components/viewer/LogViewer";
import useLogsQuery from "./hooks/useLogsQuery";
import { applications } from "./applications";
import LogHeader from "./components/viewer/LogHeader";
import { cn } from "./lib/utils";

import type { ApplicationSchema, ApplicationLog } from "./applications/types";
import LogFooter from "./components/viewer/LogFooter";
import { useLogsFilterStore } from "./stores/useLogsFilterStore";

export default function App() {
  const { app, amount, isStreaming, searchQuery } = useLogsFilterStore();

  const { data, isLoading } = useLogsQuery({
    amount,
    app,
    stream: isStreaming,
  });
  const schema = applications[app].schema;

  const filteredLogs = data?.filter((log) =>
    log.raw.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className={cn(
        "h-dvh overflow-hidden bg-foreground grid content-stretch ",
      )}
    >
      <div className="flex flex-col h-full min-w-0 min-h-0">
        <LogHeader />
        <LogViewer
          schema={schema as ApplicationSchema<ApplicationLog>[]}
          logs={filteredLogs as ApplicationLog[]}
          isLoading={isLoading}
        />
        <LogFooter
          allLogCount={data?.length || 0}
          filteredLogCount={filteredLogs?.length || 0}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
