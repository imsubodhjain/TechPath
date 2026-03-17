const User = require('../models/User');

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.toggleBookmarkRoadmap = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const roadmapId = req.params.id;
    const index = user.savedRoadmaps.indexOf(roadmapId);

    if (index === -1) {
      user.savedRoadmaps.push(roadmapId);
    } else {
      user.savedRoadmaps.splice(index, 1);
    }
    await user.save();

    res.json({ success: true, data: user.savedRoadmaps, bookmarked: index === -1 });
  } catch (err) {
    next(err);
  }
};

exports.toggleBookmarkTool = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const toolId = req.params.id;
    const index = user.savedTools.indexOf(toolId);

    if (index === -1) {
      user.savedTools.push(toolId);
    } else {
      user.savedTools.splice(index, 1);
    }
    await user.save();

    res.json({ success: true, data: user.savedTools, bookmarked: index === -1 });
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedRoadmaps', 'title slug description icon category difficulty estimatedHours tags')
      .populate('savedTools', 'name slug description category pricing logoUrl');
    res.json({
      success: true,
      data: {
        roadmaps: user.savedRoadmaps,
        tools: user.savedTools,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { completedTopics } = req.body;
    const roadmapId = req.params.roadmapId;
    const user = await User.findById(req.user._id);

    const existing = user.progress.find((p) => p.roadmap.toString() === roadmapId);
    if (existing) {
      existing.completedTopics = completedTopics;
    } else {
      user.progress.push({ roadmap: roadmapId, completedTopics });
    }
    await user.save();

    res.json({ success: true, data: user.progress });
  } catch (err) {
    next(err);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('progress.roadmap', 'title slug sections');
    res.json({ success: true, data: user.progress });
  } catch (err) {
    next(err);
  }
};
