const academicService = require('../services/academicService');
const navItems = [
    { name: 'Part 1', link: '/academic/academicdashboard1' },
    { name: 'Part 2', link: '/academic/academicdashboard2' }
];
// Helper to check for Dean, President, or Vice-dean role
const isUpperBoard = (user) => {
    if (!user) return false;
    // Check primary role or roles array
    const roles = user.roles || [];
    const primaryRole = user.role || '';
    return primaryRole === 'Dean' || 
           primaryRole === 'President' || 
           primaryRole === 'Vice-dean' ||
           roles.includes('Dean') ||
           roles.includes('President') ||
           roles.includes('Vice Dean');
};

exports.getacademicDashboard2 = async (req, res) => {
    try {
        // Check authentication
        const allowedRoles = ['academic', 'Dean', 'President', 'Vice-dean'];
        if (!req.session.isLoggedIn || !req.session.user || !allowedRoles.includes(req.session.user.role)) {
            req.flash('error', 'Please log in as Academic Staff to access the dashboard');
            return res.redirect('/');
        }

        const user = req.session.user;
        const canApprove = isUpperBoard(user);
        const isDean = user.role === 'Dean' || (user.roles && user.roles.includes('Dean'));

        // Load data
        let myLeaveStatuses = [];
        let pendingUnpaidLeaves = [];
        let pendingAnnualLeaves = [];
        let departmentEmployees = [];

        // Load leave statuses
        try {
            myLeaveStatuses = await academicService.getMyLeaveStatuses(user.id);
        } catch (err) {
            console.error('Error loading leave statuses:', err);
        }

        // Merge with recently submitted leaves from session
        if (req.session.recentLeaves && req.session.recentLeaves.length > 0) {
            const existingIds = new Set(myLeaveStatuses.map(l => l.request_ID));
            const newLeaves = req.session.recentLeaves.filter(l => !existingIds.has(l.request_ID));
            myLeaveStatuses = [...newLeaves, ...myLeaveStatuses].sort((a, b) => {
                const dateA = new Date(a.date_of_request || 0);
                const dateB = new Date(b.date_of_request || 0);
                return dateB - dateA;
            });
        }

        if (canApprove) {
            try {
                pendingUnpaidLeaves = await academicService.getPendingUnpaidLeaves();
            } catch (err) {
                console.error('Error loading pending unpaid leaves:', err);
            }

            try {
                pendingAnnualLeaves = await academicService.getPendingAnnualLeaves();
            } catch (err) {
                console.error('Error loading pending annual leaves:', err);
            }
        }

        if (isDean) {
            try {
                const deptName = user.dept_name || user.department;
                if (deptName) {
                    departmentEmployees = await academicService.getDepartmentEmployees(deptName);
                }
            } catch (err) {
                console.error('Error loading department employees:', err);
            }
        }

        res.render('academicdashboard', {
            title: 'Academic Dashboard',
            user,
            canApproveLeaves: canApprove,
            canEvaluate: isDean,
            myLeaveStatuses,
            pendingUnpaidLeaves,
            pendingAnnualLeaves,
            departmentEmployees,
            myPerformance: [],
            myAttendance: [],
            lastMonthPayroll: [],
            myDeductions: [],
            navItems: [...navItems, {index:1}]
        });
    } catch (error) {
        console.error('Error rendering academic dashboard:', error);
        req.flash('error', 'An error occurred while loading the dashboard');
        res.redirect('/');
    }
};

// Requirement 1: Apply for an accidental leave.
exports.submitAccidental = async (req, res) => {
    try {
        if (!req.session.isLoggedIn || !req.session.user) {
            req.flash('error', 'Please log in to submit leave requests');
            return res.redirect('/');
        }
        
        const employee_ID = parseInt(req.session.user.id, 10);
        const { start_date, end_date } = req.body;

        await academicService.submitAccidental(employee_ID, start_date, end_date);

        // Add to recent leaves in session
        if (!req.session.recentLeaves) {
            req.session.recentLeaves = [];
        }
        req.session.recentLeaves.push({
            request_ID: Date.now(), // Temporary ID
            date_of_request: new Date(),
            final_approval_status: 'Pending'
        });

        req.flash('success', 'Accidental Leave submitted successfully. Status is pending.');
        res.redirect('/academic/academicdashboard2');
    } catch (error) {
        console.error('Error submitting Accidental Leave:', error);
        req.flash('error', `Accidental Leave Submission failed`);
        res.redirect('/academic/academicdashboard2');
    }
};

