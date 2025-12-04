const { config, sql } = require('../config/db');

const ADMIN_ID = '44';
const ADMIN_PASS = 'admin123';

//malak admin component part 1
// ADMIN AUTHENTICATION
exports.authAdmin = async (userid, password) => {
    return userid === ADMIN_ID && password === ADMIN_PASS;
};
//2
exports.allEmployeeProfiles = async () => {
  try {
    const pool = await sql.connect(config);
    const result =await pool.request().query(`exec allEmployeeProfiles`);
    return result.recordset;
  } catch (error) {
    console.error("Error in allEmployeeProfiles:", error);
    throw error;
}
};

//3
exports.NoEmployeeDept = async () => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`exec NoEmployeeDept`);
    return result.recordset;
  } catch (error) {
    console.error("Error in NoEmployeeDept:", error);
    throw error;
}
};

//4
exports.allRejectedMedicals = async () => {
   try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`exec allRejectedMedicals`);
    return result.recordset;
  } catch (error) {
    console.error("Error in allRejectedMedicals:", error);
    throw error;
}
};

//5
exports.Remove_Deductions = async () => {
    try {
    const pool = await sql.connect(config);
    await pool.request().query(`exec Remove_Deductions`);
  } catch (error) {
    console.error("Error in Remove_Deductions:", error);
    throw error;
}
};


//6
exports.Update_Attendance = async (employee_ID, check_in_time, check_out_time) => {
    try {
    const pool = await sql.connect(config);
    await pool.request().query(`exec Update_Attendance ${employee_ID}, ${check_in_time}, ${check_out_time}`);
  } catch (error) {
    console.error("Error in Update_Attendance:", error);
    throw error;
}
};


//7 
exports.Add_holiday = async (holiday_name,from_date, to_date) => {
    try {
    const pool = await sql.connect(config);
    await pool.request().query(`exec Add_holiday ${holiday_name}, ${from_date}, ${to_date}`);
  } catch (error) {
    console.error("Error in Add_holiday:", error);
    throw error;
}
};

//8
exports.Initiate_Attendance = async () => {
    try {
    const pool = await sql.connect(config);
    await pool.request().query(`exec Initiate_Attendance`);
  } catch (error) {
    console.error("Error in Initiate_Attendance:", error);
    throw error;
}
};
//raghad admin component part 2

//  1. fetch yesterday attendance
exports.getYesterdayAttendance = async () => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT * FROM allEmployeeAttendance`);
        return result.recordset;
    } catch (error) {
        console.error("Error in getYesterdayAttendance:", error);
        throw error;
    }
};

// 2. fetch winter performance
exports.getWinterPerformance = async () => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT * FROM allPerformance`);
        return result.recordset;
    } catch (error) {
        console.error("Error in getWinterPerformance:", error);
        throw error;
    }
};

// 3. remove holidays attendance
exports.removeHolidayAttendance = async () => {
    try {
        const pool = await sql.connect(config);
        await pool.request().query(`exec Remove_Holiday`);
    } catch (error) {
        console.error("Error in removeHolidayAttendance:", error);
        throw error;
    }
};

// 4.remove unattended day off
exports.removeUnattendedDayoff = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request().query(`exec Remove_DayOff ${employee_ID}`);
    } catch (error) {
        console.error("Error in removeUnattendedDayoff:", error);
        throw error;
    }
};

// 5.remove Approved Leaves
exports.removeApprovedLeaves = async (employee_ID) => {
    try {
        const pool = await sql.connect(config);
        await pool.request().query(`exec Remove_Approved_Leaves ${employee_ID}`);
    } catch (error) {
        console.error("Error in removeApprovedLeaves:", error);
        throw error;
    }
};

// 6. replace employee
exports.replaceEmployee = async (old_employee_id, new_employee_id, start_date, end_date) => {
    try {
        const pool = await sql.connect(config);
        await pool.request().query(`exec Replace_employee ${old_employee_id}, ${new_employee_id}, '${start_date}', '${end_date}'`);
    } catch (error) {
        console.error("Error in replaceEmployee:", error);
        throw error;
    }
};

// 7. update employee status
exports.updateEmploymentStatus = async () => {
    try {
        const pool = await sql.connect(config);
        await pool.request().query(`exec Update_Employment_Status`);
    } catch (error) {
        console.error("Error in updateEmploymentStatus:", error);
        throw error;
    }
};

// GET ALL EMPLOYEE PROFILES
exports.getAllEmployeeProfiles = async () => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT * FROM allEmployeeProfiles`);
        return result.recordset;
    } catch (error) {
        console.error("Error in getAllEmployeeProfiles:", error);
        throw error;
    }
};