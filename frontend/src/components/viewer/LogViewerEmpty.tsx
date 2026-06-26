import { Icon } from "@iconify/react";
import Button from "../ui/Button";
import { useLogsStore } from "../../stores/useLogsStore";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { logsQueryKeys } from "../../hooks/useLogsQuery";

export default function LogViewerEmpty() {
  const { setSearchQuery, isStreaming, amount, app } = useLogsStore();
  const queryClient = useQueryClient();

  const queryKey = logsQueryKeys.list({ amount, app });

  const activeQueryRefetchCount = useIsFetching({ queryKey });
  const isRefetchingLogs = activeQueryRefetchCount > 0 || isStreaming;

  const resetFilters = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="border p-2 w-fit border-border rounded-md">
        <Icon className="text-3xl" icon={"ph:empty"} />
      </div>
      <h2 className="font-normal text-base mb-1 mt-3">No Logs Found</h2>
      <p className="text-xs text-secondary font-light">
        Looks like there weren't any logs matching your filters
      </p>
      <div className="flex items-center gap-3 mt-4">
        <Button
          onClick={() => resetFilters()}
          className="text-xs py-2"
          variant="primary"
        >
          Reset Filters
        </Button>
        <Button
          className="text-xs py-2"
          isLoading={isRefetchingLogs}
          onClick={() => {
            queryClient.refetchQueries({ queryKey });
          }}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