// Requirement 2: Apply for a medical leave.
exports.submitMedical = async (req, res) => {
    try {
        if (!req.session.isLoggedIn || !req.session.user) {
            req.flash('error', 'Please log in to submit leave requests');
            return res.redirect('/');
        }
        
        const employee_ID = parseInt(req.session.user.id, 10);
        const { start_date, end_date, type, insurance_status, disability_details, document_description, file_name } = req.body;

        const insuranceStatusInt = insurance_status === '1' ? 1 : 0;

        await academicService.submitMedical(
            employee_ID,
            start_date,
            end_date,
            type,
            insuranceStatusInt,
            disability_details,
            document_description,
            file_name
        );

        // Add to recent leaves in session
        if (!req.session.recentLeaves) {
            req.session.recentLeaves = [];
        }
        req.session.recentLeaves.push({
            request_ID: Date.now(),
            date_of_request: new Date(),
            final_approval_status: 'Pending'
        });

        req.flash('success', 'Medical Leave submitted successfully. Status is pending.');
        res.redirect('/academic/academicdashboard2');
    } catch (error) {
        console.error('Error submitting Medical Leave:', error);
        req.flash('error', `Medical Leave Submission failed`);
        res.redirect('/academic/academicdashboard2');
    }
};

// Requirement 3: Apply for unpaid leave.
exports.submitUnpaid = async (req, res) => {
    try {
        if (!req.session.isLoggedIn || !req.session.user) {
            req.flash('error', 'Please log in to submit leave requests');
            return res.redirect('/');
        }
        
        const employee_ID = parseInt(req.session.user.id, 10);
        const { start_date, end_date, document_description, file_name } = req.body;

        await academicService.submitUnpaid(employee_ID, start_date, end_date, document_description, file_name);

        // Add to recent leaves in session
        if (!req.session.recentLeaves) {
            req.session.recentLeaves = [];
        }
        req.session.recentLeaves.push({
            request_ID: Date.now(),
            date_of_request: new Date(),
            final_approval_status: 'Pending'
        });

        req.flash('success', 'Unpaid Leave submitted successfully. Requires Dean and HR approval.');
        res.redirect('/academic/academicdashboard2');
    } catch (error) {
        console.error('Error submitting Unpaid Leave:', error);
        req.flash('error', `Unpaid Leave Submission failed`);
        res.redirect('/academic/academicdashboard2');
    }
};

// Requirement 4: Apply for a compensation leave.
exports.submitCompensation = async (req, res) => {
    try {
        if (!req.session.isLoggedIn || !req.session.user) {
            req.flash('error', 'Please log in to submit leave requests');
            return res.redirect('/');
        }
        
        const employee_ID = parseInt(req.session.user.id, 10);
        const replacement_emp = parseInt(req.body.replacement_emp, 10);

        if (!replacement_emp) {
            req.flash('error', 'Invalid Replacement Employee ID.');
            return res.redirect('/academic/academicdashboard2');
        }

        await academicService.submitCompensation(
            employee_ID,
            req.body.compensation_date,
            req.body.reason,
            req.body.date_of_original_workday_date,
            replacement_emp
        );

        // Add to recent leaves in session
        if (!req.session.recentLeaves) {
            req.session.recentLeaves = [];
        }
        req.session.recentLeaves.push({
            request_ID: Date.now(),
            date_of_request: new Date(),
            final_approval_status: 'Pending'
        });

        req.flash('success', 'Compensation Leave submitted successfully.');
        res.redirect('/academic/academicdashboard2');
    } catch (error) {
        console.error('Error submitting Compensation Leave:', error);
        req.flash('error', `Compensation Leave Submission failed`);
        res.redirect('/academic/academicdashboard2');
    }
};

