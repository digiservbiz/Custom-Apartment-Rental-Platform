const supertest = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');

const request = supertest(app);

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');

      // Check that the user was actually created in the DB
      const dbUser = await User.findOne({ email: testUser.email });
      expect(dbUser).not.toBeNull();
      expect(dbUser.name).toBe(testUser.name);
    });

    it('should fail to register a user with an email that already exists', async () => {
      // First, create the user
      await User.create(testUser);

      // Then, try to register again with the same email
      const res = await request
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400); // Or whatever error code is sent for duplicates
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a user to log in with before each test in this block
      await User.create(testUser);
    });

    it('should log in a registered user successfully', async () => {
      const res = await request
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail to log in with an incorrect password', async () => {
      const res = await request
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail to log in with a non-existent email', async () => {
      const res = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password,
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
