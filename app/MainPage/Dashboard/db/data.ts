const pool = require('./db')
import { QueryResult } from 'pg';

export interface Analytics {
  totalFlights: number;
  competitors: number;
  countries: number;
  routes: Record<string, number>;
  priceByAirline: Record<string, number[]>;
  status: Record<string, number>;
  aircraftTypes: Record<string, number>;
}

export async function processFlightData(): Promise<Analytics> {
  const totalFlightsResult: QueryResult = await pool.query('SELECT COUNT(*) as count FROM flights');
  const totalFlights = parseInt(totalFlightsResult.rows[0].count);

  const competitorsResult: QueryResult = await pool.query('SELECT COUNT(DISTINCT brand) as count FROM flights');
  const competitors = parseInt(competitorsResult.rows[0].count);

  const countriesResult: QueryResult = await pool.query(`
    SELECT COUNT(DISTINCT country) as count 
    FROM (
      SELECT departure_origin as country FROM flights
      UNION
      SELECT arrival_place as country FROM flights
    ) as countries
  `);
  const countries = parseInt(countriesResult.rows[0].count);

  const routesResult: QueryResult = await pool.query(`
    SELECT departure_origin || ' - ' || arrival_place as route, COUNT(*) as count
    FROM flights
    GROUP BY route
  `);
  const routes: Record<string, number> = Object.fromEntries(
    routesResult.rows.map(row => [row.route, parseInt(row.count)])
  );

  const priceByAirlineResult: QueryResult = await pool.query(`
    SELECT brand, ARRAY_AGG(price_per_kg) as prices
    FROM flights
    GROUP BY brand
  `);
  const priceByAirline: Record<string, number[]> = Object.fromEntries(
    priceByAirlineResult.rows.map(row => [row.brand, row.prices])
  );

  const statusResult: QueryResult = await pool.query(`
    SELECT status, COUNT(*) as count
    FROM flights
    GROUP BY status
  `);
  const status: Record<string, number> = Object.fromEntries(
    statusResult.rows.map(row => [row.status, parseInt(row.count)])
  );

  const aircraftTypesResult: QueryResult = await pool.query(`
    SELECT aircraft_type, COUNT(*) as count
    FROM flights
    GROUP BY aircraft_type
  `);
  const aircraftTypes: Record<string, number> = Object.fromEntries(
    aircraftTypesResult.rows.map(row => [row.aircraft_type, parseInt(row.count)])
  );

  return { totalFlights, competitors, countries, routes, priceByAirline, status, aircraftTypes };
}

export async function getRouteData(analytics: Analytics) {
  return Object.entries(analytics.routes)
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export async function getPriceData(analytics: Analytics) {
  return Object.entries(analytics.priceByAirline)
    .map(([airline, prices]) => ({
      airline,
      price: prices.reduce((sum, price) => sum + price, 0) / prices.length
    }))
    .sort((a, b) => b.price - a.price);
}

export async function getAircraftData(analytics: Analytics) {
  return Object.entries(analytics.aircraftTypes)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getStatusData(analytics: Analytics) {
  return Object.entries(analytics.status)
    .map(([name, value]) => ({ name, value }));
}

