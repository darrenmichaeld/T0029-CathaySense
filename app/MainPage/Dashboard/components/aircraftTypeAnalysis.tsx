'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface AircraftTypeAnalysisProps {
  aircraftData: { name: string; value: number }[]
  totalFlights: number
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']

export const AircraftTypeAnalysis: React.FC<AircraftTypeAnalysisProps> = ({ aircraftData, totalFlights }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aircraft Type Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={aircraftData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {aircraftData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-center">Aircraft Distribution</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {aircraftData.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm">
                  {item.name}: {totalFlights > 0 ? ((item.value / totalFlights) * 100).toFixed(1) : '0.0'}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
