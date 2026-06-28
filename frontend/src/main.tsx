import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "react-loading-skeleton/dist/skeleton.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SkeletonTheme } from "react-loading-skeleton";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme
        baseColor="var(--input)"
        highlightColor="var(--background)"
      >
        <App />
      </SkeletonTheme>
    </QueryClientProvider>
  </StrictMode>,
);
