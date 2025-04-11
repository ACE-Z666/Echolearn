const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both common frontend ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400 // 24 hours
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
    console.log('\n=== New Request ===');
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    next();
});

// Response logging middleware
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
        console.log('\n=== Response ===');
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.getHeaders(), null, 2));
        console.log('Body:', JSON.stringify(data, null, 2));
        originalSend.apply(res, arguments);
    };
    next();
});

// Routes
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Add this before your routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy. Trying ${PORT + 1}`);
        app.listen(PORT + 1);
    } else {
        console.error(err);
    }
}); 