'use client'

import { SmartDownloadComponent } from "@/components/providers/smart-download-provider";
import { Home } from "../../components/home/home"
import { Socket } from "@/components/providers/socket-provider";

function App() {
    return (
    <>
      <SmartDownloadComponent></SmartDownloadComponent>
      <Socket />
      <Home />
    </>
  );
}

export default App