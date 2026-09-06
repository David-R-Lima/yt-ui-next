'use client'

import App from "./App";
import { ReactQueryProvider } from "./components/providers/react-query-provider";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { Socket } from "./components/providers/socket-provider";
import { InitLastHeard } from "./components/init-last-heard-song";

export default function Home() {
  return (
    <ReactQueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App/>
        <Toaster position="top-right"/>
        <InitLastHeard />
        <Socket></Socket>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
