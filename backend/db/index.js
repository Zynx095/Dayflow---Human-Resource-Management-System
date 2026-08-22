import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;
  
  dbInstance = await open({
    filename: process.env.DB_FILE || path.join(__dirname, 'dayflow.db'),
    driver: sqlite3.Database
  });
  
  // Enable foreign keys
  await dbInstance.run('PRAGMA foreign_keys = ON;');
  
  return dbInstance;
}

export async function initDb() {
  const db = await getDb();
  const schemaStr = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  await db.exec(schemaStr);
  
  // Seed initial data if users table is empty
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log('Seeding initial data...');
    const hrPassword = await bcrypt.hash('hr123', 10);
    const empPassword = await bcrypt.hash('emp123', 10);
    
    // Create HR User
    const hrRes = await db.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      ['hr@dayflow.com', hrPassword, 'hr']
    );
    
    // Create Employee User
    const empRes = await db.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      ['john@dayflow.com', empPassword, 'employee']
    );
    
    // Create HR Employee profile
    await db.run(
      `INSERT INTO employees (employee_id, user_id, name, email, department, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['EMP-000', hrRes.lastID, 'HR Admin', 'hr@dayflow.com', 'Human Resources', 'hr']
    );

    // Create Employee profile
    await db.run(
      `INSERT INTO employees (employee_id, user_id, name, email, department, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['EMP-001', empRes.lastID, 'John Doe', 'john@dayflow.com', 'Engineering', 'employee']
    );
    console.log('Seed complete.');
  }
}
