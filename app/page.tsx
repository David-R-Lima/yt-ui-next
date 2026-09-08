import App from "./App";
import { ReactQueryProvider } from "./components/providers/react-query-provider";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { Socket } from "./components/providers/socket-provider";
import { InitLastHeard } from "./components/init-last-heard-song";
import { Login } from "./components/login";
import { isAuthenticated } from "./lib/auth";

export default async function Home() {
  const authenticated = await isAuthenticated();

  return (
    <ReactQueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {authenticated ? (
          <>
            <Toaster position="top-right" />
            <InitLastHeard />
            <Socket />
            <App />
          </>
        ) : (
          <Login />
        )}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
