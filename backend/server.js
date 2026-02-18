const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const scheduleRoutes = require('./routes/schedule');
const dashboardRoutes = require('./routes/dashboard');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root Meta
app.get('/', (req, res) => {
    res.json({
        message: 'NyaySetu AI API',
        endpoints: ['/api/auth', '/api/cases', '/api/schedule', '/api/dashboard'],
        documentation: 'https://docs.nyaysetu.gov.in'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.name || 'ServerError',
        message: err.message || 'Internal server error'
    });
});

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

// Sync database and start server
sequelize.sync().then(async () => {
    // Initialize services
    await require('./services/blockchain').init();

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

