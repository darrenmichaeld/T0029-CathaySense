import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface PricingTrendsProps {
  priceData: { airline: string; price: number }[]
}

export const PricingTrends: React.FC<PricingTrendsProps> = ({ priceData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={priceData}
              layout="vertical"
              margin={{
                left: 40,
                right: 20,
                top: 30,
                bottom: 10,
              }}
            >
              <XAxis type="number" />
              <YAxis
                dataKey="airline"
                type="category"
                scale="band"
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip />
              <Bar 
                dataKey="price" 
                fill="hsl(var(--chart-4))"
                radius={[4, 4, 4, 4]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

