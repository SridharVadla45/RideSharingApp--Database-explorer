import express from 'express';
import path from 'path';
import authRouter from './routes/auth.route.js';
import configuration from './config/env.js';
import { schemaRouter } from './routes/schema.route.js';
import { tableRouter } from './routes/table.route.js';
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/auth', authRouter);

app.use('/api', schemaRouter);
app.use("/api", tableRouter);

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

const PORT = configuration.server.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;