"use client"

import type { ReactNode } from "react"
import { AppProvider } from "@/components/app-context"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { ProjectDrawer } from "@/components/project-drawer"
import { PolarisAssistant } from "@/components/polaris-assistant"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="lg:pl-[264px]">
          <TopNav />
          <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
        <ProjectDrawer />
        <PolarisAssistant />
      </div>
    </AppProvider>
  )
}
