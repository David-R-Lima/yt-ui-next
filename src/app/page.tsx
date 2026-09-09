import App from "./App";
import { Toaster } from "../components/ui/sonner";
import { Socket } from "../components/providers/socket-provider";
import { InitLastHeard } from "../components/init-last-heard-song";
import { isAuthenticated } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  return (
    <>
      <Toaster position="top-right" />
      <InitLastHeard />
      <Socket />
      <App />
    </>
  );
}
