import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "../api/api";
import type { APISuccessResponse } from "../api/types";
import { applications, type Application } from "../applications";
import { io } from "socket.io-client";
import { useEffect } from "react";

export const logsQueryKeys = {
  all: "logs" as const,
  list: (args: { app: Application; amount: number }) =>
    [...logsQueryKeys.all, args, "list"] as const,
};

const socket = io("http://localhost:8080", {
  autoConnect: false,
});

export default function useLogsQuery({
  amount,
  app,
  stream,
}: {
  amount: number;
  app: Application;
  stream?: boolean;
}) {
  const parseLog = applications[app].parseFn;

  const query = useQuery({
    queryFn: async () => {
      const response = await API.get<APISuccessResponse<string[]>>("/logs", {
        params: {
          amount,
          app,
        },
      });
      return response.data.data;
    },
    queryKey: logsQueryKeys.list({ amount, app }),
    select: (data) => {
      // `flatMap` is a trick to handle (ApplicationLog | undefined)[] issue
      return data?.flatMap((log) => {
        const parsed = parseLog(log);
        return parsed ? [parsed] : [];
      });
    },
  });

  // Handle stream listening
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!stream) return;
    socket.connect();

    const handleConnect = () => console.log("Connected to server!");
    const handleNewLog = (log: string) => {
      const key = logsQueryKeys.list({ amount, app });
      queryClient.setQueryData(key, (current: string[] | undefined) => {
        if (!current) return [log];
        return [...current, log];
      });
    };

    socket.on(`new-log:${app}`, handleNewLog);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(`new-log:${app}`, handleNewLog);
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [stream, app]);

  return query;
}
