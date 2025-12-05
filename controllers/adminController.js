const adminService = require('../services/adminService');
const navItems = [
    { name: 'Part 1', link: '/admin/dashboard1' },
    { name: 'Part 2', link: '/admin/dashboard2' }
];

exports.getAdminDashboard1 = async (req, res) => {
    if (!req.session.isLoggedIn || req.session.user.role !== 'admin') {
        req.flash('error', 'Please log in as Admin to access this dashboard');
        return res.redirect('/');
    }

    let employees = [];
    let empInDep = [];
    let rejectedMed = []
    let error = null;

    try {
        employees = await adminService.allEmployeeProfiles() || [];
        empInDep = await adminService.NoEmployeeDept() || [];
        rejectedMed = await adminService.allRejectedMedicals() || [];
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        error = 'Failed to load employee data due to a server error.';
    }
    
    res.render('admindashboard1', {
        title: 'Admin Dashboard',
        user: req.session.user,
        employees: employees,
        empInDep: empInDep,
        rejectedMed: rejectedMed,
        data: req.session.user.data,
        navItems: [...navItems, {index:0}],
        error: error 
    });
};
exports.getAdminDashboard2 = async (req, res) => {
    if (!req.session.isLoggedIn || req.session.user.role !== 'admin') {
        req.flash('error', 'Please log in as Admin to access the dashboard');
        return res.redirect('/');
    }
    const attendanceData = await adminService.getYesterdayAttendance() || [];
    const performanceData = await adminService.getWinterPerformance() || [];
    const allEmployees = await adminService.getAllEmployeeProfiles() || [];
    
    res.render('admindashboard2', {
        title: 'Admin Dashboard',
        user: req.session.user,
        attendanceData: attendanceData || [],
        performanceData: performanceData || [],
        allEmployees: allEmployees || [],
        navItems: [...navItems, {index:1}]
    });
};
//malak admin component part 1
// Admin login
exports.authAdmin = async (req, res) => {
    try {
        const bool = await adminService.authAdmin(parseInt(req.body.userid, 10), req.body.password);
        
        if (bool[0] && bool[0].success) {
            req.session.user = {
                id: req.body.userid,
                role: 'admin',
                name: 'Admin'
            };
            req.session.isLoggedIn = true;
            req.flash('success', 'Logged in successfully as Admin');
            return res.redirect('/admin/dashboard1');
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
//2
exports.allEmployeeProfiles = async (req, res) => {
    try {
        const result = await adminService.allEmployeeProfiles();
        return result;  
    } catch (error) {
        throw error;
    }
};


//3
exports.NoEmployeeDept = async (req, res) => {
    try {
        const result = await adminService.NoEmployeeDept();

        return result;
    } catch (error) {
        console.error("Error in NoEmployeeDept:", error);
        req.flash('error', 'Failed to fetch number of employees per department');
        res.redirect('/admin/dashboard1');
    }
};


//4
exports.allRejectedMedicals = async (req, res) => {
    try {
        const result = await adminService.allRejectedMedicals();

        req.flash('success', 'All rejected medical leaves fetched successfully');
        res.render('admindashboard', {
            rejectedMed: result,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error("Error in allRejectedMedicals:", error);
        req.flash('error', 'Failed to fetch rejected medical leaves ');
        res.redirect('/admin/dashboard1');
    }
};

//5
exports.Remove_Deductions = async (req, res) => {
    try {
        await adminService.Remove_Deductions();
        req.flash('success', 'Deductions removed successfully!');
        res.redirect('/admin/dashboard1');
    } catch (error) {
        req.flash('error', 'Failed to remove deductions');
        res.redirect('/admin/dashboard1');
    }
};

//6
exports.Update_Attendance = async (req, res) => {
    try {
        await adminService.Update_Attendance(parseInt(req.body.employee_id, 10), req.body.check_in_time, req.body.check_out_time);
        req.flash('success', 'Attendance updated successfully');
        res.redirect('/admin/dashboard1');
    } catch (error) {
        console.error("Error updating attendance:", error);
        req.flash('error', 'Failed to update attendance');
        res.redirect('/admin/dashboard1');
    }
};

//7
exports.Add_holiday = async (req, res) => {
    try {
        await adminService.Add_holiday(req.body.holiday_name, req.body.from_date, req.body.to_date); 
        req.flash('success', 'Holiday generated successfully');
        res.redirect('/admin/dashboard1');
    } catch (error) {
        console.error("Error adding holiday:", error);
        req.flash('error', 'Failed to generate holiday');
        res.redirect('/admin/dashboard1');
    }
};

//8
exports.Initiate_Attendance = async (req, res) => {
    try {
        await adminService.Initiate_Attendance();
        req.flash('success', 'Attendance initiated successfully!');
        res.redirect('/admin/dashboard1');
    } catch (error) {
        req.flash('error', 'Failed to initiate attendance');
        res.redirect('/admin/dashboard1');
    }
};
//raghad admin component part 2
// 1. Get yesterday attendance
exports.getYesterdayAttendance = async (req, res) => {
    try {
        const result = await adminService.getYesterdayAttendance();
        return result;
    } catch (err) {
        req.flash('error', 'Error fetching yesterday attendance');
        res.redirect('/admin/dashboard2');
    }
};

// 2. Get winter performance
exports.getWinterPerformance = async (req, res) => {
    try {
        const result = await adminService.getWinterPerformance();
        return result;
    } catch (err) {
        req.flash('error', 'Error fetching winter performance');
        res.redirect('/admin/dashboard2');
    }
};

// 3. Remove holiday attendance
exports.removeHolidayAttendance = async (req, res) => {
    try {
        await adminService.removeHolidayAttendance();
        req.flash('success', 'Holiday attendance removed successfully');
        res.redirect('/admin/dashboard2');
    } catch (err) {
        console.error('Error removing holiday attendance:', err);
        req.flash('error', 'Error removing holiday attendance');
        res.redirect('/admin/dashboard2');
    }
};

// 4. Remove unattended dayoff
exports.removeUnattendedDayoff = async (req, res) => {
    try {
        const employee_id = parseInt(req.body.employee_id, 10);
        
        if (!employee_id) {
            req.flash('error', 'Employee ID is required');
            return res.redirect('/admin/dashboard2');
        }
        
        await adminService.removeUnattendedDayoff(employee_id);
        req.flash('success', 'Unattended dayoff removed successfully');
        res.redirect('/admin/dashboard2'); 
    } catch (err) {
        console.error('Error removing unattended dayoff:', err);
        req.flash('error', 'Error removing unattended dayoff');
        res.redirect('/admin/dashboard2');
    }
};

// 5. Remove approved leaves
exports.removeApprovedLeaves = async (req, res) => {
    try {
        const employee_id = parseInt(req.body.employee_id, 10);
        
        if (!employee_id) {
            req.flash('error', 'Employee ID is required');
            return res.redirect('/admin/dashboard2');
        }
        
        await adminService.removeApprovedLeaves(employee_id);
        req.flash('success', 'Approved leaves removed successfully');
        res.redirect('/admin/dashboard2');
    } catch (err) {
        console.error('Error removing approved leaves:', err);
        req.flash('error', 'Error removing approved leaves');
        res.redirect('/admin/dashboard2');
    }
};

// 6. Replace employee
exports.replaceEmployee = async (req, res) => {
    try {
        const old_employee_id = parseInt(req.body.Emp1_ID, 10);
        const new_employee_id = parseInt(req.body.Emp2_ID, 10);
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        
        if (!old_employee_id || !new_employee_id || !start_date || !end_date) {
            req.flash('error', 'All fields are required');
            return res.redirect('/admin/dashboard2');
        }
        
        await adminService.replaceEmployee(old_employee_id, new_employee_id, start_date, end_date);
        req.flash('success', 'Employee replaced successfully');
        res.redirect('/admin/dashboard2');
    } catch (err) {
        console.error('Error replacing employee:', err);
        req.flash('error', 'Error replacing employee');
        res.redirect('/admin/dashboard2');
    }
};

// 7. Update employment status
exports.updateEmploymentStatus = async (req, res) => {
    try {
        await adminService.updateEmploymentStatus(parseInt(req.body.Employee_ID, 10));
        req.flash('success', 'Employment status updated successfully');
        res.redirect('/admin/dashboard2');
    } catch (err) {
        console.error('Error updating employment status:', err);
        req.flash('error', 'Error updating employment status');
        res.redirect('/admin/dashboard2');
    }
};

