'use client'

import { Home } from "../../components/home/home"
import { Socket } from "@/components/providers/socket-provider";

function App() {
    return (
    <>
      <Socket />
      <Home />
    </>
  );
}

export default App