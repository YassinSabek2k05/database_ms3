const { config, sql } = require('../config/db');

const ADMIN_ID = '44';
const ADMIN_PASS = 'admin123';



exports.authHr = async (userid, password) => {
  const pool = await sql. connect(config);
  console. log("Connected!");

  const result = await pool. request().query(`SELECT dbo.HRLoginValidation(${userid}, '${password}') AS success`);
  return result.recordset;
};
exports.authAdmin = (userid, password) => {
    return userid === ADMIN_ID && password === ADMIN_PASS;
};
exports.authAcademic = async (userid, password) => {
  const pool = await sql. connect(config);
  console. log("Connected!");

  const result = await pool. request().query(`SELECT dbo.EmployeeLoginValidation(${userid}, '${password}') AS success`);
  return result.recordset;
};