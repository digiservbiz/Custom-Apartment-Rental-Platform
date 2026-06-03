const supertest = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');
const Apartment = require('../src/models/Apartment');
const Booking = require('../src/models/Booking');

const request = supertest(app);

describe('Booking Endpoints', () => {
  let token;
  let user;
  let apartment;

  // Test data
  const testUser = { name: 'Test Renter', email: 'renter@example.com', password: 'password123', role: 'renter' };
  const testApartment = { location: 'Test Beach House', pricePerNight: 100, maxGuests: 4, description: 'A nice house.' };

  // Dates for an existing confirmed booking (far future to stay valid)
  const existingBookingCheckIn = new Date('2099-07-10');
  const existingBookingCheckOut = new Date('2099-07-15');

  beforeEach(async () => {
    // Create user and apartment before each test
    user = await User.create(testUser);
    apartment = await Apartment.create({ ...testApartment, manager: user._id });

    // Log in user to get token
    const res = await request.post('/api/v1/auth/login').send({ email: testUser.email, password: testUser.password });
    token = res.body.token;

    // Create a confirmed booking to test against
    await Booking.create({
      apartment: apartment._id,
      renter: user._id,
      checkInDate: existingBookingCheckIn,
      checkOutDate: existingBookingCheckOut,
      totalPrice: 500,
      status: 'Confirmed',
    });
  });

  it('should FAIL to create a booking for dates that overlap with an existing confirmed booking', async () => {
    const overlappingBooking = {
      apartment: apartment._id,
      checkInDate: new Date('2099-07-14'), // Overlaps with July 10-15
      checkOutDate: new Date('2099-07-20'),
    };

    const res = await request
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(overlappingBooking);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Sorry, the apartment is already booked for the selected dates.');
  });

  it('should SUCCEED in creating a booking for dates that do not overlap', async () => {
    const nonOverlappingBooking = {
      apartment: apartment._id,
      checkInDate: new Date('2099-07-20'), // Does not overlap with July 10-15
      checkOutDate: new Date('2099-07-25'),
    };

    const res = await request
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(nonOverlappingBooking);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('status', 'Pending');
    expect(res.body.data.totalPrice).toBeGreaterThan(0);
  });

  it('should FAIL to create a booking with check-out before check-in', async () => {
    const invalidBooking = {
      apartment: apartment._id,
      checkInDate: new Date('2099-07-25'),
      checkOutDate: new Date('2099-07-20'),
    };

    const res = await request
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBooking);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
