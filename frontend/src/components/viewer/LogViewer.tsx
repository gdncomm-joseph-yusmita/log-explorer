import type {
  ApplicationSchema,
  ApplicationLog,
} from "../../applications/types";
import LogViewerTable from "./LogViewerTable";
import LogDetails from "./LogDetails";
import { useLogsOptionsStore } from "@/stores/useLogsOptionsStore";
import { useRef, useState } from "react";
import { useLogsStore } from "@/stores/useLogsStore";
import DraggableSidebar from "./DraggableSidebar";

type Props<T extends ApplicationLog> = {
  schema: ApplicationSchema<T>[];
  logs?: T[];
  isLoading?: boolean;
};

const MIN_SIZE_PX = 300;
const MAX_SIZE_PERCENT = 0.9;

export default function LogViewer<T extends ApplicationLog>({
  schema,
  logs,
  isLoading,
}: Props<T>) {
  const { sidebarSizePx } = useLogsStore();
  const { activeLog } = useLogsOptionsStore();
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
        <div className="overflow-y-auto relative bg-white">
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
