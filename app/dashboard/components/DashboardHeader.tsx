// app/dashboard/components/DashboardHeader.tsx
import { RefreshCw, Plus, BarChart3, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  isRefreshing: boolean
  onRefresh: () => void
}

export default function DashboardHeader({ isRefreshing, onRefresh }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Strategic technology intelligence overview
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Watch
        </Button>
        <Button size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Run Forecast
        </Button>
        <Button size="sm" variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>
    </div>
  )
}