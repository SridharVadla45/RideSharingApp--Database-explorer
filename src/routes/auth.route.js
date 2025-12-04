import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Render login page (optional UI) – keep for completeness
authRouter.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login', error: null });
});

// Render registration page
authRouter.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Register' });
});

authRouter.get('/logout', AuthController.logout);

// Login endpoint with validation
authRouter.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    AuthController.login
);

// Register endpoint
authRouter.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('phone_number').optional().isMobilePhone().withMessage('Invalid phone number')
    ],
    AuthController.register
);

export default authRouter;