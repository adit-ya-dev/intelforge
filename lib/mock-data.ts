// lib/mock-data.ts
import { 
  Activity, 
  FileText, 
  TrendingUp, 
  Bell, 
  Eye 
} from "lucide-react"
import { 
  KPIMetric, 
  Signal, 
  ActivityItem, 
  PatentData, 
  FundingData, 
  TRLData 
} from "@/types/dashboard"

export const mockKPIs: KPIMetric[] = [
  {
    label: "Technologies Tracked",
    value: 247,
    change: 12,
    changeLabel: "+12 this month",
    icon: Activity,
    trend: "up"
  },
  {
    label: "Patents (Last 30d)",
    value: "1,834",
    change: 8.3,
    changeLabel: "+8.3% vs prev",
    icon: FileText,
    trend: "up"
  },
  {
    label: "TRL ≥7 Technologies",
    value: 89,
    change: 5,
    changeLabel: "+5 ready",
    icon: TrendingUp,
    trend: "up"
  },
  {
    label: "Active Alerts",
    value: 23,
    change: -2,
    changeLabel: "-2 resolved",
    icon: Bell,
    trend: "down"
  },
  {
    label: "Watched Technologies",
    value: 45,
    change: 3,
    changeLabel: "+3 added",
    icon: Eye,
    trend: "up"
  }
]

export const mockPatentData: PatentData[] = [
  { date: "Week 1", filings: 145, citations: 89 },
  { date: "Week 2", filings: 178, citations: 112 },
  { date: "Week 3", filings: 190, citations: 134 },
  { date: "Week 4", filings: 223, citations: 156 },
]

export const mockFundingData: FundingData[] = [
  { month: "Sep", amount: 45 },
  { month: "Oct", amount: 67 },
  { month: "Nov", amount: 89 },
  { month: "Dec", amount: 134 },
]

export const mockTRLDistribution: TRLData[] = [
  { name: "TRL 1-3", value: 45, color: "#ef4444" },
  { name: "TRL 4-6", value: 113, color: "#f59e0b" },
  { name: "TRL 7-9", value: 89, color: "#10b981" },
]

export const mockSignals: Signal[] = [
  {
    id: "1",
    type: "patent",
    title: "Breakthrough quantum computing patent filed by IBM",
    tech: "Quantum Computing",
    importance: "high",
    date: "2 hours ago",
  },
  {
    id: "2",
    type: "funding",
    title: "Series C $200M raised by OpenAI competitor",
    tech: "AI/ML",
    importance: "high",
    date: "5 hours ago",
    value: "$200M"
  },
  {
    id: "3",
    type: "publication",
    title: "Nature paper: Novel graphene synthesis method",
    tech: "Advanced Materials",
    importance: "medium",
    date: "1 day ago",
  },
  {
    id: "4",
    type: "breakthrough",
    title: "Room-temperature superconductor claim",
    tech: "Superconductors",
    importance: "high",
    date: "2 days ago",
  },
]

export const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "Patent",
    description: "New patent filed in Quantum Computing - Error Correction",
    timestamp: "10 minutes ago",
    tech: "Quantum Computing"
  },
  {
    id: "2",
    type: "Funding",
    description: "Series B $50M funding round for Battery Tech startup",
    timestamp: "1 hour ago",
    tech: "Energy Storage"
  },
  {
    id: "3",
    type: "Publication",
    description: "High-impact paper published on CRISPR gene editing",
    timestamp: "3 hours ago",
    tech: "Biotechnology"
  },
  {
    id: "4",
    type: "Model",
    description: "S-curve forecast updated for Solid-State Batteries",
    timestamp: "5 hours ago",
    tech: "Energy Storage"
  },
]