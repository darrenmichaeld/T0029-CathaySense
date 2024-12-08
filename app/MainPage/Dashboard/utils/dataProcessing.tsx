import { flights } from '../db/db'

export interface Analytics {
  totalFlights: number
  competitors: number
  countries: number
  routes: Record<string, number>
  priceByAirline: Record<string, number[]>
  status: Record<string, number>
  aircraftTypes: Record<string, number>
}

export function processFlightData(): Analytics {
  const totalFlights = flights.length
  const competitors = new Set(flights.map(f => f.brand)).size
  const countries = new Set([...flights.map(f => f.departure_origin), ...flights.map(f => f.arrival_place)]).size

  const routes: Record<string, number> = {}
  const priceByAirline: Record<string, number[]> = {}
  const status: Record<string, number> = {}
  const aircraftTypes: Record<string, number> = {}

  flights.forEach((flight) => {
    const route = `${flight.departure_origin} - ${flight.arrival_place}`
    routes[route] = (routes[route] || 0) + 1

    if (!priceByAirline[flight.brand]) {
      priceByAirline[flight.brand] = []
    }
    priceByAirline[flight.brand].push(flight.price_per_kg)

    status[flight.status] = (status[flight.status] || 0) + 1

    aircraftTypes[flight.aircraft_type] = (aircraftTypes[flight.aircraft_type] || 0) + 1
  })

  return { totalFlights, competitors, countries, routes, priceByAirline, status, aircraftTypes }
}

export function getRouteData(analytics: Analytics) {
  return Object.entries(analytics.routes)
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export function getPriceData(analytics: Analytics) {
  return Object.entries(analytics.priceByAirline)
    .map(([airline, prices]) => ({
      airline,
      price: prices.reduce((sum, price) => sum + price, 0) / prices.length
    }))
    .sort((a, b) => b.price - a.price)
}

export function getAircraftData(analytics: Analytics) {
  return Object.entries(analytics.aircraftTypes)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function getStatusData(analytics: Analytics) {
  return Object.entries(analytics.status)
    .map(([name, value]) => ({ name, value }))
}

