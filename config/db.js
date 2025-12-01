const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString: "Driver={ODBC Driver 18 for SQL Server};server=(localdb)\\MSSQLLocalDB; Initial Catalog=University_HR_ManagementSystem; Integrated Security=True",
  driver: 'msnodesqlv8'
};

module.exports = { sql, config, testConnection };

async function testConnection() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected!");

    const result = await pool.request().query("use University_HR_ManagementSystem; SELECT TOP 5 * FROM Employee");
    console.log(result.recordset);

    await pool.close();
  } catch (err) {
      console.error("Error:", err);
  }
}

