import express from 'express';

const authRouter = express.Router();

authRouter.get('/login', (req, res) => {
    res.render('auth/login', { 
        title: 'Login',
        error: null 
    });
});

authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Dummy authentication logic
    if (email === 'user@gmail.com' && password === 'pass') {
        res.redirect('/dashboard');
    } else {
        res.status(401).render('auth/login', { 
            title: 'Login',
            error: 'Invalid email or password' 
        });
    }
});

export default authRouter;