// Requirement 5: Approve/reject unpaid leaves (Upper Board function).
exports.approveUnpaid = async (req, res) => {

    if (!isUpperBoard(req.session.user)) {
        req.flash('error', 'Unauthorized access. Only Dean/President can approve leaves.');
        return res.redirect('/academic/academicdashboard2');
    }

    try {
        const Upperboard_ID = parseInt(req.session.user.id, 10);
        const request_ID = parseInt(req.body.request_id, 10);

        if (!request_ID) {
            req.flash('error', 'Invalid Request ID.');
            return res.redirect('/academic/academicdashboard2');
        }

        await academicService.approveUnpaid(request_ID, Upperboard_ID);

        req.flash('success', 'Unpaid Leave Request processed successfully.');
        res.redirect('/academic/academicdashboard2');
    } catch (error) {
        console.error('Error processing Unpaid Leave:', error);
        req.flash('error', `Processing Unpaid Leave failed`);
        res.redirect('/academic/academicdashboard2');
    }
};

// Requirement 6: Approve/reject annual leaves (Upper Board function).
exports.approveAnnual = async (req, res) => {

    if (!isUpperBoard(req.session.user)) {
        req.flash('error', 'Unauthorized access. Only Dean/President can approve leaves.');
        return res.redirect('/academic/academicdashboard2');
    }

    try {
        const Upperboard_ID = parseInt(req.session.user.id, 10);
        const request_ID = parseInt(req.body.request_id, 10);
        const replacement_ID = parseInt(req.body.replacement_ID, 10);

        if (!request_ID || !replacement_ID) {
            req.flash('error', 'Invalid Request ID or Replacement ID.');
            return res.redirect('/academic/academicdashboard2');
        }

        await academicService.approveAnnual(request_ID, Upperboard_ID, replacement_ID);

        req.flash('success', 'Annual Leave Request processed successfully .');
        res.redirect('/academic/academicdashboard2');
    } catch (error) {
        console.error('Error processing Annual Leave:', error);
        req.flash('error', `Processing Annual Leave failed`);
        res.redirect('/academic/academicdashboard2');
    }
};

// Requirement 7: Evaluate employees within the same department (Dean role).
exports.evaluateEmployee = async (req, res) => {
    const user = req.session.user;
    const isDean = user.role === 'Dean' || (user.roles && user.roles.includes('Dean'));
    
    if (!isDean) {
        req.flash('error', 'Only the Dean can evaluate employees.');
        return res.redirect('/academic/academicdashboard2');
    }

    try {
        const employee_ID = parseInt(req.body.employee_id, 10);
        const rating = parseInt(req.body.rating, 10);
        const comment = req.body.comment || null;
        const semester = req.body.semester;

        if (!employee_ID || !rating || !semester) {
            req.flash('error', 'Missing evaluation data.');
            return res.redirect('/academic/academicdashboard2');
        }

        // The stored proc Dean_andHR_Evaluation expects (employee_ID, rating, comment, semester).
        // academicService will call it with the correct parameters.
        await academicService.evaluateEmployee(employee_ID, rating, comment, semester);

        req.flash('success', `Evaluation submitted successfully.`);
        res.redirect('/academic/academicdashboard2');

    } catch (error) {
        console.error("Evaluation Error:", error);
        req.flash('error', 'Failed to submit evaluation.');
        res.redirect('/academic/academicdashboard2');
    }
};


