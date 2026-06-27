import { create } from "zustand";
import type { Application } from "../applications";

type LogsState = {
  // UI Settings
  app: Application;
  amount: number;
  isStreaming: boolean;
  searchQuery: string;
  sidebarExpanded: boolean;
  expandedLogs: string[];
  sidebarSizePx: number;

  // Actions
  setApp: (app: Application) => void;
  setAmount: (amount: number) => void;
  setIsStreaming: (state: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSidebarExpanded: (state: boolean) => void;
  toggleLogExpansion: (log: string) => void;
  setSidebarSizePx: (size: number) => void;
};

export const useLogsStore = create<LogsState>((set) => ({
  // Initial State
  app: "odoo18",
  amount: 100,
  isStreaming: false,
  sidebarExpanded: false,
  searchQuery: "",
  expandedLogs: [],
  sidebarSizePx: 500,

  // Setters
  setApp: (app) => set({ app }),
  setAmount: (amount) => set({ amount }),
  setIsStreaming: (state) => set({ isStreaming: state }),
  setSearchQuery: (query) => set({ searchQuery: query }),
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
