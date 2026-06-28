import { create } from "zustand";
import { applications, type Application } from "../applications";
import { rowsAmount } from "@/components/viewer/LogFooter";
import type { ApplicationSchema } from "@/applications/types";

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
  searchQuery: "",

  setApp: (app) => {
    localStorage.setItem("logs.filter.app", app);
    return set({ app });
  },
  setAmount: (amount) => set({ amount }),
  setIsStreaming: (state) => set({ isStreaming: state }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
