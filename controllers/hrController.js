const hrService = require('../services/hrService');

exports.getHrDashboard = async (req, res) => {
    if (!req.session.isLoggedIn || req.session.user.role !== 'hr') {
        req.flash('error', 'Please log in as HR to access the dashboard');
        return res.redirect('/');
    }
    const acanrequests = await hrService.getAnAccRequests(parseInt(req.session.user.id, 10)) || [];
    const unpaidrequests = await hrService.getUnpaidRequests(parseInt(req.session.user.id, 10)) || [];
    const comprequests = await hrService.getCompRequests(parseInt(req.session.user.id, 10)) || [];
    res.render('hrdashboard', {
        title: 'HR Dashboard',
        user: req.session.user,
        acanrequests: acanrequests,
        unpaidrequests: unpaidrequests,
        comprequests: comprequests,
        data: req.session.user.data
    });
};
exports.HR_approval_an_acc = async (req, res) => {
    try {
        const request_ID = parseInt(req.body.request_ID, 10);
        const HR_ID = parseInt(req.session.user.id, 10);
        
        if (!request_ID || !HR_ID) {
            req.flash('error', 'Invalid request ID or HR ID');
            return res.redirect('/hr/hrdashboard');
        }
        
        const result = await hrService.HR_approval_an_acc(request_ID, HR_ID);
        req.flash('success', 'Accidental leave request processed successfully');
        res.redirect('/hr/hrdashboard');
    } catch (err) {
        console.error('Error approving accidental leave:', err);
        req.flash('error', 'Error processing request');
        res.redirect('/hr/hrdashboard');
    }
};
exports.HR_approval_unpaid = async (req, res) => {
    try {
        const request_ID = parseInt(req.body.request_ID, 10);
        const HR_ID = parseInt(req.session.user.id, 10);
        
        if (!request_ID || !HR_ID) {
            req.flash('error', 'Invalid request ID or HR ID');
            return res.redirect('/hr/hrdashboard');
        }
        
        const result = await hrService.HR_approval_unpaid(request_ID, HR_ID);
        req.flash('success', 'Unpaid leave request processed successfully');
        res.redirect('/hr/hrdashboard');
    } catch (err) {
        console.error('Error approving unpaid leave:', err);
        req.flash('error', 'Error processing request');
        res.redirect('/hr/hrdashboard');
    }
};
exports.HR_approval_comp = async (req, res) => {
    try {
        const request_ID = parseInt(req.body.request_ID, 10);
        const HR_ID = parseInt(req.session.user.id, 10);
        
        if (!request_ID || !HR_ID) {
            req.flash('error', 'Invalid request ID or HR ID');
            return res.redirect('/hr/hrdashboard');
        }
        console.log(request_ID, HR_ID);
        const result = await hrService.HR_approval_comp(request_ID, HR_ID);
        req.flash('success', 'Compensatory leave request processed successfully');
        res.redirect('/hr/hrdashboard');
    } catch (err) {
        console.error('Error approving compensatory leave:', err);
        req.flash('error', 'Error processing request');
        res.redirect('/hr/hrdashboard');
    }
}
exports.Deduction_hours = async (req, res) => {
    await hrService.Deduction_hours(parseInt(req.body.employee_id, 10));
    req.flash('success', 'Deduction of missing hours processed successfully');
    res.redirect('/hr/hrdashboard');
};
exports.Deduction_days = async (req, res) => {
    await hrService.Deduction_days(parseInt(req.body.employee_id, 10));
    req.flash('success', 'Deduction of missing days processed successfully');
    res.redirect('/hr/hrdashboard');
};
exports.Deduction_unpaid = async (req, res) => {
    await hrService.Deduction_unpaid(parseInt(req.body.employee_id, 10));
    req.flash('success', 'Deduction of unpaid leave processed successfully');
    res.redirect('/hr/hrdashboard');
};  
exports.Add_Payroll = async (req, res) => {
    await hrService.Add_Payroll(parseInt(req.body.employee_id, 10), req.body.from_date, req.body.to_date);
    req.flash('success', 'Payroll generated successfully');
    res.redirect('/hr/hrdashboard');
};