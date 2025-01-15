'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { RouteAnalysis } from './routeAnalysis'
import { PricingTrends } from './pricingTrends'
import { AircraftTypeAnalysis } from './aircraftTypeAnalysis'
import { PunctualityAnalysis } from './punctualityAnalysis'
import CarouselMetric from './carouselMetric'
import { fetchFlightAnalytics } from '../action/flightActions'
import { getRouteData, getPriceData, getAircraftData, getStatusData } from '../utils/dataProcessing'

export interface Analytics {
  totalFlights: number;
  competitors: number;
  countries: number;
  routes: Record<string, number>;
  priceByAirline: Record<string, number>;
  status: Record<string, number>;
  aircraftTypes: Record<string, number>;
}

export default function KeyMetric() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchFlightAnalytics()
        setAnalytics(data)
      } catch (err) {
        setError('Failed to fetch flight data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!analytics) return <div>No data available</div>

  const routeData = getRouteData(analytics)
  const priceData = getPriceData(analytics)
  const aircraftData = getAircraftData(analytics)
  const statusData = getStatusData(analytics)

  // Placeholder for AI-generated insights
  const aiInsights = "AI-generated insights will be displayed here."

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3 mt-4 text-4xl font-bold ml-4 mb-4">
        <h2>Airline Dashboard</h2>
      </div>
      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-6">AI Insights</h2>
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

