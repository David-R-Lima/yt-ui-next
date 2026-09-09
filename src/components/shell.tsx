'use client'

import { Controls } from "../components/player"
import { Header } from "../components/header"
import { useState } from "react"
import { HeaderState } from "@/enums/header"
import { cn } from "../lib/utils"
import { useAppSettingsStore } from "@/store/app-settings-store"
import { Home } from "../components/home/home"
import { NavList } from "@/components/navlist"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Shell({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HeaderState>(HeaderState.HOME)
  const { color } = useAppSettingsStore()
  const [show, setShow] = useState<boolean>(true)

return (
    <main
      className={cn(
        "h-screen w-screen overflow-hidden grid grid-rows-[1fr_auto]",
        "md:grid-cols-[220px_1fr]",
        show ? "md:grid-cols-[180px_1fr]" : "md:grid-cols-[60px_1fr]",
        color
      )}
    >
    {/* Sidebar */}
      <aside className="hidden md:block row-start-1 col-start-1 overflow-hidden border-r-2 border-gray-800 p-2">
        <button
          className="flex w-full p-2 rounded-lg hover:cursor-pointer hover:bg-gray-800"
          onClick={() => setShow(!show)}
        >
          <Menu />
        </button>

        <NavList show={show} />
      </aside>

    {/* Main content */}
      <div className="row-start-1 col-start-1 md:col-start-2 min-w-0 min-h-0 flex flex-col">
        <header className="shrink-0 flex items-center w-screen md:w-full">
          {/* Mobile menu */}
          <div className="md:hidden shrink-0 px-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-gray-800">
                  <Menu />
                </button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[280px]">
                <NavList show={true} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Header */}
          <div className="min-w-0 flex-1">
            <Header
              state={state}
              setHeaderState={setState}
            />
          </div>
        </header>

        <section className="flex-1 min-h-0 overflow-y-auto w-screen md:w-full">
          {children}
        </section>
      </div>
    <div className="row-start-2 col-span-2 w-full">
      <Controls />
    </div>
  </main>
)
}

export default Shell