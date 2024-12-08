import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/price-alert';
// Sample flight data (Replace with actual database or persistent data)
const flights = [
  {
    "flight_number": "CX126",
    "brand": "Cathay",
    "estimated_departure": "2023-10-10T09:00:00Z",
    "estimated_arrival": "2023-10-10T13:00:00Z",
    "actual_departure": "2023-10-10T09:05:00Z",
    "actual_arrival": "2023-10-10T13:05:00Z",
    "aircraft_type": "Airbus A330",
    "aircraft_capacity": 80000,
    "status": "OnTime",
    "price_per_kg": 2.5,
    "departure_origin": "Hong Kong",
    "arrival_place": "Los Angeles"
  },
  {
    "flight_number": "CX127",
    "brand": "Cathay",
    "estimated_departure": "2023-10-11T11:00:00Z",
    "estimated_arrival": "2023-10-11T15:00:00Z",
    "actual_departure": "2023-10-11T11:20:00Z",
    "actual_arrival": "2023-10-11T15:25:00Z",
    "aircraft_type": "Boeing 777",
    "aircraft_capacity": 90000,
    "status": "Delayed",
    "price_per_kg": 2.5,
    "departure_origin": "Hong Kong",
    "arrival_place": "Chicago"
  },
  {
    "flight_number": "CX128",
    "brand": "Cathay",
    "estimated_departure": "2023-10-12T12:00:00Z",
    "estimated_arrival": "2023-10-12T16:00:00Z",
    "actual_departure": "2023-10-12T12:00:00Z",
    "actual_arrival": "2023-10-12T16:00:00Z",
    "aircraft_type": "Boeing 747",
    "aircraft_capacity": 100000,
    "status": "OnTime",
    "price_per_kg": 2.5,
    "departure_origin": "Hong Kong",
    "arrival_place": "New York"
  },
  {
    "flight_number": "SQ459",
    "brand": "Singapore Airlines",
    "estimated_departure": "2023-10-13T14:00:00Z",
    "estimated_arrival": "2023-10-13T18:00:00Z",
    "actual_departure": "2023-10-13T14:15:00Z",
    "actual_arrival": "2023-10-13T18:10:00Z",
    "aircraft_type": "Airbus A350",
    "aircraft_capacity": 90000,
    "status": "OnTime",
    "price_per_kg": 3.0,
    "departure_origin": "Singapore",
    "arrival_place": "San Francisco"
  },
  {
    "flight_number": "SQ460",
    "brand": "Singapore Airlines",
    "estimated_departure": "2023-10-14T16:00:00Z",
    "estimated_arrival": "2023-10-14T20:00:00Z",
    "actual_departure": "2023-10-14T16:05:00Z",
    "actual_arrival": "2023-10-14T20:05:00Z",
    "aircraft_type": "Boeing 777",
    "aircraft_capacity": 95000,
    "status": "OnTime",
    "price_per_kg": 3.0,
    "departure_origin": "Singapore",
    "arrival_place": "London"
  },
  {
    "flight_number": "SQ461",
    "brand": "Singapore Airlines",
    "estimated_departure": "2023-10-15T07:00:00Z",
    "estimated_arrival": "2023-10-15T11:00:00Z",
    "actual_departure": "2023-10-15T07:10:00Z",
    "actual_arrival": "2023-10-15T11:15:00Z",
    "aircraft_type": "Airbus A380",
    "aircraft_capacity": 120000,
    "status": "OnTime",
    "price_per_kg": 3.0,
    "departure_origin": "Singapore",
    "arrival_place": "Dubai"
  },
  {
    "flight_number": "EK792",
    "brand": "Emirates",
    "estimated_departure": "2023-10-16T08:00:00Z",
    "estimated_arrival": "2023-10-16T12:00:00Z",
    "actual_departure": "2023-10-16T08:05:00Z",
    "actual_arrival": "2023-10-16T12:05:00Z",
    "aircraft_type": "Boeing 777",
    "aircraft_capacity": 100000,
    "status": "OnTime",
    "price_per_kg": 2.8,
    "departure_origin": "Dubai",
    "arrival_place": "Frankfurt"
  },
  {
    "flight_number": "EK793",
    "brand": "Emirates",
    "estimated_departure": "2023-10-17T15:00:00Z",
    "estimated_arrival": "2023-10-17T19:00:00Z",
    "actual_departure": "2023-10-17T15:20:00Z",
    "actual_arrival": "2023-10-17T19:30:00Z",
    "aircraft_type": "Airbus A380",
    "aircraft_capacity": 120000,
    "status": "Delayed",
    "price_per_kg": 2.8,
    "departure_origin": "Dubai",
    "arrival_place": "New York"
  },
  {
    "flight_number": "EK794",
    "brand": "Emirates",
    "estimated_departure": "2023-10-18T09:00:00Z",
    "estimated_arrival": "2023-10-18T13:00:00Z",
    "actual_departure": "2023-10-18T09:05:00Z",
    "actual_arrival": "2023-10-18T13:05:00Z",
    "aircraft_type": "Boeing 747",
    "aircraft_capacity": 100000,
    "status": "OnTime",
    "price_per_kg": 2.8,
    "departure_origin": "Dubai",
    "arrival_place": "Los Angeles"
  },
  {
    "flight_number": "EK795",
    "brand": "Emirates",
    "estimated_departure": "2023-10-19T14:00:00Z",
    "estimated_arrival": "2023-10-19T18:00:00Z",
    "actual_departure": "2023-10-19T14:15:00Z",
    "actual_arrival": "2023-10-19T18:10:00Z",
    "aircraft_type": "Airbus A350",
    "aircraft_capacity": 90000,
    "status": "OnTime",
    "price_per_kg": 2.8,
    "departure_origin": "Dubai",
    "arrival_place": "Tokyo"
  },
  {
    "flight_number": "SQ462",
    "brand": "Singapore Airlines",
    "estimated_departure": "2023-10-20T11:00:00Z",
    "estimated_arrival": "2023-10-20T15:00:00Z",
    "actual_departure": "2023-10-20T11:20:00Z",
    "actual_arrival": "2023-10-20T15:25:00Z",
    "aircraft_type": "Boeing 777",
    "aircraft_capacity": 95000,
    "status": "Delayed",
    "price_per_kg": 3.0,
    "departure_origin": "Singapore",
    "arrival_place": "Sydney"
  },
  {
    "flight_number": "SQ463",
    "brand": "Singapore Airlines",
    "estimated_departure": "2023-10-21T12:00:00Z",
    "estimated_arrival": "2023-10-21T16:00:00Z",
    "actual_departure": "2023-10-21T12:00:00Z",
    "actual_arrival": "2023-10-21T16:00:00Z",
    "aircraft_type": "Airbus A330",
    "aircraft_capacity": 80000,
    "status": "OnTime",
    "price_per_kg": 3.0,
    "departure_origin": "Singapore",
    "arrival_place": "Bangkok"
  },
  {
    "flight_number": "CX126",
    "brand": "Cathay",
    "estimated_departure": "2024-10-10T09:00:00Z",
    "estimated_arrival": "2024-10-10T13:00:00Z",
    "actual_departure": "2024-10-10T09:05:00Z",
    "actual_arrival": "2024-10-10T13:05:00Z",
    "aircraft_type": "Airbus A330",
    "aircraft_capacity": 80000,
    "status": "OnTime",
    "price_per_kg": 4.5,
    "departure_origin": "Hong Kong",
    "arrival_place": "Los Angeles"
  }
];
export async function GET(req: NextRequest) {
  try {
    // Get search params from the URL
    const searchParams = req.nextUrl.searchParams;
    const departure = searchParams.get('departure');
    const arrival = searchParams.get('arrival');
    
    // If no params, return all flights
    if (!departure && !arrival) {
      return NextResponse.json(flights);
    }
    
    // Filter flights based on search params
    const filteredFlights = flights.filter(flight => {
      const matchDeparture = !departure || flight.departure_origin.toLowerCase() === departure.toLowerCase();
      const matchArrival = !arrival || flight.arrival_place.toLowerCase() === arrival.toLowerCase();
      return matchDeparture && matchArrival;
    });
    
    if (filteredFlights.length === 0) {
      return NextResponse.json({ error: 'No flights found' }, { status: 404 });
    }
    
    return NextResponse.json(filteredFlights);
    
  } catch (error) {
    console.error('Error in processing request:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { flight_route, threshold } = await req.json();

    const currentFlight = flights.find(flight => flight.departure_origin === flight_route);
    if (!currentFlight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }
    
    const change_in_price = currentFlight.price_per_kg ;

      let subject = '';
      let body = '';

        subject = "Price Increase Alert";
        body = `
          Dear Team,<br><br>
          The price per kg for <strong> Cathay </strong> on the route from <strong> Hong Kong </strong> to <strong> Los Angeles </strong> 
          has increased by <strong>${change_in_price.toFixed(2)}</strong> units.<br><br>
          Please be aware of this change and consider taking further actions if necessary.<br><br>
          Best regards,<br>
          Pricing Team
        `;
    

      // Send email with the details
      await sendMail({
        to: 'darmich29@gmail.com',  // Replace with actual recipient
        subject,
        body,
      });


      return NextResponse.json({ message: 'Price alert email sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error in processing request:', error);
    return NextResponse.json({ error: 'Failed to process price alert' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { flight_route, threshold } = await req.json();
  } catch (error) {
    console.error('Error in processing request:', error);
    return NextResponse.json({ error: 'Failed to process price alert' }, { status: 500 });
  }
}