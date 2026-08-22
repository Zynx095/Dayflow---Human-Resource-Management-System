// Wait, Node.js v18+ has built-in fetch. I'll use built-in fetch.

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('--- STARTING DAYFLOW BACKEND TESTS ---');

  let empToken = '';
  let hrToken = '';

  // 1 & 11. Invalid login (Invalid input + Invalid credentials)
  console.log('\n[Test 1] Invalid login (Invalid Input)');
  let res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: '' })
  });
  console.log('Status:', res.status, await res.json());

  console.log('\n[Test 2] Invalid login (Wrong credentials)');
  res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'john@dayflow.com', password: 'wrong' })
  });
  console.log('Status:', res.status, await res.json());

  // 1. Valid login (Employee)
  console.log('\n[Test 3] Valid login (Employee)');
  res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'john@dayflow.com', password: 'emp123' })
  });
  const empData = await res.json();
  console.log('Status:', res.status, 'Token received:', !!empData.token);
  empToken = empData.token;

  // Valid login (HR)
  res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'hr@dayflow.com', password: 'hr123' })
  });
  const hrData = await res.json();
  hrToken = hrData.token;

  // 3. Employee session
  console.log('\n[Test 4] Employee Session (/auth/me)');
  res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  console.log('Status:', res.status, await res.json());

  // 10. Unauthorized access attempt (HR trying to access employee check-in)
  console.log('\n[Test 5] Unauthorized access attempt (HR checking in)');
  res = await fetch(`${BASE_URL}/attendance/check-in`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${hrToken}` }
  });
  console.log('Status:', res.status, await res.json());

  // 6. Check-out before check-in rejection
  console.log('\n[Test 6] Check-out before check-in rejection');
  res = await fetch(`${BASE_URL}/attendance/check-out`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  console.log('Status:', res.status, await res.json());

  // 4. Check-in
  console.log('\n[Test 7] Check-in');
  res = await fetch(`${BASE_URL}/attendance/check-in`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  console.log('Status:', res.status, await res.json());

  // 5. Duplicate check-in rejection
  console.log('\n[Test 8] Duplicate check-in rejection');
  res = await fetch(`${BASE_URL}/attendance/check-in`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  console.log('Status:', res.status, await res.json());

  // 8. Today's attendance
  console.log('\n[Test 9] Today attendance');
  res = await fetch(`${BASE_URL}/attendance/today`, {
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  console.log('Status:', res.status, await res.json());

  // 6. Check-out
  console.log('\n[Test 10] Check-out');
  // Wait 1 second to ensure a minimal time difference for worked_hours
  await new Promise(r => setTimeout(r, 1000));
  res = await fetch(`${BASE_URL}/attendance/check-out`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  console.log('Status:', res.status, await res.json());

  // 7. Duplicate check-out rejection
  console.log('\n[Test 11] Duplicate check-out rejection');
  res = await fetch(`${BASE_URL}/attendance/check-out`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  console.log('Status:', res.status, await res.json());

  // 9. Weekly attendance
  console.log('\n[Test 12] Weekly attendance');
  res = await fetch(`${BASE_URL}/attendance/weekly`, {
    headers: { 'Authorization': `Bearer ${empToken}` }
  });
  console.log('Status:', res.status, await res.json());

  console.log('\n--- TESTS COMPLETE ---');
}

runTests().catch(console.error);
