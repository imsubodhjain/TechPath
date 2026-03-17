const request = require('supertest');
const mongoose = require('mongoose');

// Mock models only - app.js never calls connectDB
jest.mock('../models/User');
jest.mock('../models/Roadmap');
jest.mock('../models/Tool');

const Roadmap = require('../models/Roadmap');
const Tool = require('../models/Tool');
const app = require('../app');

describe('Search Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleRoadmap = {
    _id: new mongoose.Types.ObjectId(),
    title: 'React Frontend Development',
    slug: 'react-frontend',
    description: 'Learn React framework for building UIs',
    category: 'frontend',
    isPublished: true,
  };

  const sampleTool = {
    _id: new mongoose.Types.ObjectId(),
    name: 'React DevTools',
    slug: 'react-devtools',
    description: 'Browser extension for debugging React apps',
    category: 'coding',
    isPublished: true,
  };

  const mockRoadmapQuery = (results) => ({
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(results),
  });

  const mockToolQuery = (results) => ({
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(results),
  });

  describe('GET /api/search', () => {
    it('should return empty results for empty query', async () => {
      const res = await request(app).get('/api/search?q=');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.roadmaps).toEqual([]);
      expect(res.body.data.tools).toEqual([]);
    });

    it('should return empty results for whitespace-only query', async () => {
      const res = await request(app).get('/api/search?q=   ');

      expect(res.status).toBe(200);
      expect(res.body.data.roadmaps).toEqual([]);
      expect(res.body.data.tools).toEqual([]);
    });

    it('should return empty results when no query param', async () => {
      const res = await request(app).get('/api/search');

      expect(res.status).toBe(200);
      expect(res.body.data.roadmaps).toEqual([]);
      expect(res.body.data.tools).toEqual([]);
    });

    it('should search roadmaps and tools when query is provided', async () => {
      Roadmap.find.mockReturnValue(mockRoadmapQuery([sampleRoadmap]));
      Tool.find.mockReturnValue(mockToolQuery([sampleTool]));

      const res = await request(app).get('/api/search?q=React');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.roadmaps).toHaveLength(1);
      expect(res.body.data.tools).toHaveLength(1);
    });

    it('should use $text search operator', async () => {
      Roadmap.find.mockReturnValue(mockRoadmapQuery([]));
      Tool.find.mockReturnValue(mockToolQuery([]));

      await request(app).get('/api/search?q=Python');

      expect(Roadmap.find).toHaveBeenCalledWith(
        expect.objectContaining({ $text: { $search: 'Python' } }),
        expect.any(Object)
      );
    });

    it('should filter by type=roadmap (no tools queried)', async () => {
      Roadmap.find.mockReturnValue(mockRoadmapQuery([sampleRoadmap]));

      const res = await request(app).get('/api/search?q=React&type=roadmap');

      expect(res.status).toBe(200);
      expect(res.body.data.roadmaps).toHaveLength(1);
      expect(res.body.data.tools).toEqual([]);
      expect(Tool.find).not.toHaveBeenCalled();
    });

    it('should filter by type=tool (no roadmaps queried)', async () => {
      Tool.find.mockReturnValue(mockToolQuery([sampleTool]));

      const res = await request(app).get('/api/search?q=React&type=tool');

      expect(res.status).toBe(200);
      expect(res.body.data.roadmaps).toEqual([]);
      expect(res.body.data.tools).toHaveLength(1);
      expect(Roadmap.find).not.toHaveBeenCalled();
    });

    it('should limit results to 10 per type', async () => {
      Roadmap.find.mockReturnValue(mockRoadmapQuery([sampleRoadmap]));
      Tool.find.mockReturnValue(mockToolQuery([sampleTool]));

      await request(app).get('/api/search?q=dev');

      // Verify limit(10) was called
      const roadmapQuery = Roadmap.find.mock.results[0].value;
      expect(roadmapQuery.limit).toHaveBeenCalledWith(10);
    });
  });
});
