"use client"

import type { ReactNode } from "react"
import { AppProvider } from "@/components/app-context"
import { TopNav } from "@/components/top-nav"
import { ProjectDrawer } from "@/components/project-drawer"
import { PolarisAssistant } from "@/components/polaris-assistant"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <TopNav />

        <main className="px-6 py-6">
          {children}
        </main>

        <ProjectDrawer />
        <PolarisAssistant />
      </div>
    </AppProvider>
  )
}