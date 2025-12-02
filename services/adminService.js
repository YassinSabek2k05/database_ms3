const { config, sql } = require('../config/db');



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
exports.Update_Attendance = async (employee_ID, date, status) => {
    try {
    const pool = await sql.connect(config);
    await pool.request().query(`exec Update_Attendance ${employee_ID}, ${date}, ${status}`);
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