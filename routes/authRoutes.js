const express = require('express');
const router = express.Router();
const authContoller = require('../controllers/authController');

router.post('/hrlogin', authContoller.authHr);
router.post('/adminlogin', authContoller.authAdmin);
router.post('/academiclogin', authContoller.authAcademic);
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('An error occurred while logging out.');
        }
        res.redirect('/');
    });
});

module.exports = router;