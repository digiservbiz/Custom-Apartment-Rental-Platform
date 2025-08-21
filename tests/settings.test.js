const supertest = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');
const Setting = require('../src/models/Setting');

const request = supertest(app);

describe('Settings Endpoints', () => {
  let adminToken, renterToken;

  // Test data
  const adminData = { name: 'Settings Admin', email: 'settingsadmin@example.com', password: 'password123', role: 'admin' };
  const renterData = { name: 'Settings Renter', email: 'settingsrenter@example.com', password: 'password123', role: 'renter' };

  beforeEach(async () => {
    // Create users
    await User.create(adminData);
    await User.create(renterData);

    // Login users to get tokens
    const adminRes = await request.post('/api/v1/auth/login').send({ email: adminData.email, password: adminData.password });
    adminToken = adminRes.body.token;
    const renterRes = await request.post('/api/v1/auth/login').send({ email: renterData.email, password: renterData.password });
    renterToken = renterRes.body.token;
  });

  describe('GET /api/v1/settings/:key', () => {
    it('should return the default value if the setting is not in the DB', async () => {
      const res = await request.get('/api/v1/settings/commission_fee');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.value).toBe('10'); // Default value
    });

    it('should return the setting value if it exists in the DB', async () => {
      await Setting.create({ key: 'commission_fee', value: '15.5' });

      const res = await request.get('/api/v1/settings/commission_fee');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.value).toBe('15.5');
    });
  });

  describe('PUT /api/v1/settings/:key', () => {
    it('should allow an admin to update a setting', async () => {
      const res = await request
        .put('/api/v1/settings/commission_fee')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ value: '12' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.value).toBe('12');

      const settingInDb = await Setting.findOne({ key: 'commission_fee' });
      expect(settingInDb.value).toBe('12');
    });

    it('should NOT allow a non-admin to update a setting', async () => {
      const res = await request
        .put('/api/v1/settings/commission_fee')
        .set('Authorization', `Bearer ${renterToken}`)
        .send({ value: '5' });

      expect(res.statusCode).toBe(403);
    });
  });
});
