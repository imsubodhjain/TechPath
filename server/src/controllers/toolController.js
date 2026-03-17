const Tool = require('../models/Tool');

exports.getAllTools = async (req, res, next) => {
  try {
    const { category, pricing, page = 1, limit = 12 } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (pricing) filter.pricing = pricing;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [tools, total] = await Promise.all([
      Tool.find(filter)
        .select('-alternatives')
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Tool.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: tools,
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

exports.getToolBySlug = async (req, res, next) => {
  try {
    const tool = await Tool.findOne({ slug: req.params.slug, isPublished: true })
      .populate('alternatives', 'name slug pricing logoUrl category description');
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    res.json({ success: true, data: tool });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Tool.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({
      success: true,
      data: categories.map((c) => ({ category: c._id, count: c.count })),
    });
  } catch (err) {
    next(err);
  }
};
