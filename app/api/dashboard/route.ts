// app/api/dashboard/route.ts
import { NextResponse } from "next/server"

const mockData = {
  kpis: [
    { label: "Active Technologies", value: 127, change: 12, icon: "Radar", trend: "up" },
    { label: "High-Impact Signals", value: 42, change: 8, icon: "Sparkles", trend: "up" },
    { label: "Patent Filings", value: 892, change: -3, icon: "FileText", trend: "down" },
    { label: "Funding Raised", value: "$2.4B", change: 28, icon: "DollarSign", trend: "up" },
    { label: "Breakthrough Alerts", value: 19, change: 35, icon: "Zap", trend: "up" }
  ],
  trlDistribution: [
    { name: "TRL 1-3", value: 38, color: "#94a3b8" },
    { name: "TRL 4-6", value: 45, color: "#60a5fa" },
    { name: "TRL 7-9", value: 17, color: "#34d399" }
  ],
  patentData: [
    { date: "Jan", filings: 120, citations: 890 },
    { date: "Feb", filings: 140, citations: 920 },
    { date: "Mar", filings: 160, citations: 980 },
    { date: "Apr", filings: 180, citations: 1050 },
    { date: "May", filings: 200, citations: 1120 },
    { date: "Jun", filings: 220, citations: 1200 }
  ],
  fundingData: [
    { month: "Jan", amount: 180 },
    { month: "Feb", amount: 220 },
    { month: "Mar", amount: 280 },
    { month: "Apr", amount: 320 },
    { month: "May", amount: 380 },
    { month: "Jun", amount: 450 }
  ],
  activities: [
    { id: "1", type: "patent", description: "New solid-state battery patent", tech: "Energy", timestamp: "3h ago" },
    { id: "2", type: "funding", description: "xAI raises $6B", tech: "AI", timestamp: "6h ago" }
  ]
}

export async function GET() {
  await new Promise(r => setTimeout(r, 600)) // realistic loading
  return NextResponse.json(mockData)
}