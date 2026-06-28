import { Icon } from "@iconify/react";
import { cn } from "../../lib/utils";
import Button from "../ui/Button";
import LogSearch from "./LogSearch";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { logsQueryKeys } from "../../hooks/useLogsQuery";
import LogAppSwitcher from "./LogAppSwitcher";
import { useLogsFilterStore } from "@/stores/useLogsFilterStore";
import ThemeSwitcher from "./ThemeSwitcher";

export default function LogHeader() {
  const { isStreaming, setIsStreaming, amount, app } = useLogsFilterStore();
  const queryClient = useQueryClient();

  const queryKey = logsQueryKeys.list({ amount, app });
  const handleChangeLiveMode = () => {
    const nextIsStreamingState = !isStreaming;

    if (nextIsStreamingState) {
      // HACK: we're using query selector to prevent prop
      // drilling refs throughout a bunch of components
      document
        .querySelector(".viewer-body")
        ?.scrollTo({ top: 0, behavior: "auto" });
    }

    // Refresh the query
    queryClient.invalidateQueries({ queryKey });
    setIsStreaming(nextIsStreamingState);
  };

  const handleRefresh = () => {
    queryClient.refetchQueries({ queryKey });
  };

  const activeQueryRefetchCount = useIsFetching({ queryKey });
  const isRefetchingLogs = activeQueryRefetchCount > 0 || isStreaming;

  return (
    <div className="">
      <div className="flex p-4 pb-2 gap-2 items-center">
        <LogAppSwitcher />
        <LogSearch />
        <Button
          className={cn(
            "py-2.5 gap-2",
            isStreaming &&
              "border-accent hover:border-accent/80 hover:bg-accent/10",
          )}
          onClick={handleChangeLiveMode}
        >
          <Icon
            icon={isStreaming ? "boxicons:stop-circle" : "boxicons:play-circle"}
            className={cn("text-lg", isStreaming && "text-accent-foreground")}
          />
          <p
            className={cn(
              "font-light text-xs",
              isStreaming && "text-accent-foreground",
            )}
          >
            Live
          </p>
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
        <ThemeSwitcher />
      </div>
    </div>
  );
}
