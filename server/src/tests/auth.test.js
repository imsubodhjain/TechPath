const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock models only - app.js never calls connectDB
jest.mock('../models/User');
jest.mock('../models/Roadmap');
jest.mock('../models/Tool');

const User = require('../models/User');
const app = require('../app');

const JWT_SECRET = 'test-secret-key-for-jest';

const makeToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return token', async () => {
      User.findOne.mockResolvedValue(null);
      const fakeUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
      User.create.mockResolvedValue(fakeUser);

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.data).toMatchObject({ name: 'Test User', email: 'test@example.com' });
    });

    it('should reject registration with missing name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'not-an-email', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject duplicate email registration', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already registered/i);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials and return token', async () => {
      const fakeUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const fakeUser = {
        _id: new mongoose.Types.ObjectId(),
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('should reject login with non-existent email', async () => {
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject login with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject login with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-email', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const fakeUser = { _id: fakeId, name: 'Test User', email: 'test@example.com', role: 'user' };
      const token = makeToken(fakeId.toString());

      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({ name: 'Test User', email: 'test@example.com' });
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 when user not found in DB', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const token = makeToken(fakeId.toString());

      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
