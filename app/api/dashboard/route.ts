// app/api/dashboard/route.ts
import { NextResponse } from "next/server"

const mockData = {
  kpis: [
    { label: "Active Technologies", value: 127, change: 12, changeLabel: "+12% from last month", icon: "Radar", trend: "up" },
    { label: "High-Impact Signals", value: 42, change: 8, changeLabel: "+8% this week", icon: "Sparkles", trend: "up" },
    { label: "Patent Filings", value: 892, change: -3, changeLabel: "-3% vs last quarter", icon: "FileText", trend: "down" },
    { label: "Funding Raised", value: "$2.4B", change: 28, changeLabel: "+28% YoY", icon: "DollarSign", trend: "up" },
    { label: "Breakthrough Alerts", value: 19, change: 35, changeLabel: "+35% this month", icon: "Zap", trend: "up" },
  ],

  // Signals (friend ka code)
  signals: [
    { id: "1", type: "patent", title: "Quantum Error Correction Breakthrough", tech: "Quantum Computing", importance: "high", date: "2h ago" },
    { id: "2", type: "funding", title: "Anthropic raises $4B at $40B valuation", tech: "AI Safety", importance: "high", date: "5h ago", value: "$4B" },
    { id: "3", type: "breakthrough", title: "Room-temperature superconductor validated", tech: "Materials Science", importance: "high", date: "1d ago" },
    { id: "4", type: "publication", title: "AlphaFold 3 released", tech: "Protein Folding", importance: "medium", date: "2d ago" },
  ],

  // Activities (merge dono ka)
  activities: [
    { id: "1", type: "patent", description: "New solid-state battery patent filed", tech: "Energy Storage", timestamp: "3h ago" },
    { id: "2", type: "funding", description: "xAI raises $6B Series B", tech: "AI Infrastructure", timestamp: "6h ago" },
    { id: "3", type: "breakthrough", description: "Photonic chip achieves 1000x efficiency", tech: "Photonics", timestamp: "12h ago" },
    { id: "4", type: "patent", description: "New solid-state battery patent", tech: "Energy", timestamp: "3h ago" },
    { id: "5", type: "funding", description: "xAI raises $6B", tech: "AI", timestamp: "6h ago" },
  ],

  patentData: [
    { date: "Jan", filings: 120, citations: 890 },
    { date: "Feb", filings: 140, citations: 920 },
    { date: "Mar", filings: 160, citations: 980 },
    { date: "Apr", filings: 180, citations: 1050 },
    { date: "May", filings: 200, citations: 1120 },
    { date: "Jun", filings: 220, citations: 1200 },
  ],

  fundingData: [
    { month: "Jan", amount: 180 },
    { month: "Feb", amount: 220 },
    { month: "Mar", amount: 280 },
    { month: "Apr", amount: 320 },
    { month: "May", amount: 380 },
    { month: "Jun", amount: 450 },
  ],

  trlDistribution: [
    { name: "TRL 1-3", value: 38, color: "#94a3b8" },
    { name: "TRL 4-6", value: 45, color: "#60a5fa" },
    { name: "TRL 7-9", value: 17, color: "#34d399" },
  ],
}

export async function GET() {
  // realistic delay
  await new Promise(resolve => setTimeout(resolve, 800))
  return NextResponse.json(mockData)
}