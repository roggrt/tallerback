// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
//
// const app = express();
//
// // Middleware
// app.use(cors());
// app.use(express.json());
//
// // Basic route
// app.get('/', (req, res) => {
//     res.send('Taller API running');
// });
//
// // Error handling
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });
//
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceOrderRoutes = require('./routes/serviceOrderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const serviceOrderDetailRoutes = require('./routes/serviceOrderDetailRoutes');
const searchRoutes = require('./routes/searchRoutes');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Database Connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            message: 'Database connected successfully',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Taller API running',
        timestamp: new Date()
    });
});




app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/service-orders', serviceOrderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-details', serviceOrderDetailRoutes);
app.use('/api/search', searchRoutes);




// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});