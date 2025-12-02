const hrService = require('../services/hrService');

exports.getHrDashboard = async (req, res) => {
    if (!req.session.isLoggedIn || req.session.user.role !== 'hr') {
        req.flash('error', 'Please log in as HR to access the dashboard');
        return res.redirect('/');
    }
    const acanrequests = await hrService.getAnAccRequests(parseInt(req.session.user.id, 10)) || [];
    const unpaidrequests = await hrService.getUnpaidRequests(parseInt(req.session.user.id, 10)) || [];
    const comprequests = await hrService.getCompRequests(parseInt(req.session.user.id, 10)) || [];
    console.log('reqs'+ acanrequests);
    res.render('hrdashboard', {
        title: 'HR Dashboard',
        user: req.session.user,
        acanrequests: acanrequests,
        data: req.session.user.data
    });
};
exports.HR_approval_an_acc = async (req, res) => {
    const request_ID = parseInt(req.body.request_ID, 10);
    const HR_ID = parseInt(req.session.user.id, 10);
    const result = await hrService.HR_approval_an_acc(request_ID, HR_ID);
    req.flash('success', 'Accidental leave request processed successfully');
    res.redirect('/hr/hrdashboard');
};
exports.HR_approval_unpaid = async (req, res) => {
    const request_ID = parseInt(req.body.request_ID, 10);
    const HR_ID = parseInt(req.session.user.id, 10);
    const result = await hrService.HR_approval_unpaid(request_ID, HR_ID);
    req.flash('success', 'Accidental leave request processed successfully');
    res.redirect('/hr/hrdashboard');
};
