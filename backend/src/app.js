import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import schoolsRouter from './routes/schools.js';
import teacherRoutes from './routes/teachers.js';
import classesRouter from './routes/classes.js';
import roomsRouter   from './routes/rooms.js';
import timeslotRoutes from './routes/timeslots.js';
import timetableRouter from './routes/timetable.js';
import entriesRouter from './routes/entries.js';
import subjectRoutes from './routes/subjects.js';
import membershipRoutes from './routes/membership.js';
import lessonSettingsRoutes from './routes/lessonSettings.js';

import authMiddleware from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// publiczne
app.use('/auth', authRouter);

// wszystkie poniżej wymagają JWT
app.use(authMiddleware);

app.use('/', usersRouter);
app.use('/schools', schoolsRouter);
app.use('/', teacherRoutes);
app.use('/', classesRouter);
app.use('/', roomsRouter);
app.use('/', timeslotRoutes);
app.use('/', subjectRoutes);
app.use('/', timetableRouter);
app.use('/', entriesRouter);
app.use('/', membershipRoutes);
app.use('/', lessonSettingsRoutes);

// global error handler
app.use(errorHandler);

export default app;
