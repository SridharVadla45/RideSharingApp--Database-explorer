import express from 'express';
import path from 'path';
import authRouter from './routes/auth.route.js';
import configuration from './config/env.js';

const app = express();

// views
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

// parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static assets from /public (public/css/output.css must exist)
app.use(express.static(path.join(process.cwd(), 'public')));

// routes
app.use('/auth', authRouter);

const PORT = configuration.server.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;