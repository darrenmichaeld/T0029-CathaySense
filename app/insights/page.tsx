'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import SideNav from '../MainPage/Dashboard/components/sideNav'
import { flights } from '../MainPage/Dashboard/db/db'

interface Analytics {
  brand: string; 
  departure_origin: string;
  arrival_place: string;
  price_per_kg: number;
  status: string;
  aircraft_capacity: number;
}

type AnalysisResult = {
  dynamicPricingRecommendations: {
    route: string
    currentPrice: number
    recommendedPrice: number
    reason: string
  }[]
  stationManagerInsights: {
    station: string
    delayFrequency: number
    capacityUtilization: number
    recommendations: string[]
  }[]
  networkOptimization: {
    underutilizedRoutes: string[]
    overutilizedRoutes: string[]
    newRouteOpportunities: string[]
  }
}

function analyzeFlightData(data: Analytics[] | undefined): AnalysisResult | null {
  if (!data || data.length === 0) {
    return null;
  }
  const cathayFlights = data.filter(flight => flight.brand === 'Cathay')
  const competitorFlights = data.filter(flight => flight.brand !== 'Cathay')

  // Dynamic Pricing Recommendations
  const dynamicPricingRecommendations = cathayFlights.map(flight => {
    const competitorOnSameRoute = competitorFlights.find(
      cf => cf.departure_origin === flight.departure_origin && cf.arrival_place === flight.arrival_place
    )
    const avgPrice = data.reduce((sum, f) => sum + f.price_per_kg, 0) / data.length
    let recommendedPrice = flight.price_per_kg
    let reason = ''

    if (competitorOnSameRoute) {
      if (flight.price_per_kg < competitorOnSameRoute.price_per_kg) {
        recommendedPrice = Math.min(competitorOnSameRoute.price_per_kg - 1, flight.price_per_kg * 1.1)
        reason = 'Competitor pricing higher, opportunity to increase'
      } else {
        recommendedPrice = Math.max(competitorOnSameRoute.price_per_kg + 1, flight.price_per_kg * 0.95)
        reason = 'Adjust to stay competitive'
      }
    } else if (flight.price_per_kg < avgPrice) {
      recommendedPrice = Math.min(avgPrice, flight.price_per_kg * 1.15)
      reason = 'Below average price, potential to increase'
    }

    return {
      route: `${flight.departure_origin} to ${flight.arrival_place}`,
      currentPrice: flight.price_per_kg,
      recommendedPrice: Number(recommendedPrice.toFixed(2)),
      reason
    }
  })

  // Station Manager Insights
  const stations = Array.from(new Set(data.map(flight => flight.departure_origin)))
  const stationManagerInsights = stations.map(station => {
    const stationFlights = data.filter(flight => flight.departure_origin === station)
    const delayedFlights = stationFlights.filter(flight => flight.status.toLowerCase() === 'delayed')
    const delayFrequency = delayedFlights.length / stationFlights.length
    const capacityUtilization = stationFlights.reduce((sum, flight) => sum + flight.aircraft_capacity, 0) / (stationFlights.length * 100000)

    const recommendations = []
    if (delayFrequency > 0.2) recommendations.push('Improve punctuality')
    if (capacityUtilization < 0.8) recommendations.push('Increase capacity utilization')
    if (capacityUtilization > 0.95) recommendations.push('Consider adding more flights')

    return {
      station,
      delayFrequency: Number((delayFrequency * 100).toFixed(2)),
      capacityUtilization: Number((capacityUtilization * 100).toFixed(2)),
      recommendations
    }
  })

  // Network Optimization
  const routes = data.map(flight => `${flight.departure_origin} to ${flight.arrival_place}`)
  const routeCounts = routes.reduce((acc, route) => {
    acc[route] = (acc[route] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const underutilizedRoutes = Object.entries(routeCounts)
    .filter(([_, count]) => count === 1)
    .map(([route]) => route)

  const overutilizedRoutes = Object.entries(routeCounts)
    .filter(([_, count]) => count > 2)
    .map(([route]) => route)

  const existingPairs = new Set(routes)
  const allStations = Array.from(new Set(data.flatMap(flight => [flight.departure_origin, flight.arrival_place])))
  const newRouteOpportunities = allStations.flatMap(origin => 
    allStations.filter(destination => 
      origin !== destination && !existingPairs.has(`${origin} to ${destination}`)
    ).map(destination => `${origin} to ${destination}`)
  ).slice(0, 3)  // Limit to top 3 opportunities

  return {
    dynamicPricingRecommendations,
    stationManagerInsights,
    networkOptimization: {
      underutilizedRoutes,
      overutilizedRoutes,
      newRouteOpportunities
    }
  }
}

export default function AdvancedFlightAnalysisDashboard() {
  const [activeTab, setActiveTab] = useState('dynamic-pricing')
  const analysis = useMemo(() => analyzeFlightData(flights as Analytics[] | undefined), [])

  if (!flights || flights.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">No flight data available.</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Error analyzing flight data.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
    <SideNav/>
    <div className="container mx-auto p-2 mt-12">
      <h1 className="text-3xl font-bold mb-6">Advanced Flight Data Analysis Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dynamic-pricing">Dynamic Pricing</TabsTrigger>
          <TabsTrigger value="station-insights">Station Insights</TabsTrigger>
          <TabsTrigger value="network-optimization">Network Optimization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dynamic-pricing">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Pricing Recommendations</CardTitle>
              <CardDescription>Pricing adjustments based on market conditions and competitor analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Recommended Price</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.dynamicPricingRecommendations.map((rec, index) => (
                      <TableRow key={index}>
                        <TableCell>{rec.route}</TableCell>
                        <TableCell>${rec.currentPrice}</TableCell>
                        <TableCell>${rec.recommendedPrice}</TableCell>
                        <TableCell>{rec.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="station-insights">
          <Card>
            <CardHeader>
              <CardTitle>Station Manager Insights</CardTitle>
              <CardDescription>Performance metrics and recommendations for each station</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station</TableHead>
                      <TableHead>Delay Frequency</TableHead>
                      <TableHead>Capacity Utilization</TableHead>
                      <TableHead>Recommendations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.stationManagerInsights.map((insight, index) => (
                      <TableRow key={index}>
                        <TableCell>{insight.station}</TableCell>
                        <TableCell>{insight.delayFrequency}%</TableCell>
                        <TableCell>{insight.capacityUtilization}%</TableCell>
                        <TableCell>
                          {insight.recommendations.map((rec, i) => (
                            <Badge key={i} variant="secondary" className="mr-1 mb-1">{rec}</Badge>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network-optimization">
          <Card>
            <CardHeader>
              <CardTitle>Network Optimization</CardTitle>
              <CardDescription>Insights for improving route efficiency and identifying new opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Underutilized Routes</h3>
                  <ul className="list-disc pl-5">
                    {analysis.networkOptimization.underutilizedRoutes.map((route, index) => (
                      <li key={index}>{route}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Overutilized Routes</h3>
                  <ul className="list-disc pl-5">
                    {analysis.networkOptimization.overutilizedRoutes.map((route, index) => (
                      <li key={index}>{route}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">New Route Opportunities</h3>
                  <ul className="list-disc pl-5">
                    {analysis.networkOptimization.newRouteOpportunities.map((route, index) => (
                      <li key={index}>{route}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
}

