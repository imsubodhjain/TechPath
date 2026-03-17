const request = require('supertest');
const mongoose = require('mongoose');

// Mock models only - app.js never calls connectDB
jest.mock('../models/User');
jest.mock('../models/Roadmap');
jest.mock('../models/Tool');

const Roadmap = require('../models/Roadmap');
const app = require('../app');

describe('Roadmap Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleRoadmaps = [
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Frontend Development',
      slug: 'frontend-development',
      description: 'Learn modern frontend development',
      category: 'frontend',
      difficulty: 'beginner',
      estimatedHours: 120,
      tags: ['html', 'css', 'javascript'],
      isPublished: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Backend Development',
      slug: 'backend-development',
      description: 'Learn Node.js and databases',
      category: 'backend',
      difficulty: 'intermediate',
      estimatedHours: 200,
      tags: ['node', 'mongodb'],
      isPublished: true,
    },
  ];

  describe('GET /api/roadmaps', () => {
    it('should return all published roadmaps', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(sampleRoadmaps),
      };
      Roadmap.find.mockReturnValue(mockQuery);
      Roadmap.countDocuments.mockResolvedValue(2);

      const res = await request(app).get('/api/roadmaps');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination.total).toBe(2);
    });

    it('should return pagination metadata', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([sampleRoadmaps[0]]),
      };
      Roadmap.find.mockReturnValue(mockQuery);
      Roadmap.countDocuments.mockResolvedValue(2);

      const res = await request(app).get('/api/roadmaps?page=1&limit=1');

      expect(res.status).toBe(200);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 1,
        total: 2,
        pages: 2,
      });
    });

    it('should pass category filter to database', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([sampleRoadmaps[0]]),
      };
      Roadmap.find.mockReturnValue(mockQuery);
      Roadmap.countDocuments.mockResolvedValue(1);

      const res = await request(app).get('/api/roadmaps?category=frontend');

      expect(res.status).toBe(200);
      expect(Roadmap.find).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'frontend', isPublished: true })
      );
    });

    it('should pass difficulty filter to database', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([sampleRoadmaps[0]]),
      };
      Roadmap.find.mockReturnValue(mockQuery);
      Roadmap.countDocuments.mockResolvedValue(1);

      await request(app).get('/api/roadmaps?difficulty=beginner');

      expect(Roadmap.find).toHaveBeenCalledWith(
        expect.objectContaining({ difficulty: 'beginner', isPublished: true })
      );
    });

    it('should return empty list when no roadmaps', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      Roadmap.find.mockReturnValue(mockQuery);
      Roadmap.countDocuments.mockResolvedValue(0);

      const res = await request(app).get('/api/roadmaps');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });
  });

  describe('GET /api/roadmaps/popular', () => {
    it('should return at most 6 roadmaps', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(sampleRoadmaps),
      };
      Roadmap.find.mockReturnValue(mockQuery);

      const res = await request(app).get('/api/roadmaps/popular');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockQuery.limit).toHaveBeenCalledWith(6);
    });

    it('should return empty array when no roadmaps', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      Roadmap.find.mockReturnValue(mockQuery);

      const res = await request(app).get('/api/roadmaps/popular');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('GET /api/roadmaps/:slug', () => {
    it('should return a roadmap by slug', async () => {
      Roadmap.findOne.mockResolvedValue(sampleRoadmaps[0]);

      const res = await request(app).get('/api/roadmaps/frontend-development');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('frontend-development');
    });

    it('should return 404 for non-existent slug', async () => {
      Roadmap.findOne.mockResolvedValue(null);

      const res = await request(app).get('/api/roadmaps/non-existent-slug');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should query with both slug and isPublished=true', async () => {
      Roadmap.findOne.mockResolvedValue(sampleRoadmaps[0]);

      await request(app).get('/api/roadmaps/frontend-development');

      expect(Roadmap.findOne).toHaveBeenCalledWith({
        slug: 'frontend-development',
        isPublished: true,
      });
    });
  });
});
