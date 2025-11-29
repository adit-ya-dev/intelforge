// app/dashboard/page.tsx
"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import DashboardHeader from "./components/DashboardHeader"
import SearchBar from "./components/SearchBar"
import KPICards from "./components/KPICards"
import TopSignals from "./components/TopSignals"
import TimeRangeSelector from "./components/TimeRangeSelector"
import ChartsGrid from "./components/ChartsGrid"
import { useDashboardData } from "@/hooks/useDashboardData.ts"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeRange, setTimeRange] = useState("30d")
  const [widgets, setWidgets] = useState({
    patents: true,
    funding: true,
    trl: true,
    signals: true,
    activity: true
  })

  const { 
    kpis, 
    signals, 
    activities, 
    patentData, 
    fundingData, 
    trlDistribution,
    isLoading,
    error,
    refetch
  } = useDashboardData()

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <DashboardHeader 
          isRefreshing={false}
          onRefresh={refetch}
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              onClick={refetch} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <DashboardHeader 
          isRefreshing={true}
          onRefresh={refetch}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <DashboardHeader 
        isRefreshing={isLoading}
        onRefresh={refetch}
      />
      
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <KPICards kpis={kpis} />
      
      <TopSignals signals={signals} />
      
      <TimeRangeSelector 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
      
      <ChartsGrid 
        widgets={widgets}
        timeRange={timeRange}
        patentData={patentData}
        fundingData={fundingData}
        trlDistribution={trlDistribution}
        activities={activities}
      />
    </div>
  )
}