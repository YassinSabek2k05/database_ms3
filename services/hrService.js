const { config, sql } = require('../config/db');

exports.getHrData = async (employee_ID) => {
  const pool = await sql.connect(config);

  const result = await pool.request().query(`SELECT * FROM Employee where employee_ID = ${employee_ID}`);
  console.log(result.recordset);
  return result.recordset;
};
//2 
exports.HR_approval_an_acc = async (request_ID , HR_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request().query(`exec HR_approval_an_acc ${request_ID}, ${HR_ID}`);
    } catch (error) {
        console.error("Error in HR_approval_an_acc:", error);
        throw error;
    }
};
//3.Approve/reject unpaid leaves 
exports.HR_approval_unpaid = async (request_ID , HR_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request().query(`exec HR_approval_unpaid ${request_ID}, ${HR_ID}`);
    } catch (error) {
        console.error("Error in HR_approval_unpaid:", error);
        throw error;
    }
};
//4.
exports.HR_approval_comp = async (request_ID , HR_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request().query(`exec HR_approval_comp ${request_ID}, ${HR_ID}`);
    } catch (error) {
        console.error("Error in HR_approval_comp:", error);
        throw error;
    }
};
//5.deduction hours: procedure
exports.Deduction_hours = async (employee_ID) => {
    // Implementation for calculating deduction hours
};
//6.deduction days: procedure
exports.Deduction_days = async (employee_ID) => {
    // Implementation for calculating deduction days
};
//7.deduction unpaid: procedure
exports.Deduction_unpaid = async (employee_ID) => {
    // Implementation for calculating unpaid deductions
};
//8.add payroll: procedure
exports.Add_Payroll = async (employee_ID, from_date, to_date) => {
    // Implementation for adding payroll
};
exports.getAnAccRequests = async (HR_ID) => {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT e.employee_id, e.first_name,e.last_name,e.dept_name, eal.status,l.request_ID
    FROM Leave l
    inner join Employee_Approve_Leave eal on l.request_ID = eal.Leave_ID
    inner join Annual_Leave al on l.request_ID = al.request_ID
    inner join Employee e on al.emp_ID = e.employee_id
    WHERE l.final_approval_status='pending' and status = 'Pending' AND Emp1_ID = ${HR_ID}
    union
    SELECT e.employee_id, e.first_name,e.last_name,e.dept_name, eal.status,l.request_ID
    FROM Leave l
    inner join Employee_Approve_Leave eal on l.request_ID = eal.Leave_ID
    inner join Accidental_Leave al on l.request_ID = al.request_ID
    inner join Employee e on al.emp_ID = e.employee_id
    WHERE l.final_approval_status='pending' and status = 'Pending' AND Emp1_ID = ${HR_ID}`
    );
    return result.recordset;
}
exports.getCompRequests = async (HR_ID) => {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT e.employee_id, e.first_name,e.last_name,e.dept_name, eal.status, l.request_ID
    from Leave l inner join Employee_Approve_Leave eal on l.request_ID = eal.leave_ID inner join Compensation_Leave c on l.request_ID = c.request_ID inner join Employee e on c.emp_ID = e.employee_id
    WHERE l.final_approval_status='pending' and status = 'Pending' AND Emp1_ID = ${HR_ID}`
    );
    return result.recordset;
}
exports.getCompRequests = async (HR_ID) => {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT e.employee_id, e.first_name,e.last_name,e.dept_name, eal.status, l.request_ID
    from Leave l inner join Employee_Approve_Leave eal on l.request_ID = eal.leave_ID inner join Unpaid_Leave u on l.request_ID = u.request_ID inner join Employee e on u.emp_ID = e.employee_id
    WHERE l.final_approval_status='pending' and status = 'Pending' AND Emp1_ID = ${HR_ID}`
    );
    return result.recordset;
}