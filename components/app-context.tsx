"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Project } from "@/lib/data"

type AppState = {
  selectedProject: Project | null
  openProject: (p: Project) => void
  closeProject: () => void
  polarisOpen: boolean
  setPolarisOpen: (v: boolean) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [polarisOpen, setPolarisOpen] = useState(false)

  return (
    <Ctx.Provider
      value={{
        selectedProject,
        openProject: setSelectedProject,
        closeProject: () => setSelectedProject(null),
        polarisOpen,
        setPolarisOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
