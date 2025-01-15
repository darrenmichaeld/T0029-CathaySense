'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface RouteAnalysisProps {
  routeData: { route: string; count: number }[]
}

export const RouteAnalysis: React.FC<RouteAnalysisProps> = ({ routeData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routeData}>
              <XAxis dataKey="route" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

