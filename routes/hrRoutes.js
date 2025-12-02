const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');

router.get('/hrdashboard', hrController.getHrDashboard);

module.exports = router;