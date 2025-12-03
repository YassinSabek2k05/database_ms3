const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');

router.get('/hrdashboard', hrController.getHrDashboard);
router.post('/approve_an_ac_leave', hrController.HR_approval_an_acc);
router.post('/approve_unpaid_leave', hrController.HR_approval_unpaid);
router.post('/approve_comp_leave', hrController.HR_approval_comp);
router.post('/deduct_hours', hrController.Deduction_hours);
router.post('/deduct_days', hrController.Deduction_days);
router.post('/deduct_unpaid', hrController.Deduction_unpaid);
router.post('/generate_payroll', hrController.Add_Payroll);
module.exports = router;