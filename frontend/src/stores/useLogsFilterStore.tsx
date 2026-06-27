import { create } from "zustand";
import type { Application } from "../applications";
import { rowsAmount } from "@/components/viewer/LogFooter";

type LogsState = {
  app: Application;
  amount: number;
  isStreaming: boolean;
  searchQuery: string;

  setApp: (app: Application) => void;
  setAmount: (amount: number) => void;
  setIsStreaming: (state: boolean) => void;
  setSearchQuery: (query: string) => void;
};

export const useLogsFilterStore = create<LogsState>((set) => ({
  app:
    (localStorage.getItem("logs.filter.app") as Application | undefined) ||
    ("odoo18" as const),

  amount: rowsAmount[1],
  isStreaming: false,
  sidebarExpanded: false,
  searchQuery: "",
  expandedLogs: [],
  sidebarSizePx: 500,

  setApp: (app) => {
    localStorage.setItem("logs.filter.app", app);
    return set({ app });
  },
  setAmount: (amount) => set({ amount }),
  setIsStreaming: (state) => set({ isStreaming: state }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
