const request = require('supertest');
const mongoose = require('mongoose');

// Mock models only - app.js never calls connectDB
jest.mock('../models/User');
jest.mock('../models/Roadmap');
jest.mock('../models/Tool');

const Tool = require('../models/Tool');
const app = require('../app');

describe('Tool Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleTools = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'GitHub Copilot',
      slug: 'github-copilot',
      description: 'AI-powered code completion',
      category: 'coding',
      pricing: 'paid',
      websiteUrl: 'https://github.com/features/copilot',
      tags: ['ai', 'coding'],
      isPublished: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Midjourney',
      slug: 'midjourney',
      description: 'AI image generation',
      category: 'image-generation',
      pricing: 'paid',
      websiteUrl: 'https://www.midjourney.com',
      tags: ['ai', 'image'],
      isPublished: true,
    },
  ];

  describe('GET /api/tools', () => {
    it('should return all published tools', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(sampleTools),
      };
      Tool.find.mockReturnValue(mockQuery);
      Tool.countDocuments.mockResolvedValue(2);

      const res = await request(app).get('/api/tools');

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
        limit: jest.fn().mockResolvedValue([sampleTools[0]]),
      };
      Tool.find.mockReturnValue(mockQuery);
      Tool.countDocuments.mockResolvedValue(2);

      const res = await request(app).get('/api/tools?page=1&limit=1');

      expect(res.status).toBe(200);
      expect(res.body.pagination).toMatchObject({ page: 1, limit: 1, total: 2, pages: 2 });
    });

    it('should pass category filter to database', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([sampleTools[0]]),
      };
      Tool.find.mockReturnValue(mockQuery);
      Tool.countDocuments.mockResolvedValue(1);

      await request(app).get('/api/tools?category=coding');

      expect(Tool.find).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'coding', isPublished: true })
      );
    });

    it('should pass pricing filter to database', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([sampleTools[0]]),
      };
      Tool.find.mockReturnValue(mockQuery);
      Tool.countDocuments.mockResolvedValue(1);

      await request(app).get('/api/tools?pricing=paid');

      expect(Tool.find).toHaveBeenCalledWith(
        expect.objectContaining({ pricing: 'paid', isPublished: true })
      );
    });

    it('should return empty list when no tools', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      Tool.find.mockReturnValue(mockQuery);
      Tool.countDocuments.mockResolvedValue(0);

      const res = await request(app).get('/api/tools');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('GET /api/tools/categories', () => {
    it('should return categories with counts', async () => {
      Tool.aggregate.mockResolvedValue([
        { _id: 'coding', count: 3 },
        { _id: 'chatbot', count: 2 },
      ]);

      const res = await request(app).get('/api/tools/categories');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toMatchObject({ category: 'coding', count: 3 });
    });

    it('should return empty array when no tools', async () => {
      Tool.aggregate.mockResolvedValue([]);

      const res = await request(app).get('/api/tools/categories');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('GET /api/tools/:slug', () => {
    it('should return a tool by slug', async () => {
      const toolWithAlts = { ...sampleTools[0], alternatives: [] };
      const mockQuery = { populate: jest.fn().mockResolvedValue(toolWithAlts) };
      Tool.findOne.mockReturnValue(mockQuery);

      const res = await request(app).get('/api/tools/github-copilot');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('github-copilot');
    });

    it('should return 404 for non-existent slug', async () => {
      const mockQuery = { populate: jest.fn().mockResolvedValue(null) };
      Tool.findOne.mockReturnValue(mockQuery);

      const res = await request(app).get('/api/tools/non-existent-tool');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should query with both slug and isPublished=true', async () => {
      const mockQuery = { populate: jest.fn().mockResolvedValue(sampleTools[0]) };
      Tool.findOne.mockReturnValue(mockQuery);

      await request(app).get('/api/tools/github-copilot');

      expect(Tool.findOne).toHaveBeenCalledWith({
        slug: 'github-copilot',
        isPublished: true,
      });
    });
  });
});
