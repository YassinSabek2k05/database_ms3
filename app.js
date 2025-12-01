const { sql, config, testConnection } = require('./config/db');

async function main() {
    // Test connection
    await testConnection();

    // Example: query Employee table
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM dbo.Employee");
        console.log(result.recordset);
        await pool.close();
    } catch (err) {
        console.error("Query error:", err);
    }
}

main();
