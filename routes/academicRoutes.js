const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

router.get('/academicdashboard', academicController.getacademicDashboard);



router.post('/submitAccidental', academicController.submitAccidental);
router.post('/submitMedical', academicController.submitMedical);
router.post('/submitUnpaid', academicController.submitUnpaid);
router.post('/submitCompensation', academicController.submitCompensation);

router.post('/approveUnpaid', academicController.approveUnpaid);
router.post('/approveAnnual', academicController.approveAnnual);

router.post('/evaluateEmployee', academicController.evaluateEmployee);


module.exports = router;
