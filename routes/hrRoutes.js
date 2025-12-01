const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');

router.get('/employees', hrController.getAllEmployees);

module.exports = router;