exports.getacademicDashboard1 = async (req, res) => {
    console.log('Accessing academic dashboard 1');
    try {
        // Check authentication
        const allowedRoles = ['academic', 'Dean', 'President', 'Vice-dean'];
        if (!req.session.isLoggedIn || !req.session.user || !allowedRoles.includes(req.session.user.role)) {
            req.flash('error', 'Please log in as Academic Staff to access the dashboard');
            return res.redirect('/');
        }

        const user = req.session.user;
        const employeeId = user.id;

        const myPerformance = await academicService.getMyPerformance(employeeId, 'W25');
        const myAttendance = await academicService.getMyAttendance(employeeId);
        const lastMonthPayroll = await academicService.getLastMonthPayrollForEmployee(employeeId);
        const month = new Date().getMonth() + 1;
        const myDeductions = await academicService.getDeductionsByAttendance(employeeId, month);
        const myLeaveStatuses = await academicService.getMyLeaveStatus(employeeId);

        console.log('myattendance:');
        res.render('academicdashboard1', {
            title: 'Academic Dashboard',
            user,
            navItems: [...navItems, {index:0}],
            myPerformance,
            myAttendance,
            lastMonthPayroll,
            myDeductions,
            myLeaveStatuses,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error rendering academic dashboard:', error);
        req.flash('error', 'An error occurred while loading the dashboard');
        res.redirect('/');
    }
};

// PART 1 - ACADEMIC EMPLOYEE ENDPOINTS

// 1. Get performance for a specific semester
exports.getPerformance = async (req, res) => {
    try {
        const semester = req.body.semester || req.query.semester;
        if (!semester) {
            req.flash('error', 'Please select a semester');
            return res.redirect('/academic/academicdashboard1');
        }
        req.flash('success', 'Performance data loaded successfully');
        res.redirect('/academic/academicdashboard1');
    } catch (error) {
        console.error('Error fetching performance:', error);
        req.flash('error', 'Failed to fetch performance data');
        res.redirect('/academic/academicdashboard1');
    }
};

// 2. Get attendance records for current month
exports.getAttendance = async (req, res) => {
    try {
        req.flash('success', 'Attendance records loaded successfully');
        res.redirect('/academic/academicdashboard1');
    } catch (error) {
        console.error('Error fetching attendance:', error);
        req.flash('error', 'Failed to fetch attendance records');
        res.redirect('/academic/academicdashboard1');
    }
};

// 3. Get last month's payroll
exports.getPayroll = async (req, res) => {
    try {
        req.flash('success', 'Payroll data loaded successfully');
        res.redirect('/academic/academicdashboard1');
    } catch (error) {
        console.error('Error fetching payroll:', error);
        req.flash('error', 'Failed to fetch payroll data');
        res.redirect('/academic/academicdashboard1');
    }
};

// 4. Get deductions caused by attendance issues
exports.getDeductions = async (req, res) => {
    try {
        const month = req.body.month ? parseInt(req.body.month, 10) : new Date().getMonth() + 1;
        req.flash('success', 'Deduction data loaded successfully');
        res.redirect('/academic/academicdashboard1');
    } catch (error) {
        console.error('Error fetching deductions:', error);
        req.flash('error', 'Failed to fetch deduction data');
        res.redirect('/academic/academicdashboard1');
    }
};

// 5. Submit annual leave request
exports.submitAnnual = async (req, res) => {
    try {
        if (!req.session.isLoggedIn || !req.session.user) {
            req.flash('error', 'Please log in to submit leave requests');
            return res.redirect('/');
        }

        const employee_ID = parseInt(req.session.user.id, 10);
        const replacement_emp = parseInt(req.body.replacement_emp, 10);
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;

        if (!replacement_emp || !start_date || !end_date) {
            req.flash('error', 'Please fill in all required fields');
            return res.redirect('/academic/academicdashboard1');
        }

        await academicService.submitAnnualLeave(employee_ID, replacement_emp, start_date, end_date);
        req.flash('success', 'Annual Leave submitted successfully. Awaiting approval.');
        res.redirect('/academic/academicdashboard1');
    } catch (error) {
        console.error('Error submitting annual leave:', error);
        req.flash('error', 'Failed to submit annual leave request');
        res.redirect('/academic/academicdashboard1');
    }
};

// 6. Get leave status for current month
exports.getLeaveStatus = async (req, res) => {
    try {
        req.flash('success', 'Leave status loaded successfully');
        res.redirect('/academic/academicdashboard1');
    } catch (error) {
        console.error('Error fetching leave status:', error);
        req.flash('error', 'Failed to fetch leave status');
        res.redirect('/academic/academicdashboard1');
    }
};