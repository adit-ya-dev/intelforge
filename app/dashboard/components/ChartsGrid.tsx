// app/dashboard/components/ChartsGrid.tsx
"use client"

import { Maximize2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ActivityItem, FundingData, PatentData, TRLData } from "@/types/dashboard"

// YEHI LINE CHANGE KI HAI — ab 100% sahi path hai
import TRLDistributionChart from "./charts/TRLDistributionChart"

interface ChartsGridProps {
  widgets: {
    patents: boolean
    funding: boolean
    trl: boolean
    signals: boolean
    activity: boolean
  }
  timeRange: string
  patentData: PatentData[]
  fundingData: FundingData[]
  trlDistribution: TRLData[]
  activities: ActivityItem[]
}

function PatentChart({ timeRange, data }: { timeRange: string; data: PatentData[] }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Patent Filings & Citations</CardTitle>
          <Button variant="ghost" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Weekly trends over the last {timeRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorFilings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Legend />
            <Area type="monotone" dataKey="filings" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFilings)" name="Patent Filings" />
            <Area type="monotone" dataKey="citations" stroke="#10b981" fillOpacity={1} fill="url(#colorCitations)" name="Citations" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function FundingChart({ timeRange, data }: { timeRange: string; data: FundingData[] }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Funding & Investment Trends</CardTitle>
        <CardDescription>Venture capital and R&D investments (in millions)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8,0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function ActivityFeed({ data }: { data: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <CardDescription>Latest technology events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((activity) => (
            <div key={activity.id} className="flex gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                  <span>{activity.tech}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ChartsGrid({
  widgets,
  timeRange,
  patentData,
  fundingData,
  trlDistribution,
  activities
}: ChartsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {widgets.patents && <PatentChart timeRange={timeRange} data={patentData} />}
      {widgets.trl && <TRLDistributionChart data={trlDistribution} />}   {/* Capital T */}
      {widgets.funding && <FundingChart timeRange={timeRange} data={fundingData} />}
      {widgets.activity && <ActivityFeed data={activities} />}
    </div>
  )
}