import type { ApplicationLog } from "@/applications/types";
import { create } from "zustand";

type LogsState = {
  sidebarExpanded: boolean;
  expandedLogs: string[];
  sidebarSizePx: number;
  activeLog: ApplicationLog | undefined;

  // Actions
  setSidebarExpanded: (state: boolean) => void;
  toggleLogExpansion: (log: string) => void;
  setSidebarSizePx: (size: number) => void;
  setActiveLog: (log: ApplicationLog | undefined) => void;
};

export const useLogsLayoutStore = create<LogsState>((set) => ({
  activeLog: undefined,
  sidebarExpanded: false,
  expandedLogs: [],
  sidebarSizePx: 600,

  setActiveLog: (log) => set({ activeLog: log }),
  setSidebarExpanded: (state) => set({ sidebarExpanded: state }),
  setSidebarSizePx: (size) => set({ sidebarSizePx: size }),
  toggleLogExpansion: (newLog) =>
    set((current) => {
      const alreadyExists = current.expandedLogs.find(
        (existingLog) => existingLog === newLog,
      );
      if (alreadyExists) {
        return {
          expandedLogs: current.expandedLogs.filter(
            (existingLog) => existingLog !== newLog,
          ),
        };
      }

      return { expandedLogs: [...current.expandedLogs, newLog] };
    }),
}));
