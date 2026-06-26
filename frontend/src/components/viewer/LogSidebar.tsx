import { useLogsStore } from "../../stores/useLogsStore";

export default function LogSidebar() {
  const { app } = useLogsStore();
  return (
    <div className="border-r border-border overflow-x-hidden">
      <div className="px-4 py-2 border-b border-border">
        <p className="text-xs">Filters</p>
      </div>
      <ul className="p-4"></ul>
    </div>
  );
}
