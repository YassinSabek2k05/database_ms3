const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString: "Driver={ODBC Driver 18 for SQL Server};server=(localdb)\\MSSQLLocalDB; Initial Catalog=University_HR_ManagementSystem;Database=University_HR_ManagementSystem; Integrated Security=True",
  driver: 'msnodesqlv8'
};

module.exports = { sql, config, testConnection };

async function testConnection() {
  try {
    const pool = await sql.connect(config);
    // const result = await pool. request().query(`SELECT * from employee`);
    console.log("Connected!");
    // console.log(result);
    
    await pool.close();
  } catch (err) {
      console.error("Error:", err);
  }
}
// testConnection();
