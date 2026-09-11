import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@//components/providers/react-query-provider";
import { ThemeProvider } from "@//components/providers/theme-provider";
import Shell from "@/components/shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Player",
  description: "Music player",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <ThemeProvider defaultTheme="dark">
        <body className="min-h-full flex flex-col">
          <ReactQueryProvider>
            <Shell>
              {children}
            </Shell>
          </ReactQueryProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
