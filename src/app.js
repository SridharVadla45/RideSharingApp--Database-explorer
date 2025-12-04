import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route.js';
import configuration from './config/env.js';
import { schemaRouter } from './routes/schema.route.js';
import { tableRouter } from './routes/table.route.js';
import { analyticsRouter } from './routes/analytics.route.js';
import { transactionRouter } from './routes/transaction.route.js';
import { authenticateToken } from './middleware/auth.middleware.js';

const app = express();

// ---------- Security middlewares ----------
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            "img-src": ["'self'", "data:", "https:"],
        },
    },
}));
app.use(cors());
app.use(morgan('combined'));
app.use(compression());

// ---------- View engine ----------
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));
app.set('view cache', false); // Disable view cache for development

// ---------- Body parsers ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ---------- Static assets ----------
app.use(express.static(path.join(process.cwd(), 'public')));

// ---------- Cache Control Middleware ----------
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// ---------- Dashboard (requires auth) ----------
app.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { title: 'Dashboard', user: req.user });
});

// ---------- Protect all API routes ----------
app.use('/api', authenticateToken);

// ---------- Protected API routers ----------
app.use('/api', schemaRouter);
app.use('/api', tableRouter);
app.use('/api', analyticsRouter);
app.use('/api', transactionRouter);

// ---------- Public auth routes ----------
app.use('/auth', authRouter);
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = configuration.server.port;

// Import Prisma to verify connection
import prisma from './config/prisma.js';

app.listen(PORT, async () => {
    console.log('🚀 ========================================');
    console.log('🚀 RideShare Admin Portal Server Started');
    console.log('🚀 ========================================');
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🔐 Login: http://localhost:${PORT}/auth/login`);

    try {
        const userCount = await prisma.user.count();
        console.log(`✅ Database Connected! Found ${userCount} users.`);
    } catch (error) {
        console.error('❌ Database Connection Failed:', error.message);
    }

    console.log('🚀 ========================================');
});

export default app;