import { Icon } from "@iconify/react";
import { cn } from "../../lib/utils";
import Button from "../ui/Button";
import LogSearch from "./LogSearch";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useLogsStore } from "../../stores/useLogsStore";
import { logsQueryKeys } from "../../hooks/useLogsQuery";
import LogSidebar from "./LogSidebar";

export default function LogHeader() {
  const {
    isStreaming,
    setIsStreaming,
    amount,
    app,
    setSidebarExpanded,
    sidebarExpanded,
  } = useLogsStore();
  const queryClient = useQueryClient();

  const queryKey = logsQueryKeys.list({ amount, app });
  const handleChangeLiveMode = () => {
    // Refresh the query
    queryClient.invalidateQueries({ queryKey });
    setIsStreaming(!isStreaming);
  };

  const handleRefresh = () => {
    queryClient.refetchQueries({ queryKey });
  };

  const activeQueryRefetchCount = useIsFetching({ queryKey });
  const isRefetchingLogs = activeQueryRefetchCount > 0 || isStreaming;

  return (
    <div>
      <div className="flex p-4 pb-2 gap-2 items-center">
        <Button
          className="px-2.5"
          onClick={() => {
            setSidebarExpanded(!sidebarExpanded);
          }}
        >
          <Icon className="text-lg" icon={"lucide:sidebar"} />
        </Button>
        <LogSearch />
        <Button
          className={cn("py-2.5 gap-2", isStreaming && "border-accent")}
          onClick={handleChangeLiveMode}
        >
          <Icon
            icon={isStreaming ? "boxicons:stop-circle" : "boxicons:play-circle"}
            className={cn("text-lg", isStreaming && "text-accent")}
          />
          <p className={cn("font-light", isStreaming && "text-accent")}>Live</p>
        </Button>
        <Button
          onClick={handleRefresh}
          disabled={isRefetchingLogs}
          className="py-2.5 px-2.5 gap-0 relative"
        >
          <div
            className={cn(
              "leading-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
              !isRefetchingLogs && "invisible",
            )}
          >
            <LoadingSpinner size={20} />
          </div>
          <Icon
            icon={"ix:refresh"}
            className={cn("text-lg pl-px", isRefetchingLogs && "invisible")}
          />
        </Button>
      </div>
    </div>
  );
}
