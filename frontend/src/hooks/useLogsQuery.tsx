import { useQuery, useQueryClient } from "@tanstack/react-query";
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
      queryClient.setQueryData(key, (current: typeof query.data) => {
        const parsed = parseLog(log);
        if (!current) return [parsed];
        return [...current, parseLog];
      });
    };

    socket.on("new-log", handleNewLog);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new-log", handleNewLog);
      socket.disconnect();
    };
  }, [stream]);

  return query;
}
