'use client'

import { Toaster } from "@/components/ui/sonner";
import { Home } from "../../components/home/home"
import { InitLastHeard } from "@/components/init-last-heard-song";
import { Socket } from "@/components/providers/socket-provider";

function App() {
    return (
    <>
      <Toaster position="top-right" />
      <InitLastHeard />
      <Socket />
      <Home />
    </>
  );
}

export default App