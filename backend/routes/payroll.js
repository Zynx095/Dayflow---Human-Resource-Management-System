import express from 'express';
import { getDb } from '../db/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Employee retrieves own payroll
router.get('/me', authenticateToken, requireRole('employee'), async (req, res) => {
  try {
    const { employee_id } = req.user;
    if (!employee_id) return res.status(400).json({ error: 'No employee record associated with user.' });

    console.log('Fetching payroll for employee_id:', employee_id);
    const db = await getDb();
    
    // Select specific non-sensitive fields from employee and payroll
    const records = await db.all(
      `SELECT p.id, p.pay_period, p.base_salary, p.allowances, p.deductions, p.net_salary, p.created_at, p.updated_at
       FROM payroll p 
       WHERE p.employee_id = ?
       ORDER BY p.created_at DESC`,
      [employee_id]
    );
    
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// HR retrieves all payroll
router.get('/all', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const db = await getDb();
    
    const records = await db.all(
      `SELECT p.id, p.pay_period, p.base_salary, p.allowances, p.deductions, p.net_salary, p.created_at, p.updated_at,
              e.id as employee_id, e.employee_id as business_id, e.name, e.department
       FROM payroll p 
       JOIN employees e ON p.employee_id = e.id
       ORDER BY p.created_at DESC`
    );
    
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// HR retrieves specific employee payroll
router.get('/:employeeId', authenticateToken, requireRole('hr'), async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // employeeId format validation (basic check)
    if (!employeeId || isNaN(parseInt(employeeId))) {
      return res.status(400).json({ error: 'Invalid employee ID format' });
    }

    const db = await getDb();
    
    // Ensure employee exists
    const employee = await db.get('SELECT id FROM employees WHERE id = ?', [employeeId]);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const records = await db.all(
      `SELECT p.id, p.pay_period, p.base_salary, p.allowances, p.deductions, p.net_salary, p.created_at, p.updated_at
       FROM payroll p 
       WHERE p.employee_id = ?
       ORDER BY p.created_at DESC`,
      [employeeId]
    );
    
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
