'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { RouteAnalysis } from './routeAnalysis'
import { PricingTrends } from './pricingTrends'
import { AircraftTypeAnalysis } from './aircraftTypeAnalysis'
import { PunctualityAnalysis } from './punctualityAnalysis'
import CarouselMetric from './carouselMetric'
import { processFlightData, getRouteData, getPriceData, getAircraftData, getStatusData } from '../utils/dataProcessing'

export default function KeyMetric() {
  // This will be replaced with Redux state management
  const analytics = processFlightData()

  const routeData = getRouteData(analytics)
  const priceData = getPriceData(analytics)
  const aircraftData = getAircraftData(analytics)
  const statusData = getStatusData(analytics)

  // Placeholder for AI-generated insights
  const aiInsights = "AI-generated insights will be displayed here."

  return (
    <div>
      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-bold mb-2">AI Insights</h2>
          <p>{aiInsights}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <RouteAnalysis routeData={routeData} />
        <PricingTrends priceData={priceData} />
        <CarouselMetric />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <AircraftTypeAnalysis aircraftData={aircraftData} totalFlights={analytics.totalFlights} />
        <PunctualityAnalysis statusData={statusData} totalFlights={analytics.totalFlights} />
      </div>
    </div>
  )
}

