const { sql, config, testConnection } = require('./config/db');

async function main() {
    // Test connection
    await testConnection();

    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("use University_HR_ManagementSystem;SELECT * FROM Employee");
        console.log(result.recordset);
        await pool.close();
    } catch (err) {
        console.error("Query error:", err);
    }
}

main();
