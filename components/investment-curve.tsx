"use client"

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"

const DATA = [
  { stage: "Current State", "Manual Work": 90, Automation: 10, "Human Oversight": 85, Analytics: 20, "Agentic AI": 2 },
  { stage: "Automation", "Manual Work": 62, Automation: 45, "Human Oversight": 72, Analytics: 42, "Agentic AI": 10 },
  { stage: "AI Adoption", "Manual Work": 40, Automation: 65, "Human Oversight": 58, Analytics: 68, "Agentic AI": 30 },
  { stage: "Agentic AI", "Manual Work": 22, Automation: 78, "Human Oversight": 40, Analytics: 82, "Agentic AI": 62 },
  { stage: "Autonomous", "Manual Work": 8, Automation: 88, "Human Oversight": 24, Analytics: 95, "Agentic AI": 90 },
]

const SERIES = [
  { key: "Manual Work", color: "#94a3b8" },
  { key: "Automation", color: "#FF7A1A" },
  { key: "Human Oversight", color: "#f59e0b" },
  { key: "Analytics", color: "#3b82f6" },
  { key: "Agentic AI", color: "#10b981" },
]

export function InvestmentCurve() {
  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={DATA} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
          <defs>
            {SERIES.map((s) => (
              <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="stage" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 12, border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px -8px rgba(16,24,40,0.18)", fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
          {SERIES.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2.5}
              fill={`url(#g-${s.key})`}
              animationDuration={1400}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
