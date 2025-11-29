// types/dashboard.ts
import { LucideIcon } from "lucide-react"

export interface KPIMetric {
  label: string
  value: string | number
  change: number
  changeLabel: string
  icon: string  // Changed to string for DB compatibility
  trend: "up" | "down" | "neutral"
}

export interface Signal {
  id: string
  type: "patent" | "funding" | "publication" | "breakthrough"
  title: string
  tech: string
  importance: "high" | "medium" | "low"
  date: string
  value?: string
}

export interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
  tech: string
  link?: string
}

export interface PatentData {
  date: string
  filings: number
  citations: number
}

export interface FundingData {
  month: string
  amount: number
}

export interface TRLData {
  name: string
  value: number
  color: string

  [key: string]: string | number | undefined
}
export type TRLChartData = Record<string, any> & {
  name: string
  value: number
  color?: string
}