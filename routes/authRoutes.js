const express = require('express');
const router = express.Router();
const authContoller = require('../controllers/authController');

router.post('/hrlogin', authContoller.authHr);

module.exports = router;