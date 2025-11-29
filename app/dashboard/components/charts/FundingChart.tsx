// components/dashboard/charts/FundingChart.tsx
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { FundingData } from "@/types/dashboard"

interface FundingChartProps {
  timeRange: string
  data: FundingData[]
}

export default function FundingChart({ timeRange, data }: FundingChartProps) {
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
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}