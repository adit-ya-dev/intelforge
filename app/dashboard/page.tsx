// app/dashboard/page.tsx
"use client"

import { useState } from "react"
import DashboardHeader from "./components/DashboardHeader"
import SearchBar from "./components/SearchBar"
import KPICards from "./components/KPICards"
import TopSignals from "./components/TopSignals"
import TimeRangeSelector from "./components/TimeRangeSelector"
import ChartsGrid from "./components/ChartsGrid"
import { mockKPIs, mockSignals } from "@/lib/mock-data"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeRange, setTimeRange] = useState("30d")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [widgets, setWidgets] = useState({
    patents: true,
    funding: true,
    trl: true,
    signals: true,
    activity: true
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <DashboardHeader 
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
      
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <KPICards kpis={mockKPIs} />
      
      <TopSignals signals={mockSignals} />
      
      <TimeRangeSelector 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
      
      <ChartsGrid 
        widgets={widgets}
        timeRange={timeRange}
      />
    </div>
  )
}