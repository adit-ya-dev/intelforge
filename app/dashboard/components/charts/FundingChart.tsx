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
<<<<<<< HEAD
import { FundingData } from "@/types/dashboard"

interface FundingChartProps {
  timeRange: string
  data: FundingData[]
}

export default function FundingChart({ timeRange, data }: FundingChartProps) {
=======
import { mockFundingData } from "@/lib/mock-data"

interface FundingChartProps {
  timeRange: string
}

export default function FundingChart({ timeRange }: FundingChartProps) {
>>>>>>> 8b2a45feec1668156599d6b21663eb2adcbff17b
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Funding & Investment Trends</CardTitle>
        <CardDescription>Venture capital and R&D investments (in millions)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
<<<<<<< HEAD
          <BarChart data={data}>
=======
          <BarChart data={mockFundingData}>
>>>>>>> 8b2a45feec1668156599d6b21663eb2adcbff17b
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 8b2a45feec1668156599d6b21663eb2adcbff17b
