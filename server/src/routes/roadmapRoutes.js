const express = require('express');
const router = express.Router();
const { getAllRoadmaps, getPopularRoadmaps, getRoadmapBySlug } = require('../controllers/roadmapController');

router.get('/popular', getPopularRoadmaps);
router.get('/', getAllRoadmaps);
router.get('/:slug', getRoadmapBySlug);

module.exports = router;
