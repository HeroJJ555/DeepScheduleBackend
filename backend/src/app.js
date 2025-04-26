import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import schoolsRouter from './routes/schools.js';
import teacherRouter from './routes/teachers.js';
import classRouter from './routes/classes.js';
import roomRouter from './routes/rooms.js';
import timeslotRouter from './routes/timeslots.js';
import timetableRouter from './routes/timetable.js';
import entriesRouter from './routes/entries.js';

import authMiddleware from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// publiczne
app.use('/auth', authRouter);

// wszystkie poniżej wymagają JWT
app.use(authMiddleware);

app.use('/users', usersRouter);
app.use('/schools', schoolsRouter);
app.use('/schools', teacherRouter);
app.use('/schools', classRouter);
app.use('/schools', roomRouter);
app.use('/schools', timeslotRouter);
app.use('/', timetableRouter);
app.use('/', entriesRouter);

// global error handler
app.use(errorHandler);

export default app;
