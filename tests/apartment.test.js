const supertest = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');
const Apartment = require('../src/models/Apartment');

const request = supertest(app);

describe('Apartment Endpoints', () => {
  let adminToken, ownerToken, renterToken;
  let ownerUser;
  let testApartment;

  // Test data
  const adminData = { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' };
  const ownerData = { name: 'Owner User', email: 'owner@example.com', password: 'password123', role: 'owner' };
  const renterData = { name: 'Renter User', email: 'renter@example.com', password: 'password123', role: 'renter' };

  beforeEach(async () => {
    // Create users
    await User.create(adminData);
    ownerUser = await User.create(ownerData);
    await User.create(renterData);

    // Login users to get tokens
    const adminRes = await request.post('/api/v1/auth/login').send({ email: adminData.email, password: adminData.password });
    adminToken = adminRes.body.token;
    const ownerRes = await request.post('/api/v1/auth/login').send({ email: ownerData.email, password: ownerData.password });
    ownerToken = ownerRes.body.token;
    const renterRes = await request.post('/api/v1/auth/login').send({ email: renterData.email, password: renterData.password });
    renterToken = renterRes.body.token;

    // Create a test apartment owned by the owner user
    testApartment = await Apartment.create({
      location: 'Test Location',
      description: 'Test Description',
      pricePerNight: 150,
      maxGuests: 4,
      photos: ['photo1.jpg'],
      manager: ownerUser._id,
    });
  });

  describe('POST /api/v1/apartments', () => {
    it('should allow an owner to create an apartment', async () => {
      const newApartment = {
        location: 'New Owner Apartment',
        description: 'A brand new place.',
        pricePerNight: 200,
        maxGuests: 2,
        photos: ['new.jpg']
      };
      const res = await request
        .post('/api/v1/apartments')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(newApartment);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.location).toBe('New Owner Apartment');
    });

    it('should NOT allow a renter to create an apartment', async () => {
      const newApartment = { location: 'Renter Apartment', description: '...', pricePerNight: 100, maxGuests: 1, photos: [] };
      const res = await request
        .post('/api/v1/apartments')
        .set('Authorization', `Bearer ${renterToken}`)
        .send(newApartment);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PUT /api/v1/apartments/:id', () => {
    it('should allow the owner to update their own apartment', async () => {
      const res = await request
        .put(`/api/v1/apartments/${testApartment._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ location: 'Updated Location' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.location).toBe('Updated Location');
    });

    it('should NOT allow a renter to update an apartment', async () => {
      const res = await request
        .put(`/api/v1/apartments/${testApartment._id}`)
        .set('Authorization', `Bearer ${renterToken}`)
        .send({ location: 'Renter Updated Location' });

      expect(res.statusCode).toBe(403);
    });

    it('should allow an admin to update any apartment', async () => {
        const res = await request
          .put(`/api/v1/apartments/${testApartment._id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ location: 'Admin Updated Location' });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.location).toBe('Admin Updated Location');
    });
  });

  describe('DELETE /api/v1/apartments/:id', () => {
    it('should allow the owner to delete their own apartment', async () => {
      const res = await request
        .delete(`/api/v1/apartments/${testApartment._id}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      const deletedApartment = await Apartment.findById(testApartment._id);
      expect(deletedApartment).toBeNull();
    });
  });
});
