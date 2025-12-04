const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

router.get('/academicdashboard1', academicController.getacademicDashboard1);
router.get('/academicdashboard2', academicController.getacademicDashboard2);

// PART 1 - ACADEMIC EMPLOYEE ROUTES
router.post('/get-performance', academicController.getPerformance);
router.post('/get-attendance', academicController.getAttendance);
router.post('/get-payroll', academicController.getPayroll);
router.post('/get-deductions', academicController.getDeductions);
router.post('/submit-annual', academicController.submitAnnual);
router.post('/get-leave-status', academicController.getLeaveStatus);

router.post('/submitAccidental', academicController.submitAccidental);
router.post('/submitMedical', academicController.submitMedical);
router.post('/submitUnpaid', academicController.submitUnpaid);
router.post('/submitCompensation', academicController.submitCompensation);

router.post('/approveUnpaid', academicController.approveUnpaid);
router.post('/approveAnnual', academicController.approveAnnual);

router.post('/evaluateEmployee', academicController.evaluateEmployee);


module.exports = router;
