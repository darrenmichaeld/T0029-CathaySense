'use server'

const pool = require('../db/db')

export interface Analytics {
    totalFlights: number;
    competitors: number;
    countries: number;
    routes: Record<string, number>;
    priceByAirline: Record<string, number>;
    status: Record<string, number>;
    aircraftTypes: Record<string, number>;
}


export async function fetchFlightAnalytics(): Promise<Analytics> {
    try {
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const [
                totalFlightsResult,
                competitorsResult,
                countriesResult,
                routesResult,
                priceByAirlineResult,
                statusResult,
                aircraftTypesResult
            ] = await Promise.all([
                client.query('SELECT COUNT(*) as count FROM flights'),
                client.query('SELECT COUNT(DISTINCT brand) as count FROM flights'),
                client.query(`
          SELECT COUNT(DISTINCT country) as count 
          FROM (
            SELECT departure_origin as country FROM flights
            UNION
            SELECT arrival_place as country FROM flights
          ) as countries
        `),
                client.query(`
          SELECT departure_origin || ' - ' || arrival_place as route, COUNT(*) as count
          FROM flights
          GROUP BY route
          ORDER BY count DESC
          LIMIT 10
        `),
                client.query(`
          SELECT brand, AVG(price_per_kg) as avg_price
          FROM flights
          GROUP BY brand
        `),
                client.query(`
          SELECT status, COUNT(*) as count
          FROM flights
          GROUP BY status
        `),
                client.query(`
          SELECT aircraft_type, COUNT(*) as count
          FROM flights
          GROUP BY aircraft_type
        `)
            ])

            await client.query('COMMIT')

            const analytics: Analytics = {
                totalFlights: parseInt(totalFlightsResult.rows[0].count),
                competitors: parseInt(competitorsResult.rows[0].count),
                countries: parseInt(countriesResult.rows[0].count),
                routes: Object.fromEntries(
                    routesResult.rows.map((row: { route: any; count: string; }) => [row.route, parseInt(row.count)])
                ),
                priceByAirline: Object.fromEntries(
                    priceByAirlineResult.rows.map((row: { brand: any; avg_price: string; }) => [row.brand, parseFloat(row.avg_price)])
                ),
                status: Object.fromEntries(
                    statusResult.rows.map((row: { status: any; count: string; }) => [row.status, parseInt(row.count)])
                ),
                aircraftTypes: Object.fromEntries(
                    aircraftTypesResult.rows.map((row: { aircraft_type: any; count: string; }) => [row.aircraft_type, parseInt(row.count)])
                )
            }

            return analytics
        } catch (error) {
            // Avoiding Partial Fetch
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    } catch (error) {
        console.error('Error fetching flight analytics:', error)
        throw new Error('Failed to fetch flight analytics')
    }
}

