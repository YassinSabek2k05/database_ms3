const { sql, config, testConnection } = require('./config/db');
const hrRoutes = require('./routes/hrRoutes');
const express = require('express');
const router = express.Router();
const app = express();
app.use('/api', router);


app.use('/hr', hrRoutes);   

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
