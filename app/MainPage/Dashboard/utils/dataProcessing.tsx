export interface Analytics {
  totalFlights: number;
  competitors: number;
  countries: number;
  routes: Record<string, number>;
  priceByAirline: Record<string, number>;
  status: Record<string, number>;
  aircraftTypes: Record<string, number>;
}



export function getRouteData(analytics: Analytics) {
  return Object.entries(analytics.routes)
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPriceData(analytics: Analytics) {
  return Object.entries(analytics.priceByAirline)
    .map(([airline, price]) => ({ airline, price }))
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

