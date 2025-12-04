const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
//navigation
router.get('/dashboard1', adminController.getAdminDashboard1);
router.get('/dashboard2', adminController.getAdminDashboard2);

// Dashboard
router.get('/yesterday-attendance', adminController.getYesterdayAttendance);
router.get('/winter-performance', adminController.getWinterPerformance);
router.post('/remove-holiday-attendance', adminController.removeHolidayAttendance);
router.post('/remove-unattended-dayoff', adminController.removeUnattendedDayoff);
router.post('/remove-approved-leaves', adminController.removeApprovedLeaves);
router.post('/replace-employee', adminController.replaceEmployee);
router.post('/update-employment-status', adminController.updateEmploymentStatus);
module.exports = router;