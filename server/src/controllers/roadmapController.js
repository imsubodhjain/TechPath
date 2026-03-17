const Roadmap = require('../models/Roadmap');

exports.getAllRoadmaps = async (req, res, next) => {
  try {
    const { category, difficulty, page = 1, limit = 12 } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [roadmaps, total] = await Promise.all([
      Roadmap.find(filter)
        .select('-sections')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Roadmap.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: roadmaps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getPopularRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ isPublished: true })
      .select('-sections')
      .sort({ createdAt: 1 })
      .limit(6);
    res.json({ success: true, data: roadmaps });
  } catch (err) {
    next(err);
  }
};

exports.getRoadmapBySlug = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ slug: req.params.slug, isPublished: true });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }
    res.json({ success: true, data: roadmap });
  } catch (err) {
    next(err);
  }
};
