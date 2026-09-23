'use client'

import { Toaster } from "@/components/ui/sonner";
import { Home } from "../../components/home/home"
import { Socket } from "@/components/providers/socket-provider";

function App() {
    return (
    <>
      <Toaster position="top-right" />
      <Socket />
      <Home />
    </>
  );
}

export default App