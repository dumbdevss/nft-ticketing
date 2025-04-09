"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ProgressBar } from "~~/components/scaffold-move/ProgressBar";
import { WalletProvider } from "~~/components/scaffold-move/WalletContext";

const ScaffoldMoveApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="relative flex flex-col flex-1">{children}</main>
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldMoveAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProgressBar />

      <WalletProvider>
        <ScaffoldMoveApp>{children}</ScaffoldMoveApp>
      </WalletProvider>
    </QueryClientProvider>
  );
};
