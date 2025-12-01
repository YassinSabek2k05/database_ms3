const hrService = require('../services/hrService');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await hrService.getAllEmployees();
        res.status(200).json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};