const Roadmap = require('../models/Roadmap');
const Tool = require('../models/Tool');

exports.searchAll = async (req, res, next) => {
  try {
    const { q, type } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, data: { roadmaps: [], tools: [] } });
    }

    const textQuery = { $text: { $search: q }, isPublished: true };
    const scoreField = { score: { $meta: 'textScore' } };

    let roadmaps = [];
    let tools = [];

    if (!type || type === 'roadmap') {
      roadmaps = await Roadmap.find(textQuery, scoreField)
        .select('-sections')
        .sort({ score: { $meta: 'textScore' } })
        .limit(10);
    }

    if (!type || type === 'tool') {
      tools = await Tool.find(textQuery, scoreField)
        .select('-alternatives')
        .sort({ score: { $meta: 'textScore' } })
        .limit(10);
    }

    res.json({ success: true, data: { roadmaps, tools } });
  } catch (err) {
    next(err);
  }
};
