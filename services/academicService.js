const { config, sql } = require('../config/db');

// 1. APPLY FOR ACCIDENTAL LEAVE
exports.submitAccidental = async (employee_ID, start_date, end_date) => {
    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("start_date", sql.Date, start_date)
            .input("end_date", sql.Date, end_date)
            .execute("Submit_accidental");

    } catch (error) {
        console.error("Error in submitAccidental:", error);
        throw error;
    }
};

// 2. APPLY FOR MEDICAL LEAVE
exports.submitMedical = async (
    employee_ID,
    start_date,
    end_date,
    type,
    insurance_status,
    disability_details,
    document_description,
    file_name
) => {
    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("start_date", sql.Date, start_date)
            .input("end_date", sql.Date, end_date)
            .input("type", sql.VarChar, type)
            .input("insurance_status", sql.Int, insurance_status)
            .input("disability_details", sql.VarChar, disability_details || null)
            .input("document_description", sql.VarChar, document_description || null)
            .input("file_name", sql.VarChar, file_name || null)
            .execute("Submit_medical");

    } catch (error) {
        console.error("Error in submitMedical:", error);
        throw error;
    }
};

// 3. APPLY FOR UNPAID LEAVE
exports.submitUnpaid = async (employee_ID, start_date, end_date, document_description, file_name) => {
    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("start_date", sql.Date, start_date)
            .input("end_date", sql.Date, end_date)
            .input("document_description", sql.VarChar, document_description || null)
            .input("file_name", sql.VarChar, file_name || null)
            .execute("Submit_unpaid");

    } catch (error) {
        console.error("Error in submitUnpaid:", error);
        throw error;
    }
};

// 4. APPLY FOR COMPENSATION LEAVE
exports.submitCompensation = async (
    employee_ID,
    compensation_date,
    reason,
    date_of_original_workday_date,
    replacement_emp
) => {
    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("compensation_date", sql.Date, compensation_date)
            .input("reason", sql.VarChar, reason || null)
            .input("date_of_original_workday_date", sql.Date, date_of_original_workday_date)
            .input("rep_emp_id", sql.Int, replacement_emp) // match parameter expected by proc name? keep as replacement_emp in controller
            .execute("Submit_compensation");

    } catch (error) {
        console.error("Error in submitCompensation:", error);
        throw error;
    }
};

// 5. APPROVE / REJECT UNPAID LEAVE
exports.approveUnpaid = async (request_ID, upperboard_ID) => {
    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input("request_ID", sql.Int, request_ID)
            .input("upperboard_ID", sql.Int, upperboard_ID)
            .execute("Upperboard_approve_unpaids");

    } catch (error) {
        console.error("Error in approveUnpaid:", error);
        throw error;
    }
};

// 6. APPROVE / REJECT ANNUAL LEAVE
exports.approveAnnual = async (request_ID, upperboard_ID, replacement_ID) => {
    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input("request_ID", sql.Int, request_ID)
            .input("upperboard_ID", sql.Int, upperboard_ID)
            .input("replacement_ID", sql.Int, replacement_ID)
            .execute("Upperboard_approve_annual");

    } catch (error) {
        console.error("Error in approveAnnual:", error);
        throw error;
    }
};

// 7. EVALUATE EMPLOYEE (DEAN)
// NOTE: your SQL proc Dean_andHR_Evaluation expects (employee_ID, rating, comment, semester).
// We call it with those exact params (we do NOT alter the DB).
exports.evaluateEmployee = async (employee_ID, rating, comment, semester) => {
    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input("employee_ID", sql.Int, employee_ID)
            .input("rating", sql.Int, rating)
            .input("comment", sql.VarChar, comment || null)
            .input("semester", sql.Char(3), semester)
            .execute("Dean_andHR_Evaluation");

    } catch (error) {
        console.error("Error in evaluateEmployee:", error);
        throw error;
    }
};


exports.getMyLeaveStatuses = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        // status_leaves is a table-valued function in your DB; call it directly
        const result = await pool.request()
            .input("employee_ID", sql.Int, employee_ID)
            .query("SELECT * FROM dbo.status_leaves(@employee_ID);");
        return result.recordset || [];
    } catch (err) {
        console.error('getMyLeaveStatuses error:', err);
        return [];
    }
};

exports.getPendingUnpaidLeaves = async () => {
    try {
        const pool = await sql.connect(config);

        // A simple read that lists pending unpaid leaves (join with Employee and Document if present)
        const result = await pool.request()
            .query(`
                SELECT l.request_ID, u.Emp_ID AS employee_id, e.first_name, e.last_name,
                       l.start_date, l.end_date, d.description AS document_description,
                       (SELECT status FROM Employee_Approve_Leave WHERE leave_ID = l.request_ID AND Emp1_ID IN (
                           SELECT emp_ID FROM Employee_Role WHERE role_name LIKE '%HR%' -- HR approver status (if any)
                       )) AS HR_approval_status
                FROM dbo.[Leave] l
                INNER JOIN dbo.Unpaid_Leave u ON u.request_ID = l.request_ID
                INNER JOIN dbo.Employee e ON e.employee_id = u.Emp_ID
                LEFT JOIN dbo.Document d ON d.unpaid_ID = u.request_ID
                WHERE l.final_approval_status = 'Pending'
                ORDER BY l.date_of_request DESC
            `);

        return result.recordset || [];
    } catch (err) {
        console.error('getPendingUnpaidLeaves error:', err);
        return [];
    }
};

