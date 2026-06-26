import { useState } from "react";
import LogViewer from "./components/viewer/LogViewer";
import LogDetails from "./components/viewer/LogDetails";
import useLogsQuery from "./hooks/useLogsQuery";
import { applications } from "./applications";
import LogHeader from "./components/viewer/LogHeader";
import { useLogsStore } from "./stores/useLogsStore";
import LogSidebar from "./components/viewer/LogSidebar";
import { cn } from "./lib/utils";

export default function App() {
  const { app, amount, isStreaming, sidebarExpanded } = useLogsStore();

  const { data, isLoading } = useLogsQuery({
    amount,
    app,
    stream: isStreaming,
  });
  const columns = applications[app].columns;

  const [activeLog, setActiveLog] = useState<
    NonNullable<typeof data>[number] | undefined
  >();

  return (
    <div
      className={cn(
        "h-dvh overflow-hidden bg-background grid content-stretch transition-[grid-template-columns] transition-easing duration-300",
        sidebarExpanded ? "grid-cols-[15rem_1fr]" : "grid-cols-[0rem_1fr]",
      )}
    >
      <LogSidebar />
      <div className="flex flex-col h-full min-w-0 min-h-0">
        <LogHeader />
        <div className="relative flex-1 flex flex-col min-h-0">
          <LogViewer
            columns={columns}
            logs={data}
            onSelect={setActiveLog}
            activeLog={activeLog}
            isLoading={isLoading}
          />
          <LogDetails
            columns={columns}
            log={activeLog}
            onClose={() => setActiveLog(undefined)}
          />
        </div>
      </div>
    </div>
  );
}
