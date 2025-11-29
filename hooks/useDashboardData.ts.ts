// hooks/useDashboardData.ts
import { useState, useEffect } from "react"
import { KPIMetric, Signal, ActivityItem, PatentData, FundingData, TRLData } from "@/types/dashboard"

// Mock data fallback (in case API fails or you're in demo mode)
const mockData = {
  kpis: [
    { label: "Active Technologies", value: 127, change: 12, changeLabel: "+12% from last month", icon: "Radar", trend: "up" },
    { label: "High-Impact Signals", value: 42, change: 8, changeLabel: "+8% this week", icon: "Sparkles", trend: "up" },
    { label: "Patent Filings", value: 892, change: -3, changeLabel: "-3% vs last quarter", icon: "FileText", trend: "down" },
    { label: "Funding Raised", value: "$2.4B", change: 28, changeLabel: "+28% YoY", icon: "DollarSign", trend: "up" },
    { label: "Breakthrough Alerts", value: 19, change: 35, changeLabel: "+35% this month", icon: "Zap", trend: "up" },
  ] as KPIMetric[],
  signals: [
    { id: "1", type: "patent", title: "Quantum Error Correction Breakthrough", tech: "Quantum Computing", importance: "high", date: "2h ago" },
    { id: "2", type: "funding", title: "Anthropic raises $4B at $40B valuation", tech: "AI Safety", importance: "high", date: "5h ago", value: "$4B" },
    { id: "3", type: "breakthrough", title: "Room-temperature superconductor validated", tech: "Materials Science", importance: "high", date: "1d ago" },
    { id: "4", type: "publication", title: "AlphaFold 3 released", tech: "Protein Folding", importance: "medium", date: "2d ago" },
  ] as Signal[],
  activities: [
    { id: "1", type: "patent", description: "New solid-state battery patent filed", tech: "Energy Storage", timestamp: "3h ago" },
    { id: "2", type: "funding", description: "xAI raises $6B Series B", tech: "AI Infrastructure", timestamp: "6h ago" },
  ] as ActivityItem[],
  patentData: [
    { date: "Jan", filings: 120, citations: 890 },
    { date: "Feb", filings: 140, citations: 920 },
    { date: "Mar", filings: 160, citations: 980 },
  ] as PatentData[],
  fundingData: [
    { month: "Jan", amount: 180 },
    { month: "Feb", amount: 220 },
    { month: "Mar", amount: 280 },
  ] as FundingData[],
  trlDistribution: [
    { name: "TRL 1-3", value: 38, color: "#94a3b8" },
    { name: "TRL 4-6", value: 45, color: "#60a5fa" },
    { name: "TRL 7-9", value: 17, color: "#34d399" },
  ] as TRLData[],
}

export function useDashboardData() {
  const [kpis, setKpis] = useState<KPIMetric[]>([])
  const [signals, setSignals] = useState<Signal[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [patentData, setPatentData] = useState<PatentData[]>([])
  const [fundingData, setFundingData] = useState<FundingData[]>([])
  const [trlDistribution, setTrlDistribution] = useState<TRLData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/dashboard")
      if (!res.ok) throw new Error("Failed to fetch dashboard data")
      const data = await res.json()

      setKpis(data.kpis || mockData.kpis)
      setSignals(data.signals || mockData.signals)
      setActivities(data.activities || mockData.activities)
      setPatentData(data.patentData || mockData.patentData)
      setFundingData(data.fundingData || mockData.fundingData)
      setTrlDistribution(data.trlDistribution || mockData.trlDistribution)
    } catch (err) {
      console.error(err)
      setError("Could not load data. Using demo mode.")
      // Fall back to mock data
      setKpis(mockData.kpis)
      setSignals(mockData.signals)
      setActivities(mockData.activities)
      setPatentData(mockData.patentData)
      setFundingData(mockData.fundingData)
      setTrlDistribution(mockData.trlDistribution)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    kpis,
    signals,
    activities,
    patentData,
    fundingData,
    trlDistribution,
    isLoading,
    error,
    refetch: fetchData,
  }
}