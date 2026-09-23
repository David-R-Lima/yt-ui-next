import { isAuthenticated } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  } else {
    redirect("/home")
  }
}
