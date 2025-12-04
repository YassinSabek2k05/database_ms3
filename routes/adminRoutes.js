const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
//navigation
router.get('/dashboard1', adminController.getAdminDashboard1);
router.get('/dashboard2', adminController.getAdminDashboard2);

// Dashboard
router.get('/yesterday-attendance', adminController.getYesterdayAttendance);
router.get('/winter-performance', adminController.getWinterPerformance);
router.post('/remove-holiday', adminController.removeHolidayAttendance);
router.post('/remove-dayoff', adminController.removeUnattendedDayoff);
router.post('/remove-approved-leaves', adminController.removeApprovedLeaves);
router.post('/replace-employee', adminController.replaceEmployee);
router.post('/update-status', adminController.updateEmploymentStatus);


//malak admin component part 1
router.post('/remove-deductions', adminController.Remove_Deductions);
router.post('/update_attendance', adminController.Update_Attendance);
router.post('/add_holiday', adminController.Add_holiday);
router.post('/initiate_attendance', adminController.Initiate_Attendance);
router.get('/allRejectedMedicals', adminController.allRejectedMedicals);
router.get('/allEmployeeProfiles', adminController.allEmployeeProfiles);
router.get('/NoEmployeeDept', adminController.NoEmployeeDept);
        

module.exports = router;