exports.getPendingAnnualLeaves = async () => {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .query(`
                SELECT l.request_ID, a.emp_ID as employee_id, e.first_name, e.last_name,
                       l.start_date, l.end_date,
                       (SELECT status FROM Employee_Approve_Leave WHERE leave_ID = l.request_ID AND Emp1_ID IN (
                           SELECT emp_ID FROM Employee_Role WHERE role_name LIKE '%HR%' -- HR approver status (if any)
                       )) AS HR_approval_status
                FROM dbo.[Leave] l
                INNER JOIN dbo.Annual_Leave a ON a.request_ID = l.request_ID
                INNER JOIN dbo.Employee e ON e.employee_id = a.emp_ID
                WHERE l.final_approval_status = 'Pending'
                ORDER BY l.date_of_request DESC
            `);

        return result.recordset || [];
    } catch (err) {
        console.error('getPendingAnnualLeaves error:', err);
        return [];
    }
};

exports.getDepartmentEmployees = async (dept_name) => {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('dept_name', sql.VarChar, dept_name || null)
            .query(`
                SELECT employee_id, first_name, last_name
                FROM dbo.Employee
                WHERE dept_name = @dept_name
                ORDER BY first_name, last_name
            `);

        return result.recordset || [];
    } catch (err) {
        console.error('getDepartmentEmployees error:', err);
        return [];
    }
};

// Get academic employee data with roles
exports.getAcademicData = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        
        // Get employee basic info
        const empResult = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .query(`
                SELECT employee_id, first_name, last_name, dept_name
                FROM dbo.Employee
                WHERE employee_id = @employee_ID
            `);
        
        if (!empResult.recordset || empResult.recordset.length === 0) {
            return null;
        }
        
        const employee = empResult.recordset[0];
        
        // Get roles separately (more compatible with older SQL Server versions)
        const rolesResult = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .query(`
                SELECT role_name
                FROM dbo.Employee_Role
                WHERE emp_ID = @employee_ID
            `);
        
        const roles = rolesResult.recordset.map(r => r.role_name);
        employee.roles = roles;
        
        return employee;
    } catch (err) {
        console.error('getAcademicData error:', err);
        return null;
    }
};

// My Records functions
exports.getMyPerformance = async (employee_ID, semester) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .input('semester', sql.Char(3), semester || 'W24')
            .query(`SELECT * FROM dbo.MyPerformance(@employee_ID, @semester)`);
        return result.recordset || [];
    } catch (err) {
        console.error('getMyPerformance error:', err);
        return [];
    }
};

exports.getMyAttendance = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .query(`SELECT * FROM dbo.MyAttendance(@employee_ID)`);
        return result.recordset || [];
    } catch (err) {
        console.error('getMyAttendance error:', err);
        return [];
    }
};

exports.getLastMonthPayroll = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .query(`SELECT * FROM dbo.Last_month_payroll(@employee_ID)`);
        return result.recordset || [];
    } catch (err) {
        console.error('getLastMonthPayroll error:', err);
        return [];
    }
};

exports.getMyDeductions = async (employee_ID, month) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .input('month', sql.Int, month || new Date().getMonth() + 1)
            .query(`SELECT * FROM dbo.Deductions_Attendance(@employee_ID, @month)`);
        return result.recordset || [];
    } catch (err) {
        console.error('getMyDeductions error:', err);
        return [];
    }
};

// PART 1 - ACADEMIC EMPLOYEE FUNCTIONS

// 1. Login validation for academic employee
exports.academicEmployeeLogin = async (employee_ID, password) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .input('password', sql.VarChar(50), password)
            .query(`SELECT dbo.EmployeeLoginValidation(@employee_ID, @password) AS success`);
        return result.recordset[0]?.success || 0;
    } catch (err) {
        console.error('academicEmployeeLogin error:', err);
        return 0;
    }
};

// 2. Get my performance for a certain semester
exports.getMyPerformance = async (employee_ID, semester) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .input('semester', sql.Char(3), semester)
            .query(`SELECT * FROM dbo.MyPerformance(@employee_ID, @semester)`);
        return result.recordset || [];
    } catch (err) {
        console.error('getMyPerformance error:', err);
        return [];
    }
};

// 3. Get my attendance records for current month (excluding unattended day off)
exports.getMyAttendance = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .query(`SELECT * FROM dbo.MyAttendance(@employee_ID)`);
        return result.recordset || [];
    } catch (err) {
        console.error('getMyAttendance error:', err);
        return [];
    }
};

// 4. Get last month's payroll details
exports.getLastMonthPayrollForEmployee = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .query(`SELECT * FROM dbo.Last_month_payroll(@employee_ID)`);
        return result.recordset || [];
    } catch (err) {
        console.error('getLastMonthPayrollForEmployee error:', err);
        return [];
    }
};

// 5. Get deductions caused by attendance issues in a certain period
exports.getDeductionsByAttendance = async (employee_ID, month) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .input('month', sql.Int, month)
            .query(`SELECT * FROM dbo.Deductions_Attendance(@employee_ID, @month)`);
        return result.recordset || [];
    } catch (err) {
        console.error('getDeductionsByAttendance error:', err);
        return [];
    }
};

// 6. Submit annual leave request
exports.submitAnnualLeave = async (employee_ID, replacement_emp, start_date, end_date) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .input('replacement_emp', sql.Int, replacement_emp)
            .input('start_date', sql.Date, start_date)
            .input('end_date', sql.Date, end_date)
            .execute('Submit_annual');
    } catch (err) {
        console.error('submitAnnualLeave error:', err);
        throw err;
    }
};

// 7. Get status of all my leave requests for current month
exports.getMyLeaveStatus = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('employee_ID', sql.Int, employee_ID)
            .query(`SELECT * FROM dbo.Status_leaves(@employee_ID)`);
        return result.recordset || [];
    } catch (err) {
        console.error('getMyLeaveStatus error:', err);
        return [];
    }
};
