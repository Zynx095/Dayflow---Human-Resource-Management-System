import { getDb } from './db/index.js';

async function runTest() {
  console.log('--- STARTING PAYROLL CHECKOUT INTEGRATION TEST ---');
  try {
    const db = await getDb();

    // Find an employee user
    const employee = await db.get("SELECT * FROM users WHERE role = 'employee' LIMIT 1");
    if (!employee) throw new Error("No employee found");

    console.log(`Using employee user_id: ${employee.id}, email: ${employee.email}`);

    const empDetails = await db.get("SELECT * FROM employees WHERE user_id = $1", [employee.id]);

    const today = new Date().toISOString().split('T')[0];

    // Clear today's attendance for this employee so we can check in safely
    await db.run("DELETE FROM attendance WHERE employee_id = $1 AND date = $2", [empDetails.id, today]);
    console.log(`Cleared previous attendance for today (${today})`);

    // Clear recent notifications to cleanly check them
    await db.run("DELETE FROM notifications WHERE user_id = $1 AND title = 'Daily Payroll Processed'", [employee.id]);

    // Create a mock token
    const tokenPayload = {
      id: employee.id,
      email: employee.email,
      role: employee.role,
      employee_id: empDetails.id
    };

    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hackathon_key_do_not_commit_in_real_life';
    const token = jwt.default.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    console.log('--- EXECUTING API CALLS ---');

    // CHECK IN
    const checkInRes = await fetch('http://127.0.0.1:3001/api/attendance/check-in', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const checkInData = await checkInRes.json();
    console.log('Check-in Response:', checkInData);

    if (checkInRes.status !== 200) throw new Error("Check-in failed: " + JSON.stringify(checkInData));

    // Wait a brief moment
    await new Promise(r => setTimeout(r, 1000));

    // CHECK OUT
    const checkOutRes = await fetch('http://127.0.0.1:3001/api/attendance/check-out', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const checkOutData = await checkOutRes.json();
    console.log('Check-out Response:', checkOutData);

    if (checkOutRes.status !== 200) throw new Error("Check-out failed: " + JSON.stringify(checkOutData));

    console.log('--- VERIFYING STATE ---');

    // Verify Attendance DB state
    const att = await db.get("SELECT * FROM attendance WHERE employee_id = $1 AND date = $2", [empDetails.id, today]);
    if (!att || att.payment_status !== 'PROCESSED') {
      throw new Error("Attendance payment_status was not updated correctly! Current: " + att?.payment_status);
    }
    console.log("✅ Attendance payment_status verified as PROCESSED");

    // Verify Employee Notification
    const empNotif = await db.get("SELECT * FROM notifications WHERE user_id = $1 AND title = 'Daily Payroll Processed' ORDER BY created_at DESC LIMIT 1", [employee.id]);
    if (!empNotif) {
      throw new Error("Employee notification not found!");
    }
    console.log("✅ Employee notification verified:", empNotif.message);

    // Verify HR Notification
    const hrUsers = await db.all("SELECT id FROM users WHERE role = 'hr'");
    for (const hr of hrUsers) {
      const hrNotif = await db.get("SELECT * FROM notifications WHERE user_id = $1 AND title = 'Employee Checked Out' ORDER BY created_at DESC LIMIT 1", [hr.id]);
      if (!hrNotif) {
        throw new Error("HR notification not found for HR user " + hr.id);
      }
      console.log(`✅ HR notification verified for HR ID ${hr.id}:`, hrNotif.message);
    }

    console.log('--- TEST PASSED SUCCESSFULLY ---');
  } catch (e) {
    console.error('TEST FAILED:', e);
  } finally {
    process.exit(0);
  }
}

runTest();
