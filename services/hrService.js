const { config, sql } = require('../config/db');

exports.getAllEmployees = async () => {
  // 1. Get database connection
        const pool = await sql.connect(config);
        console.log("Connected!");

        const result = await pool.request().query("use University_HR_ManagementSystem;SELECT TOP 5 * FROM dbo.Employee");
        console.log(result.recordset);
    return result.recordset;
};

