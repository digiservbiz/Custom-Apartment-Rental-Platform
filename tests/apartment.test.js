const supertest = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');
const Apartment = require('../src/models/Apartment');
const geocoder = require('../src/utils/geocoder');

const request = supertest(app);

// Mock the geocoder
jest.mock('../src/utils/geocoder', () => ({
  geocode: jest.fn().mockResolvedValue([
    {
      longitude: -73.987,
      latitude: 40.73,
      formattedAddress: 'Mocked Address, NY, USA',
      streetName: 'Mock Street',
      city: 'Mock City',
      stateCode: 'NY',
      zipcode: '10001',
      countryCode: 'US',
    },
  ]),
}));

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

    // Create test apartments
    testApartment = await Apartment.create({
      address: '123 Main St, Anytown, USA',
      description: 'Test Description',
      pricePerNight: 150,
      maxGuests: 4,
      photos: ['photo1.jpg'],
      manager: ownerUser._id,
      amenities: ['parking']
    });

    await Apartment.create({
      address: '456 Oak Ave, Sometown, USA',
      description: 'A cheap place',
      pricePerNight: 100,
      maxGuests: 2,
      photos: ['photo2.jpg'],
      manager: ownerUser._id,
      amenities: ['wifi', 'kitchen']
    });

    await Apartment.create({
      address: '789 Pine Ln, Otherville, USA',
      description: 'A luxury villa',
      pricePerNight: 300,
      maxGuests: 6,
      photos: ['photo3.jpg'],
      manager: ownerUser._id,
      amenities: ['wifi', 'pool']
    });
  });

  describe('GET /api/v1/apartments', () => {
    it('should return all apartments when no filters are applied', async () => {
      const res = await request.get('/api/v1/apartments');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(3);
    });

    it('should filter by maxGuests', async () => {
      const res = await request.get('/api/v1/apartments?maxGuests[gte]=5');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].address).toBe('789 Pine Ln, Otherville, USA');
    });

    it('should filter by price', async () => {
      const res = await request.get('/api/v1/apartments?pricePerNight[lte]=150');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(2);
    });

    it('should filter by a single amenity using $in', async () => {
      const res = await request.get('/api/v1/apartments?amenities[in]=pool');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].address).toBe('789 Pine Ln, Otherville, USA');
    });

    it('should filter by multiple amenities using $all (via [in] syntax)', async () => {
        const res = await request.get('/api/v1/apartments?amenities[in]=wifi,kitchen');
        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].address).toBe('456 Oak Ave, Sometown, USA');
    });

    it('should combine filters correctly', async () => {
      const res = await request.get('/api/v1/apartments?pricePerNight[lte]=400&maxGuests[gte]=2&amenities[in]=wifi');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(2); // Cheap Place and Luxury Villa
    });

    it('should search by keyword in the address', async () => {
      const res = await request.get('/api/v1/apartments?keyword=Anytown');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].address).toBe('123 Main St, Anytown, USA');
    });
  });

  describe('POST /api/v1/apartments', () => {
    it('should allow an owner to create an apartment and geocode the address', async () => {
      const newApartment = {
        address: '100 Broadway, New York, NY',
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
      expect(res.body.data.address).toBe('100 Broadway, New York, NY');
      expect(res.body.data.location).toBeDefined();
      expect(res.body.data.location.type).toBe('Point');
      expect(res.body.data.location.coordinates).toEqual([-73.987, 40.73]);
    });
  });

  describe('PUT /api/v1/apartments/:id', () => {
    it('should allow the owner to update their own apartment', async () => {
      const res = await request
        .put(`/api/v1/apartments/${testApartment._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ address: 'Updated Address, NY' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.address).toBe('Updated Address, NY');
      // Check if geocoding was re-triggered
      expect(geocoder.geocode).toHaveBeenCalledWith('Updated Address, NY');
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
