import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface PunctualityAnalysisProps {
  statusData: { name: string; value: number }[]
  totalFlights: number
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']

export const PunctualityAnalysis: React.FC<PunctualityAnalysisProps> = ({ statusData, totalFlights }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Punctuality Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm font-medium">On-Time Performance</p>
            <p className="text-2xl font-bold">
              {totalFlights > 0
                ? ((statusData.find(item => item.name === 'OnTime')?.value || 0) / totalFlights * 100).toFixed(1)
                : '0.0'}%
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Delayed Flights</p>
            <p className="text-2xl font-bold">
              {totalFlights > 0
                ? ((statusData.find(item => item.name === 'Delayed')?.value || 0) / totalFlights * 100).toFixed(1)
                : '0.0'}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

