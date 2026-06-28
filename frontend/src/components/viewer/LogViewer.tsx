import type {
  ApplicationSchema,
  ApplicationLog,
} from "../../applications/types";
import LogViewerTable from "./LogViewerTable";
import LogDetails from "./LogDetails";
import { useRef } from "react";
import DraggableSidebar from "./DraggableSidebar";
import { useLogsLayoutStore } from "@/stores/useLogsLayoutStore";

type Props<T extends ApplicationLog> = {
  schema: ApplicationSchema<T>[];
  logs?: T[];
  isLoading?: boolean;
};

export default function LogViewer<T extends ApplicationLog>({
  schema,
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
        <LogViewerTable
          schema={schema as ApplicationSchema<ApplicationLog>[]}
          logs={logs}
          isLoading={isLoading}
        />
        <div className="relative bg-background h-full min-h-0">
          <DraggableSidebar containerRef={containerRef}>
            <LogDetails
              schema={schema as ApplicationSchema<ApplicationLog>[]}
            />
          </DraggableSidebar>
        </div>
      </div>
    </>
  );
}
