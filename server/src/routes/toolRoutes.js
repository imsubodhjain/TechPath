const express = require('express');
const router = express.Router();
const { getAllTools, getToolBySlug, getCategories } = require('../controllers/toolController');

router.get('/categories', getCategories);
router.get('/', getAllTools);
router.get('/:slug', getToolBySlug);

module.exports = router;
