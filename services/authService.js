const { config, sql } = require('../config/db');

const ADMIN_ID = 'admin';
const ADMIN_PASS = 'admin123';



exports.authHr = async (userid, password) => {
  const pool = await sql. connect(config);
  console. log("Connected!");

  const result = await pool. request().query(`SELECT dbo.HRLoginValidation(${userid}, '${password}') AS success`);
  return result.recordset;
};
