const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  updateProfile,
  toggleBookmarkRoadmap,
  toggleBookmarkTool,
  getBookmarks,
  updateProgress,
  getProgress,
} = require('../controllers/userController');

router.use(protect);

router.put('/profile', updateProfile);
router.post('/bookmarks/roadmaps/:id', toggleBookmarkRoadmap);
router.post('/bookmarks/tools/:id', toggleBookmarkTool);
router.get('/bookmarks', getBookmarks);
router.put('/progress/:roadmapId', updateProgress);
router.get('/progress', getProgress);

module.exports = router;
