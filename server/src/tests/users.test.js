const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock models only - app.js never calls connectDB
jest.mock('../models/User');
jest.mock('../models/Roadmap');
jest.mock('../models/Tool');

const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const Tool = require('../models/Tool');
const app = require('../app');

const JWT_SECRET = 'test-secret-key-for-jest';
const fakeUserId = new mongoose.Types.ObjectId();
const makeToken = () => jwt.sign({ id: fakeUserId.toString() }, JWT_SECRET, { expiresIn: '1d' });

const roadmapId = new mongoose.Types.ObjectId();
const toolId = new mongoose.Types.ObjectId();

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupAuth = () => {
    const fakeUser = {
      _id: fakeUserId,
      name: 'Test User',
      email: 'user@example.com',
      role: 'user',
      savedRoadmaps: [],
      savedTools: [],
      progress: [],
      save: jest.fn().mockResolvedValue(undefined),
    };
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });
    return { token: makeToken(), fakeUser };
  };

  describe('PUT /api/users/profile', () => {
    it('should update user name and avatar', async () => {
      const { token } = setupAuth();
      const updatedUser = { _id: fakeUserId, name: 'Updated Name', avatar: 'https://example.com/avatar.jpg' };
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name', avatar: 'https://example.com/avatar.jpg' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Name');
    });

    it('should update only name when no avatar provided', async () => {
      const { token } = setupAuth();
      User.findByIdAndUpdate.mockResolvedValue({ _id: fakeUserId, name: 'New Name' });

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('New Name');
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app).put('/api/users/profile').send({ name: 'Updated' });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/users/bookmarks/roadmaps/:id', () => {
    it('should add a roadmap bookmark', async () => {
      const { token, fakeUser } = setupAuth();
      fakeUser.savedRoadmaps = [];

      // Second call to findById returns the actual user object (not the auth query)
      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(fakeUser) }) // auth middleware
        .mockResolvedValueOnce(fakeUser); // controller

      const res = await request(app)
        .post(`/api/users/bookmarks/roadmaps/${roadmapId}`)
        .set('Authorization', `Bearer ${makeToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.bookmarked).toBe(true);
    });

    it('should remove a roadmap bookmark when toggled', async () => {
      const { fakeUser } = setupAuth();
      fakeUser.savedRoadmaps = [roadmapId.toString()];

      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(fakeUser) })
        .mockResolvedValueOnce(fakeUser);

      const res = await request(app)
        .post(`/api/users/bookmarks/roadmaps/${roadmapId}`)
        .set('Authorization', `Bearer ${makeToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.bookmarked).toBe(false);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app).post(`/api/users/bookmarks/roadmaps/${roadmapId}`);
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/users/bookmarks/tools/:id', () => {
    it('should add a tool bookmark', async () => {
      const { fakeUser } = setupAuth();
      fakeUser.savedTools = [];

      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(fakeUser) })
        .mockResolvedValueOnce(fakeUser);

      const res = await request(app)
        .post(`/api/users/bookmarks/tools/${toolId}`)
        .set('Authorization', `Bearer ${makeToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.bookmarked).toBe(true);
    });

    it('should toggle tool bookmark off', async () => {
      const { fakeUser } = setupAuth();
      fakeUser.savedTools = [toolId.toString()];

      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(fakeUser) })
        .mockResolvedValueOnce(fakeUser);

      const res = await request(app)
        .post(`/api/users/bookmarks/tools/${toolId}`)
        .set('Authorization', `Bearer ${makeToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.bookmarked).toBe(false);
    });
  });

  describe('GET /api/users/bookmarks', () => {
    it('should return bookmarks for authenticated user', async () => {
      const { token, fakeUser } = setupAuth();

      const populatedUser = {
        ...fakeUser,
        savedRoadmaps: [{ _id: roadmapId, title: 'React Frontend', slug: 'react-frontend' }],
        savedTools: [{ _id: toolId, name: 'VS Code', slug: 'vs-code' }],
      };

      // Chain populate().populate() correctly
      const populateChain = {
        populate: jest.fn().mockResolvedValue(populatedUser),
      };
      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(fakeUser) }) // auth
        .mockReturnValueOnce({ populate: jest.fn().mockReturnValue(populateChain) }); // bookmarks controller

      const res = await request(app)
        .get('/api/users/bookmarks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('roadmaps');
      expect(res.body.data).toHaveProperty('tools');
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/users/bookmarks');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/users/progress/:roadmapId', () => {
    it('should save progress for a roadmap', async () => {
      const { token, fakeUser } = setupAuth();
      fakeUser.progress = [];

      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(fakeUser) })
        .mockResolvedValueOnce(fakeUser);

      const res = await request(app)
        .put(`/api/users/progress/${roadmapId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completedTopics: ['topic-1', 'topic-2'] });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should update existing progress for a roadmap', async () => {
      const { token, fakeUser } = setupAuth();
      fakeUser.progress = [{ roadmap: roadmapId, completedTopics: ['topic-1'] }];
      fakeUser.progress[0].roadmap = { toString: () => roadmapId.toString() };

      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(fakeUser) })
        .mockResolvedValueOnce(fakeUser);

      const res = await request(app)
        .put(`/api/users/progress/${roadmapId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completedTopics: ['topic-1', 'topic-2', 'topic-3'] });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .put(`/api/users/progress/${roadmapId}`)
        .send({ completedTopics: [] });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/users/progress', () => {
    it('should return user progress', async () => {
      const { token, fakeUser } = setupAuth();

      const userWithProgress = {
        ...fakeUser,
        progress: [{ roadmap: { title: 'DevOps Path', slug: 'devops-path' }, completedTopics: ['t1', 't2'] }],
      };

      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(fakeUser) }) // auth
        .mockReturnValueOnce({
          populate: jest.fn().mockResolvedValue(userWithProgress),
        }); // controller

      const res = await request(app)
        .get('/api/users/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/users/progress');
      expect(res.status).toBe(401);
    });
  });
});
