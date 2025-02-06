
const pool = require('../db/db')

// Mock the database pool
jest.mock('../db/db', () => ({
  connect: jest.fn(),
}));

describe('fetchFlightAnalytics', () => {
  // Mock client for database operations
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementation for pool.connect
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  it('should fetch and transform flight analytics correctly', async () => {
    // Mock successful query responses
    mockClient.query
      // BEGIN transaction
      .mockResolvedValueOnce({})
      // Total flights
      .mockResolvedValueOnce({ rows: [{ count: '100' }] })
      // Competitors
      .mockResolvedValueOnce({ rows: [{ count: '5' }] })
      // Countries
      .mockResolvedValueOnce({ rows: [{ count: '10' }] })
      // Routes
      .mockResolvedValueOnce({
        rows: [
          { route: 'USA - UK', count: '30' },
          { route: 'UK - France', count: '20' }
        ]
      })
      // Price by airline
      .mockResolvedValueOnce({
        rows: [
          { brand: 'Airline1', avg_price: '2.5' },
          { brand: 'Airline2', avg_price: '3.0' }
        ]
      })
      // Status
      .mockResolvedValueOnce({
        rows: [
          { status: 'active', count: '80' },
          { status: 'completed', count: '20' }
        ]
      })
      // Aircraft types
      .mockResolvedValueOnce({
        rows: [
          { aircraft_type: 'Boeing', count: '60' },
          { aircraft_type: 'Airbus', count: '40' }
        ]
      })
      // COMMIT transaction
      .mockResolvedValueOnce({});

    const result = await fetchFlightAnalytics();

    // Assert the transformed data structure
    expect(result).toEqual({
      totalFlights: 100,
      competitors: 5,
      countries: 10,
      routes: {
        'USA - UK': 30,
        'UK - France': 20
      },
      priceByAirline: {
        'Airline1': 2.5,
        'Airline2': 3.0
      },
      status: {
        'active': 80,
        'completed': 20
      },
      aircraftTypes: {
        'Boeing': 60,
        'Airbus': 40
      }
    });

    // Verify transaction handling
    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should handle database errors and rollback transaction', async () => {
    // Mock a database error
    mockClient.query.mockRejectedValueOnce(new Error('Database error'));

    await expect(fetchFlightAnalytics()).rejects.toThrow('Failed to fetch flight analytics');

    // Verify error handling
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should handle connection errors', async () => {
    // Mock connection error
    (pool.connect as jest.Mock).mockRejectedValueOnce(new Error('Connection error'));

    await expect(fetchFlightAnalytics()).rejects.toThrow('Failed to fetch flight analytics');
  });

  it('should release client even if queries fail', async () => {
    // Mock query error
    mockClient.query.mockRejectedValueOnce(new Error('Query error'));

    await expect(fetchFlightAnalytics()).rejects.toThrow('Failed to fetch flight analytics');

    // Verify client is released
    expect(mockClient.release).toHaveBeenCalled();
  });
});