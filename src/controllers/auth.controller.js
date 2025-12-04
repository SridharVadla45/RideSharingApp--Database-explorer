// src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { validationResult } from 'express-validator';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export const AuthController = {
    register: async (req, res) => {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.accepts('html') && !req.is('json')) {
                return res.render('auth/register', {
                    title: 'Register - RideShare',
                    error: errors.array()[0].msg,
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone_number
                });
            }
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, phone_number } = req.body;
        try {
            // Check if user already exists
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                if (req.accepts('html') && !req.is('json')) {
                    return res.render('auth/register', {
                        title: 'Register - RideShare',
                        error: 'User already exists',
                        name: name,
                        email: email,
                        phone: phone_number
                    });
                }
                return res.status(409).json({ error: 'User already exists' });
            }

            const hashed = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: { name, email, password: hashed, phone_number }
            });

            const token = jwt.sign({ userId: newUser.user_id, email: newUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Handle HTML response (browser form submit)
            if (req.accepts('html') && !req.is('json')) {
                return res.redirect('/dashboard');
            }

            res.status(201).json({ token, user: { id: newUser.user_id, name: newUser.name, email: newUser.email } });
        } catch (err) {
            console.error('Register error:', err);
            if (req.accepts('html') && !req.is('json')) {
                return res.render('auth/register', {
                    title: 'Register - RideShare',
                    error: 'Server error during registration',
                    name: name,
                    email: email,
                    phone: phone_number
                });
            }
            res.status(500).json({ error: 'Server error during registration' });
        }
    },

    login: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.accepts('html') && !req.is('json')) {
                return res.render('auth/login', {
                    title: 'Login - RideShare',
                    error: errors.array()[0].msg,
                    email: req.body.email
                });
            }
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                if (req.accepts('html') && !req.is('json')) {
                    return res.render('auth/login', {
                        title: 'Login - RideShare',
                        error: 'Invalid credentials',
                        email: email
                    });
                }
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                if (req.accepts('html') && !req.is('json')) {
                    return res.render('auth/login', {
                        title: 'Login - RideShare',
                        error: 'Invalid credentials',
                        email: email
                    });
                }
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Handle HTML response (browser form submit)
            if (req.accepts('html') && !req.is('json')) {
                return res.redirect('/dashboard');
            }

            // Handle JSON response (API/Fetch)
            res.json({ token, user: { id: user.user_id, name: user.name, email: user.email } });
        } catch (err) {
            console.error('Login error:', err);
            if (req.accepts('html') && !req.is('json')) {
                return res.render('auth/login', {
                    title: 'Login - RideShare',
                    error: 'Server error during login',
                    email: email
                });
            }
            res.status(500).json({ error: 'Server error during login' });
        }
    },

    logout: (req, res) => {
        res.clearCookie('token');
        if (req.accepts('html') && !req.is('json')) {
            return res.redirect('/auth/login');
        }
        res.json({ message: 'Logged out successfully' });
    }
};
