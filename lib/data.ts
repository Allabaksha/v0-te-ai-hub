export type Region = "EMIA" | "AMER" | "GLOBAL" | "APAC"
export type Category = "AI" | "Automation" | "Analytics" | "Digital Transformation"
export type Status = "Live" | "In Progress" | "Discovery" | "Planned"
export type Priority = "Critical" | "High" | "Medium" | "Low"

export type Milestone = {
  label: string
  date: string
  done: boolean
}

export type Project = {
  id: string
  name: string
  owner: string
  region: Region
  category: Category
  status: Status
  priority: Priority
  progress: number
  startDate: string
  endDate: string
  annualValue: number
  weeklyHours: number
  fteSavings: number
  description: string
  milestones: Milestone[]
  dependencies: string[]
}

export const STATUS_META: Record<Status, { label: string; color: string; dot: string; bar: string }> = {
  Live: { label: "Live", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500", bar: "#10b981" },
  "In Progress": { label: "In Progress", color: "text-orange-700 bg-orange-50 border-orange-200", dot: "bg-primary", bar: "#FF7A1A" },
  Discovery: { label: "Discovery", color: "text-blue-700 bg-blue-50 border-blue-200", dot: "bg-blue-500", bar: "#3b82f6" },
  Planned: { label: "Planned", color: "text-slate-600 bg-slate-100 border-slate-200", dot: "bg-slate-400", bar: "#94a3b8" },
}

export const PRIORITY_META: Record<Priority, string> = {
  Critical: "text-red-700 bg-red-50 border-red-200",
  High: "text-orange-700 bg-orange-50 border-orange-200",
  Medium: "text-amber-700 bg-amber-50 border-amber-200",
  Low: "text-slate-600 bg-slate-100 border-slate-200",
}

export const REGION_META: Record<Region, { label: string; impact: string; color: string }> = {
  EMIA: { label: "EMIA", impact: "Operational Scale", color: "#FF7A1A" },
  AMER: { label: "AMER", impact: "Revenue Growth", color: "#FF7A1A" },
  GLOBAL: { label: "GLOBAL", impact: "Enterprise-wide", color: "#FF7A1A" },
  APAC: { label: "APAC", impact: "High Growth", color: "#FF7A1A" },
}

const OWNERS = [
  "Elena Rossi", "Marcus Chen", "Priya Nair", "James Okafor", "Sofia Almeida",
  "David Kim", "Amara Singh", "Lukas Müller", "Chen Wei", "Olivia Brooks",
  "Rahul Mehta", "Hannah Schmidt", "Diego Fernández", "Yuki Tanaka", "Grace Lee",
  "Tomás Silva", "Nadia Petrova", "Samuel Adeyemi", "Clara Fontaine", "Viktor Novak",
]

const DESCRIPTIONS: Record<Category, string> = {
  AI: "Deploys frontier AI models to augment decision-making, generate insight, and accelerate knowledge work across the enterprise value chain.",
  Automation: "Removes manual touchpoints through intelligent process automation, eliminating handoffs and reducing operational cycle time.",
  Analytics: "Delivers governed, real-time analytics and predictive intelligence to transform data into executive-grade decisions.",
  "Digital Transformation": "Modernizes core platforms and operating models to enable a connected, autonomous and resilient enterprise.",
}

const NAMED: Partial<Project>[] = [
  { id: "TE-001", name: "Polaris", category: "AI", region: "GLOBAL", status: "Live", priority: "Critical", owner: "Elena Rossi" },
  { id: "TE-002", name: "Block 55 (PPQ) & Block 57 (MOQ)", category: "Automation", region: "EMIA", status: "In Progress", priority: "High", owner: "Lukas Müller" },
  { id: "TE-003", name: "AI Enabled Vision Inspection System", category: "AI", region: "AMER", status: "In Progress", priority: "Critical", owner: "Marcus Chen" },
  { id: "TE-004", name: "Order Entry Manual", category: "Automation", region: "AMER", status: "Discovery", priority: "Medium", owner: "Olivia Brooks" },
  { id: "TE-005", name: "Critical File", category: "Digital Transformation", region: "GLOBAL", status: "Live", priority: "High", owner: "Priya Nair" },
  { id: "TE-006", name: "MTS & MTO", category: "Analytics", region: "EMIA", status: "Planned", priority: "Medium", owner: "Diego Fernández" },
  // APAC seeded projects
  { id: "TE-045", name: "APAC Digital Hub", category: "Digital Transformation", region: "APAC", status: "In Progress", priority: "High", owner: "Yuki Tanaka" },
  { id: "TE-046", name: "APAC AI Forecast Engine", category: "AI", region: "APAC", status: "Discovery", priority: "Critical", owner: "Chen Wei" },
  { id: "TE-047", name: "APAC Supply Automation", category: "Automation", region: "APAC", status: "Planned", priority: "Medium", owner: "Grace Lee" },
  { id: "TE-048", name: "APAC Analytics Platform", category: "Analytics", region: "APAC", status: "In Progress", priority: "High", owner: "Rahul Mehta" },
  { id: "TE-049", name: "APAC Customer Intelligence", category: "AI", region: "APAC", status: "Discovery", priority: "High", owner: "Priya Nair" },
  { id: "TE-050", name: "APAC Procurement Bot", category: "Automation", region: "APAC", status: "Planned", priority: "Low", owner: "Amara Singh" },
  { id: "TE-051", name: "APAC Compliance Monitor", category: "Analytics", region: "APAC", status: "Live", priority: "Critical", owner: "David Kim" },
  { id: "TE-052", name: "APAC Logistics Optimizer", category: "Automation", region: "APAC", status: "In Progress", priority: "High", owner: "Marcus Chen" },
  { id: "TE-053", name: "APAC Knowledge Graph", category: "AI", region: "APAC", status: "Discovery", priority: "Medium", owner: "Sofia Almeida" },
  { id: "TE-054", name: "APAC ESG Dashboard", category: "Digital Transformation", region: "APAC", status: "Planned", priority: "Medium", owner: "Elena Rossi" },
]

const NAME_POOL = [
  "Intelligent Document Intake", "Predictive Demand Engine", "Smart Quote Generator", "Autonomous Invoice Match",
  "Supply Chain Control Tower", "Customer 360 Insights", "AI Service Co-Pilot", "Procurement Optimizer",
  "Quality Anomaly Detection", "Workforce Planning AI", "Contract Intelligence", "Revenue Assurance Bot",
  "Digital Twin Operations", "Knowledge Mining Hub", "Cash Flow Forecaster", "Fraud Signal Engine",
  "Self-Service Analytics", "Warehouse Robotics Orchestration", "Pricing Intelligence", "ESG Reporting Automation",
  "Customer Churn Predictor", "Field Service Optimizer", "Onboarding Automation", "Sales Forecast AI",
  "Logistics Routing Engine", "Compliance Monitor", "HR Helpdesk Agent", "Inventory Optimization",
  "Marketing Mix Modeling", "Production Scheduling AI", "Returns Automation", "Vendor Risk Scoring",
  "Energy Usage Optimizer", "Claims Triage AI", "Spend Analytics Platform", "Maintenance Predictor",
  "Document Translation Hub", "Lead Scoring Engine",
]

function seeded(i: number) {
  const x = Math.sin(i * 99.13) * 10000
  return x - Math.floor(x)
}

function buildProject(i: number): Project {
  const named = NAMED[i]
  const categories: Category[] = ["AI", "Automation", "Analytics", "Digital Transformation"]
  const regions: Region[] = ["EMIA", "AMER", "GLOBAL", "APAC"]
  const statuses: Status[] = ["Live", "In Progress", "Discovery", "Planned"]
  const priorities: Priority[] = ["Critical", "High", "Medium", "Low"]

  const category = named?.category ?? categories[Math.floor(seeded(i + 2) * 4)]
  const region = named?.region ?? regions[Math.floor(seeded(i + 3) * 3)] // keep first 3 for non-named
  const status = named?.status ?? statuses[Math.floor(seeded(i + 4) * 4)]
  const priority = named?.priority ?? priorities[Math.floor(seeded(i + 5) * 4)]
  const owner = named?.owner ?? OWNERS[Math.floor(seeded(i + 6) * OWNERS.length)]
  const id = named?.id ?? `TE-${String(i + 1).padStart(3, "0")}`
  const name = named?.name ?? NAME_POOL[(i - 6 + NAME_POOL.length) % NAME_POOL.length]

  const progress =
    status === "Live" ? 100 :
    status === "In Progress" ? 35 + Math.floor(seeded(i + 7) * 55) :
    status === "Discovery" ? 5 + Math.floor(seeded(i + 8) * 25) :
    Math.floor(seeded(i + 9) * 8)

  const weeklyHours = 20 + Math.floor(seeded(i + 10) * 120)
  const annualValue = 18000 + Math.floor(seeded(i + 11) * 130000)
  const fteSavings = Math.round((weeklyHours / 40) * 10) / 10

  const startYear = 2025 + Math.floor(seeded(i + 12) * 3)
  const startMonth = 1 + Math.floor(seeded(i + 13) * 11)
  const durationMonths = 4 + Math.floor(seeded(i + 14) * 24)
  const start = new Date(startYear, startMonth - 1, 1)
  const end = new Date(startYear, startMonth - 1 + durationMonths, 1)

  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  const milestones: Milestone[] = [
    { label: "Discovery & Scoping", date: fmt(start), done: progress > 10 },
    { label: "Solution Design", date: fmt(new Date(startYear, startMonth, 1)), done: progress > 30 },
    { label: "Build & Integration", date: fmt(new Date(startYear, startMonth + Math.floor(durationMonths / 2), 1)), done: progress > 60 },
    { label: "Pilot Rollout", date: fmt(new Date(startYear, startMonth + durationMonths - 2, 1)), done: progress > 85 },
    { label: "Scale & Hypercare", date: fmt(end), done: progress >= 100 },
  ]

  const deps: string[] = i > 6 && seeded(i + 15) > 0.5 ? [`TE-${String(1 + Math.floor(seeded(i + 16) * 6)).padStart(3, "0")}`] : []

  return {
    id, name, owner, region, category, status, priority, progress,
    startDate: fmt(start), endDate: fmt(end),
    annualValue, weeklyHours, fteSavings,
    description: DESCRIPTIONS[category],
    milestones, dependencies: deps,
  }
}

export const PROJECTS: Project[] = Array.from({ length: 54 }, (_, i) => buildProject(i))

export const CATEGORIES: Category[] = ["AI", "Automation", "Analytics", "Digital Transformation"]
export const REGIONS: Region[] = ["EMIA", "AMER", "GLOBAL", "APAC"]
export const STATUSES: Status[] = ["Live", "In Progress", "Discovery", "Planned"]
export const PRIORITIES: Priority[] = ["Critical", "High", "Medium", "Low"]

export const PORTFOLIO = {
  activeProjects: 54,
  weeklyHoursSaved: 2960,
  fteSavings: 74,
  estimatedValue: 2_350_000,
  health: 94,
  growth: 18,
  valuePerYear: 2_300_000,
  activePrograms: 54,
  upcomingMilestones: 12,
}

export function categoryStats(cat: Category) {
  const list = PROJECTS.filter((p) => p.category === cat)
  return {
    count: list.length,
    value: list.reduce((s, p) => s + p.annualValue, 0),
    hours: list.reduce((s, p) => s + p.weeklyHours, 0),
    growth: 8 + Math.round(seeded(cat.length) * 22),
  }
}

export function regionStats(region: Region) {
  const list = PROJECTS.filter((p) => p.region === region)
  return {
    count: list.length,
    value: list.reduce((s, p) => s + p.annualValue, 0),
    hours: list.reduce((s, p) => s + p.weeklyHours, 0),
  }
}

export function fmtCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export function fmtNumber(n: number) {
  return n.toLocaleString("en-US")
}