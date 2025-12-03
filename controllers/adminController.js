const adminService = require('../services/adminService');

exports.getAdminDashboard = async (req, res) => {
    if (!req.session.isLoggedIn || req.session.user.role !== 'admin') {
        req.flash('error', 'Please log in as Admin to access the dashboard');
        return res.redirect('/');
    }
    const attendanceData = await adminService.getYesterdayAttendance() || [];
    const performanceData = await adminService.getWinterPerformance() || [];
    const allEmployees = await adminService.getAllEmployeeProfiles() || [];
    res.render('admindashboard', {
        title: 'Admin Dashboard',
        user: req.session.user,
        attendanceData: attendanceData.data || [],
        performanceData: performanceData.data || [],
        allEmployees: allEmployees.data || [],
        attendanceCount: attendanceData.count || 0,
        performanceCount: performanceData.count || 0
    });
};

// 1. Get yesterday attendance
exports.getYesterdayAttendance = async (req, res) => {
    try {
        const result = await adminService.getYesterdayAttendance();
        
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(200).json(result);
        } else {
            res.render('admin/attendance-yesterday', {
                title: 'Yesterday Attendance',
                user: req.session.user,
                attendanceData: result.data || [],
                count: result.count || 0
            });
        }
    } catch (err) {
        console.error('Error getting yesterday attendance:', err);
        
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({ error: "Internal Server Error" });
        } else {
            req.flash('error', 'Error fetching yesterday attendance');
            res.redirect('/admin/dashboard');
        }
    }
};

// 2. Get winter performance
exports.getWinterPerformance = async (req, res) => {
    try {
        const result = await adminService.getWinterPerformance();
        
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(200).json(result);
        } else {
            res.render('admin/winter-performance', {
                title: 'Winter Performance',
                user: req.session.user,
                performanceData: result.data || [],
                count: result.count || 0
            });
        }
    } catch (err) {
        console.error('Error getting winter performance:', err);
        
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({ error: "Internal Server Error" });
        } else {
            req.flash('error', 'Error fetching winter performance');
            res.redirect('/admin/dashboard');
        }
    }
};

// 3. Remove holiday attendance
exports.removeHolidayAttendance = async (req, res) => {
    try {
        await adminService.removeHolidayAttendance();
        req.flash('success', 'Holiday attendance removed successfully');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error removing holiday attendance:', err);
        req.flash('error', 'Error removing holiday attendance');
        res.redirect('/admin/dashboard');
    }
};

// 4. Remove unattended dayoff
exports.removeUnattendedDayoff = async (req, res) => {
    try {
        const employee_id = parseInt(req.body.employee_id, 10);
        
        if (!employee_id) {
            req.flash('error', 'Employee ID is required');
            return res.redirect('/admin/dashboard');
        }
        
        await adminService.removeUnattendedDayoff(employee_id);
        req.flash('success', 'Unattended dayoff removed successfully');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error removing unattended dayoff:', err);
        req.flash('error', 'Error removing unattended dayoff');
        res.redirect('/admin/dashboard');
    }
};

// 5. Remove approved leaves
exports.removeApprovedLeaves = async (req, res) => {
    try {
        const employee_id = parseInt(req.body.employee_id, 10);
        
        if (!employee_id) {
            req.flash('error', 'Employee ID is required');
            return res.redirect('/admin/dashboard');
        }
        
        await adminService.removeApprovedLeaves(employee_id);
        req.flash('success', 'Approved leaves removed successfully');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error removing approved leaves:', err);
        req.flash('error', 'Error removing approved leaves');
        res.redirect('/admin/dashboard');
    }
};

// 6. Replace employee
exports.replaceEmployee = async (req, res) => {
    try {
        const old_employee_id = parseInt(req.body.old_employee_id, 10);
        const new_employee_id = parseInt(req.body.new_employee_id, 10);
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        
        if (!old_employee_id || !new_employee_id || !start_date || !end_date) {
            req.flash('error', 'All fields are required');
            return res.redirect('/admin/dashboard');
        }
        
        await adminService.replaceEmployee(old_employee_id, new_employee_id, start_date, end_date);
        req.flash('success', 'Employee replaced successfully');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error replacing employee:', err);
        req.flash('error', 'Error replacing employee');
        res.redirect('/admin/dashboard');
    }
};

// 7. Update employment status
exports.updateEmploymentStatus = async (req, res) => {
    try {
        await adminService.updateEmploymentStatus();
        req.flash('success', 'Employment status updated successfully');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error updating employment status:', err);
        req.flash('error', 'Error updating employment status');
        res.redirect('/admin/dashboard');
    }
};

// Admin login
exports.authAdmin = async (req, res) => {
    try {
        const bool = await adminService.authAdmin(parseInt(req.body.userid, 10), req.body.password);
        
        if (bool[0] && bool[0].success) {
            const data = await adminService.getAdminData(parseInt(req.body.userid, 10));
            
            req.session.user = {
                id: req.body.userid,
                role: 'admin',
                name: 'Admin'
            };
            req.session.isLoggedIn = true;
            req.flash('success', 'Logged in successfully as Admin');
            return res.redirect('/admin/dashboard');
        } else {
            req.session.isLoggedIn = false;
            req.flash('error', 'Invalid admin credentials');
            return res.redirect('/');
        }
    } catch (err) {
        console.error('Error in admin login:', err);
        req.flash('error', 'Login error');
        res.redirect('/');
    }
};