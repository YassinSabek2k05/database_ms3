const hrService = require('../services/hrService');

exports.getHrDashboard = async (req, res) => {
    if (!req.session.isLoggedIn || req.session.user.role !== 'hr') {
        req.flash('error', 'Please log in as HR to access the dashboard');
        return res.redirect('/');
    }
    const acanrequests = await hrService.getAnAccRequests(parseInt(req.session.user.id, 10)) || [];
    console.log('reqs'+ acanrequests);
    res.render('hrdashboard', {
        title: 'HR Dashboard',
        user: req.session.user,
        acanrequests: acanrequests
    });
};