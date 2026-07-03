import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import courseRoutes from './routes/course.routes';
import userRoutes from './routes/user.routes';
import gradeRoutes from './routes/grade.routes';
import deadlineRoutes from './routes/deadline.routes';
import scheduleRoutes from './routes/schedule.routes';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(cors());                    // enable CORS
app.use(express.json());           // enable JSON parsing
app.use('/courses', courseRoutes);    // mount course routes
app.use('/schedules', scheduleRoutes); // mount schedule routes
app.use('/deadlines', deadlineRoutes); // mount deadline routes
app.use('/grades', gradeRoutes);     // mount grade routes
app.use('/users', userRoutes);        // mount user routes
app.use('/auth', authRoutes);         // mount auth routes

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor aberto na porta: ${PORT}`);
});