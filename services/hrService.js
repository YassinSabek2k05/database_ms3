const { config, sql } = require('../config/db');

exports.getHrData = async (employee_ID) => {
  const pool = await sql.connect(config);

  const result = await pool.request()
    .input('employee_ID', sql.Int, employee_ID)
    .query(`SELECT * FROM Employee where employee_ID = @employee_ID`);
  console.log(result.recordset);
  return result.recordset;
};
//2 
exports.HR_approval_an_acc = async (request_ID , HR_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
          .input('request_ID', sql.Int, request_ID)
          .input('HR_ID', sql.Int, HR_ID)
          .execute('HR_approval_an_acc');
    } catch (error) {
        console.error("Error in HR_approval_an_acc:", error);
        throw error;
    }
};
//3.Approve/reject unpaid leaves 
exports.HR_approval_unpaid = async (request_ID , HR_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
          .input('request_ID', sql.Int, request_ID)
          .input('HR_ID', sql.Int, HR_ID)
          .execute('HR_approval_unpaid');
    } catch (error) {
        console.error("Error in HR_approval_unpaid:", error);
        throw error;
    }
};
//4.
exports.HR_approval_comp = async (request_ID , HR_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
          .input('request_ID', sql.Int, request_ID)
          .input('HR_ID', sql.Int, HR_ID)
          .execute('HR_approval_comp');
    } catch (error) {
        console.error("Error in HR_approval_comp:", error);
        throw error;
    }
};
//5.deduction hours: procedure
exports.Deduction_hours = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
          .input('employee_ID', sql.Int, employee_ID)
          .execute('Deduction_hours');
    } catch (error) {
        console.error("Error in Deduction_hours:", error);
        throw error;
    }
};
//6.deduction days: procedure
exports.Deduction_days = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
          .input('employee_ID', sql.Int, employee_ID)
          .execute('Deduction_days');
    } catch (error) {
        console.error("Error in Deduction_days:", error);
        throw error;
    }
};
//7.deduction unpaid: procedure
exports.Deduction_unpaid = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
          .input('employee_ID', sql.Int, employee_ID)
          .execute('Deduction_unpaid');
    } catch (error) {
        console.error("Error in Deduction_unpaid:", error);
        throw error;
    }
};
//8.add payroll: procedure
exports.Add_Payroll = async (employee_ID, from_date, to_date) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
          .input('employee_ID', sql.Int, employee_ID)
          .input('from', sql.Date, from_date)
          .input('to', sql.Date, to_date)
          .execute('Add_Payroll');
    } catch (error) {
        console.error("Error in Add_Payroll:", error);
        throw error;
    }
};
exports.getAnAccRequests = async (HR_ID) => {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('HR_ID', sql.Int, HR_ID)
      .query(`
    SELECT e.employee_id, e.first_name,e.last_name,e.dept_name, eal.status,l.request_ID
    FROM Leave l
    inner join Employee_Approve_Leave eal on l.request_ID = eal.Leave_ID
    inner join Annual_Leave al on l.request_ID = al.request_ID
    inner join Employee e on al.emp_ID = e.employee_id
    WHERE l.final_approval_status='pending' and status = 'Pending' AND Emp1_ID = @HR_ID
    union
    SELECT e.employee_id, e.first_name,e.last_name,e.dept_name, eal.status,l.request_ID
    FROM Leave l
    inner join Employee_Approve_Leave eal on l.request_ID = eal.Leave_ID
    inner join Accidental_Leave al on l.request_ID = al.request_ID
    inner join Employee e on al.emp_ID = e.employee_id
    WHERE l.final_approval_status='pending' and status = 'Pending' AND Emp1_ID = @HR_ID`
    );
    return result.recordset;
}
exports.getCompRequests = async (HR_ID) => {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('HR_ID', sql.Int, HR_ID)
      .query(`
    SELECT e.employee_id, e.first_name,e.last_name,e.dept_name, eal.status, l.request_ID
    from Leave l inner join Employee_Approve_Leave eal on l.request_ID = eal.leave_ID inner join Compensation_Leave c on l.request_ID = c.request_ID inner join Employee e on c.emp_ID = e.employee_id
    WHERE l.final_approval_status='pending' and status = 'Pending' AND Emp1_ID = @HR_ID`
    );
    return result.recordset;
}
exports.getUnpaidRequests = async (HR_ID) => {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('HR_ID', sql.Int, HR_ID)
      .query(`
    SELECT e.employee_id, e.first_name,e.last_name,e.dept_name, eal.status, l.request_ID
    from Leave l inner join Employee_Approve_Leave eal on l.request_ID = eal.leave_ID inner join Unpaid_Leave u on l.request_ID = u.request_ID inner join Employee e on u.emp_ID = e.employee_id
    WHERE l.final_approval_status='pending' and status = 'Pending' AND Emp1_ID = @HR_ID`
    );
    return result.recordset;
}