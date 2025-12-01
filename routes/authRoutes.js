const express = require('express');
const router = express.Router();
const authContoller = require('../controllers/authController');

router.post('/hrlogin', authContoller.authHr);
router.post('/adminlogin', authContoller.authAdmin);
router.post('/academiclogin', authContoller.authAcademic);

module.exports = router;