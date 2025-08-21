const supertest = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');
const Apartment = require('../src/models/Apartment');
const Booking = require('../src/models/Booking');
const Review = require('../src/models/Review');

const request = supertest(app);

describe('Review Endpoints', () => {
  let adminToken, renterToken, ownerToken;
  let renterUser, ownerUser;
  let apartment;
  let booking;

  // Test data
  const adminData = { name: 'Admin', email: 'reviewadmin@example.com', password: 'password123', role: 'admin' };
  const ownerData = { name: 'Owner', email: 'reviewowner@example.com', password: 'password123', role: 'owner' };
  const renterData = { name: 'Renter', email: 'reviewrenter@example.com', password: 'password123', role: 'renter' };

  beforeEach(async () => {
    // Create users
    await User.create(adminData);
    ownerUser = await User.create(ownerData);
    renterUser = await User.create(renterData);

    // Login users to get tokens
    const adminRes = await request.post('/api/v1/auth/login').send({ email: adminData.email, password: adminData.password });
    adminToken = adminRes.body.token;
    const ownerRes = await request.post('/api/v1/auth/login').send({ email: ownerData.email, password: ownerData.password });
    ownerToken = ownerRes.body.token;
    const renterRes = await request.post('/api/v1/auth/login').send({ email: renterData.email, password: renterData.password });
    renterToken = renterRes.body.token;

    // Create apartment and a confirmed booking
    apartment = await Apartment.create({ location: 'Review Test Apt', pricePerNight: 100, maxGuests: 2, description: 'Desc', photos: [], manager: ownerUser._id });
    booking = await Booking.create({
      apartment: apartment._id,
      renter: renterUser._id,
      checkInDate: new Date('2025-01-01'),
      checkOutDate: new Date('2025-01-05'),
      totalPrice: 400,
      status: 'Confirmed',
    });
  });

  describe('POST /api/v1/reviews', () => {
    it('should allow a renter with a confirmed booking to post a review', async () => {
      const reviewData = {
        apartment: apartment._id,
        rating: 5,
        comment: 'Great place!',
      };
      const res = await request
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${renterToken}`)
        .send(reviewData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Pending');
      expect(res.body.data.comment).toBe('Great place!');
    });

    it('should NOT allow a user to post a review for an apartment they have not booked', async () => {
        // Log in as a different user who has no bookings
        const otherRenter = await User.create({ name: 'Other', email: 'other@example.com', password: 'password123' });
        const otherTokenRes = await request.post('/api/v1/auth/login').send({ email: otherRenter.email, password: 'password123' });
        const otherToken = otherTokenRes.body.token;

        const reviewData = { apartment: apartment._id, rating: 1, comment: 'I did not stay here.' };
        const res = await request
            .post('/api/v1/reviews')
            .set('Authorization', `Bearer ${otherToken}`)
            .send(reviewData);

        expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/v1/reviews/:id', () => {
    let pendingReview;

    beforeEach(async () => {
        // Create a review to be moderated
        pendingReview = await Review.create({
            apartment: apartment._id,
            renter: renterUser._id,
            rating: 4,
            comment: 'A pending review.'
        });
    });

    it('should allow an admin to approve a review', async () => {
      const res = await request
        .put(`/api/v1/reviews/${pendingReview._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Approved' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('Approved');
    });

    it('should NOT allow a regular user to moderate a review', async () => {
        const res = await request
          .put(`/api/v1/reviews/${pendingReview._id}`)
          .set('Authorization', `Bearer ${renterToken}`)
          .send({ status: 'Approved' });

        expect(res.statusCode).toBe(403); // 403 Forbidden is the correct code for this auth middleware
      });
  });
});
