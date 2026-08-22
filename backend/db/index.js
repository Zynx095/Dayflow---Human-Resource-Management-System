import pg from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/dayflow',
  });

  dbInstance = {
    get: async (sql, params) => {
      const r = await pool.query(sql, params);
      return r.rows[0];
    },
    all: async (sql, params) => {
      const r = await pool.query(sql, params);
      return r.rows;
    },
    run: async (sql, params) => {
      const r = await pool.query(sql, params);
      return { lastID: r.rows[0]?.id, changes: r.rowCount };
    },
    exec: async (sql) => {
      return pool.query(sql);
    },
  };

  return dbInstance;
}

export async function initDb() {
  const db = await getDb();

  // Execute schema (CREATE TABLE IF NOT EXISTS — safe to re-run)
  const schemaStr = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  await db.exec(schemaStr);

  // Add payment_status if it doesn't exist (non-destructive migration)
  try {
    await dbInstance.run("ALTER TABLE attendance ADD COLUMN payment_status TEXT DEFAULT 'PENDING'");
    console.log('Migrated: Added payment_status to attendance.');
  } catch (e) {
    // Column likely already exists
    if (!e.message.includes('duplicate column name')) {
      console.error('Migration notice:', e.message);
    }
  }

  // Seed only if no users exist
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (parseInt(userCount.count) === 0) {
    console.log('Seeding initial development data...');

    // --- Dev-only passwords (documented) ---
    // hr@dayflow.com / hr123
    // john@dayflow.com / emp123
    // priya@dayflow.com / emp123
    const hrPassword = await bcrypt.hash('hr123', 10);
    const empPassword = await bcrypt.hash('emp123', 10);

    // Create users
    const hrUser = await db.run(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      ['hr@dayflow.com', hrPassword, 'hr']
    );
    const emp1User = await db.run(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      ['john@dayflow.com', empPassword, 'employee']
    );
    const emp2User = await db.run(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      ['priya@dayflow.com', empPassword, 'employee']
    );

    // Create employees
    const hrEmp = await db.run(
      `INSERT INTO employees (employee_id, user_id, name, email, department, designation, salary, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      ['EMP-000', hrUser.lastID, 'HR Admin', 'hr@dayflow.com', 'Human Resources', 'HR Manager', 85000, 'hr']
    );
    const emp1 = await db.run(
      `INSERT INTO employees (employee_id, user_id, name, email, department, designation, salary, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      ['EMP-001', emp1User.lastID, 'John Doe', 'john@dayflow.com', 'Engineering', 'Software Engineer', 65000, 'employee']
    );
    const emp2 = await db.run(
      `INSERT INTO employees (employee_id, user_id, name, email, department, designation, salary, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      ['EMP-002', emp2User.lastID, 'Priya Sharma', 'priya@dayflow.com', 'Design', 'UI/UX Designer', 55000, 'employee']
    );

    // Create payroll records (INR values)
    await db.run(
      `INSERT INTO payroll (employee_id, pay_period, base_salary, allowances, deductions, net_salary)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [hrEmp.lastID, '2026-07', 85000, 8500, 5100, 88400]
    );
    await db.run(
      `INSERT INTO payroll (employee_id, pay_period, base_salary, allowances, deductions, net_salary)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [hrEmp.lastID, '2026-08', 85000, 8500, 5100, 88400]
    );
    await db.run(
      `INSERT INTO payroll (employee_id, pay_period, base_salary, allowances, deductions, net_salary)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [emp1.lastID, '2026-07', 65000, 6500, 3900, 67600]
    );
    await db.run(
      `INSERT INTO payroll (employee_id, pay_period, base_salary, allowances, deductions, net_salary)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [emp1.lastID, '2026-08', 65000, 6500, 3900, 67600]
    );
    await db.run(
      `INSERT INTO payroll (employee_id, pay_period, base_salary, allowances, deductions, net_salary)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [emp2.lastID, '2026-07', 55000, 5500, 3300, 57200]
    );
    await db.run(
      `INSERT INTO payroll (employee_id, pay_period, base_salary, allowances, deductions, net_salary)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [emp2.lastID, '2026-08', 55000, 5500, 3300, 57200]
    );

    // Create sample leave requests
    await db.run(
      `INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [emp1.lastID, 'PAID', '2026-09-01', '2026-09-03', 'Family function', 'PENDING']
    );
    await db.run(
      `INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [emp2.lastID, 'SICK', '2026-08-25', '2026-08-26', 'Not feeling well', 'PENDING']
    );

    console.log('Seed complete. Dev accounts:');
    console.log('  HR:       hr@dayflow.com / hr123');
    console.log('  Employee: john@dayflow.com / emp123');
    console.log('  Employee: priya@dayflow.com / emp123');
  }
}
