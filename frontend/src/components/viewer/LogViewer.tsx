import type {
  ApplicationSchema,
  ApplicationLog,
} from "../../applications/types";
import LogViewerTable from "./LogViewerTable";
import LogDetails from "./LogDetails";
import { useRef } from "react";
import DraggableSidebar from "./DraggableSidebar";
import { useLogsLayoutStore } from "@/stores/useLogsLayoutStore";
import { applications } from "@/applications";
import { useLogsFilterStore } from "@/stores/useLogsFilterStore";

type Props<T extends ApplicationLog> = {
  logs?: T[];
  isLoading?: boolean;
};

export default function LogViewer<T extends ApplicationLog>({
  logs,
  isLoading,
}: Props<T>) {
  const { sidebarSizePx, activeLog } = useLogsLayoutStore();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        className="relative flex-1 grid min-h-0"
        style={{
          gridTemplateColumns: `1fr ${activeLog ? sidebarSizePx + "px" : "0"}`,
        }}
        ref={containerRef}
      >
        <LogViewerTable logs={logs} isLoading={isLoading} />
        <div className="relative bg-background h-full min-h-0">
          <DraggableSidebar containerRef={containerRef}>
            <LogDetails />
          </DraggableSidebar>
        </div>
      </div>
    </>
  );
}
