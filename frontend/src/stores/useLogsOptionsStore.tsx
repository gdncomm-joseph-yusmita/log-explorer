import { create } from "zustand";
import type { ApplicationLog } from "../applications/types";

type LogsOptionsState = {
  activeLog: ApplicationLog | undefined;
  setActiveLog: (log: ApplicationLog | undefined) => void;
};

export const useLogsOptionsStore = create<LogsOptionsState>((set) => ({
  activeLog: undefined,
  setActiveLog: (log) => set({ activeLog: log }),
}));
