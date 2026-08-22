import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/index.js';
import authRoutes from './routes/auth.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRoutes from './routes/leave.js';
import payrollRoutes from './routes/payroll.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Init DB
initDb().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
