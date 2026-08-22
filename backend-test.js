// backend-test.js — Comprehensive API test suite for Dayflow backend
const BASE = 'http://localhost:3001/api';

async function test() {
  const results = [];

  // === AUTH TESTS ===

  // 1. Invalid credentials
  let r = await fetch(BASE + '/auth/signin', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email:'wrong@test.com',password:'wrong'}) });
  results.push({test: 'Invalid credentials', status: r.status, pass: r.status === 401});

  // 2. Malformed input
  r = await fetch(BASE + '/auth/signin', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email:'notanemail',password:''}) });
  results.push({test: 'Malformed input', status: r.status, pass: r.status === 400});

  // 3. Valid HR login
  r = await fetch(BASE + '/auth/signin', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email:'hr@dayflow.com',password:'hr123'}) });
  const hrData = await r.json();
  results.push({test: 'HR login', status: r.status, pass: r.status === 200 && !!hrData.token && hrData.user.role === 'hr'});
  const hrToken = hrData.token;

  // 4. Valid Employee login
  r = await fetch(BASE + '/auth/signin', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email:'john@dayflow.com',password:'emp123'}) });
  const empData = await r.json();
  results.push({test: 'Employee login', status: r.status, pass: r.status === 200 && !!empData.token && empData.user.role === 'employee'});
  const empToken = empData.token;

  // 5. /me unauthenticated
  r = await fetch(BASE + '/auth/me');
  results.push({test: '/me unauthenticated', status: r.status, pass: r.status === 401});

  // 6. /me authenticated (HR)
  r = await fetch(BASE + '/auth/me', { headers: {'Authorization': 'Bearer ' + hrToken} });
  const meData = await r.json();
  results.push({test: '/me authenticated', status: r.status, pass: r.status === 200 && !!meData.user && !!meData.employee});

  // 7. Invalid JWT
  r = await fetch(BASE + '/auth/me', { headers: {'Authorization': 'Bearer invalidtoken123'} });
  results.push({test: 'Invalid JWT', status: r.status, pass: r.status === 403});

  // === SIGNUP TESTS ===

  // 8. Signup new employee
  r = await fetch(BASE + '/auth/signup', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email:'test-suite@dayflow.com',password:'test1234',firstName:'Test',lastName:'Suite',role:'employee'}) });
  const signupData = await r.json();
  results.push({test: 'Signup new employee', status: r.status, pass: r.status === 201 && !!signupData.login_id});

  // 9. Duplicate signup
  r = await fetch(BASE + '/auth/signup', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email:'test-suite@dayflow.com',password:'test1234',firstName:'Test',lastName:'Suite'}) });
  results.push({test: 'Duplicate signup', status: r.status, pass: r.status === 409});

  // 10. Login with new account
  r = await fetch(BASE + '/auth/signin', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email:'test-suite@dayflow.com',password:'test1234'}) });
  const newData = await r.json();
  results.push({test: 'Login new account', status: r.status, pass: r.status === 200 && newData.user.name === 'Test Suite'});

  // === ATTENDANCE TESTS ===

  // 11. Employee check-in
  r = await fetch(BASE + '/attendance/check-in', { method: 'POST', headers: {'Authorization': 'Bearer ' + empToken, 'Content-Type':'application/json'} });
  results.push({test: 'Employee check-in', status: r.status, pass: r.status === 200});

  // 12. Duplicate check-in
  r = await fetch(BASE + '/attendance/check-in', { method: 'POST', headers: {'Authorization': 'Bearer ' + empToken, 'Content-Type':'application/json'} });
  results.push({test: 'Duplicate check-in blocked', status: r.status, pass: r.status === 400});

  // 13. Today attendance
  r = await fetch(BASE + '/attendance/today', { headers: {'Authorization': 'Bearer ' + empToken} });
  const todayData = await r.json();
  results.push({test: 'Today attendance', status: r.status, pass: r.status === 200 && !!todayData.record});

  // 14. Check-out
  r = await fetch(BASE + '/attendance/check-out', { method: 'POST', headers: {'Authorization': 'Bearer ' + empToken, 'Content-Type':'application/json'} });
  results.push({test: 'Employee check-out', status: r.status, pass: r.status === 200});

  // 15. Duplicate check-out
  r = await fetch(BASE + '/attendance/check-out', { method: 'POST', headers: {'Authorization': 'Bearer ' + empToken, 'Content-Type':'application/json'} });
  results.push({test: 'Duplicate check-out blocked', status: r.status, pass: r.status === 400});

  // 16. Weekly attendance
  r = await fetch(BASE + '/attendance/weekly', { headers: {'Authorization': 'Bearer ' + empToken} });
  const weeklyData = await r.json();
  results.push({test: 'Weekly attendance', status: r.status, pass: r.status === 200 && Array.isArray(weeklyData.records)});

  // 17. HR cannot check-in (wrong role)
  r = await fetch(BASE + '/attendance/check-in', { method: 'POST', headers: {'Authorization': 'Bearer ' + hrToken, 'Content-Type':'application/json'} });
  results.push({test: 'HR cannot check-in (role guard)', status: r.status, pass: r.status === 403});

  // === LEAVE TESTS ===

  // 18. Employee creates leave
  r = await fetch(BASE + '/leave', { method: 'POST', headers: {'Authorization': 'Bearer ' + empToken, 'Content-Type':'application/json'}, body: JSON.stringify({leave_type:'PAID',start_date:'2026-10-01',end_date:'2026-10-03',reason:'Vacation'}) });
  results.push({test: 'Create leave', status: r.status, pass: r.status === 200});

  // 19. Employee views own leave
  r = await fetch(BASE + '/leave/my', { headers: {'Authorization': 'Bearer ' + empToken} });
  const myLeave = await r.json();
  results.push({test: 'Employee own leave', status: r.status, pass: r.status === 200 && myLeave.records.length > 0});

  // 20. HR views all leave
  r = await fetch(BASE + '/leave/all', { headers: {'Authorization': 'Bearer ' + hrToken} });
  const allLeave = await r.json();
  results.push({test: 'HR all leave', status: r.status, pass: r.status === 200 && allLeave.records.length > 0});

  // 21. Employee cannot view all leave
  r = await fetch(BASE + '/leave/all', { headers: {'Authorization': 'Bearer ' + empToken} });
  results.push({test: 'Employee cannot view all leave', status: r.status, pass: r.status === 403});

  // 22. HR approves leave
  if (allLeave.records && allLeave.records.length > 0) {
    const pendingLeave = allLeave.records.find(l => l.status === 'PENDING');
    if (pendingLeave) {
      r = await fetch(BASE + '/leave/' + pendingLeave.id + '/approve', { method: 'POST', headers: {'Authorization': 'Bearer ' + hrToken, 'Content-Type':'application/json'} });
      results.push({test: 'HR approve leave', status: r.status, pass: r.status === 200});
    } else {
      results.push({test: 'HR approve leave', status: 'N/A', pass: false});
    }
  }

  // 23. Employee cannot approve leave
  r = await fetch(BASE + '/leave/1/approve', { method: 'POST', headers: {'Authorization': 'Bearer ' + empToken, 'Content-Type':'application/json'} });
  results.push({test: 'Employee cannot approve leave', status: r.status, pass: r.status === 403});

  // === PAYROLL TESTS ===

  // 24. Employee sees own payroll
  r = await fetch(BASE + '/payroll/me', { headers: {'Authorization': 'Bearer ' + empToken} });
  const myPayroll = await r.json();
  results.push({test: 'Employee own payroll', status: r.status, pass: r.status === 200 && myPayroll.records.length > 0});

  // 25. Employee cannot see all payroll
  r = await fetch(BASE + '/payroll/all', { headers: {'Authorization': 'Bearer ' + empToken} });
  results.push({test: 'Employee cannot view all payroll', status: r.status, pass: r.status === 403});

  // 26. HR sees all payroll
  r = await fetch(BASE + '/payroll/all', { headers: {'Authorization': 'Bearer ' + hrToken} });
  const allPayroll = await r.json();
  results.push({test: 'HR all payroll', status: r.status, pass: r.status === 200 && allPayroll.records.length > 0});

  // === ANALYTICS TESTS ===

  // 27. HR analytics
  r = await fetch(BASE + '/analytics/hr', { headers: {'Authorization': 'Bearer ' + hrToken} });
  const analytics = await r.json();
  results.push({test: 'HR analytics', status: r.status, pass: r.status === 200 && typeof analytics.totalWorkforce === 'number'});

  // 28. Employee cannot access analytics
  r = await fetch(BASE + '/analytics/hr', { headers: {'Authorization': 'Bearer ' + empToken} });
  results.push({test: 'Employee cannot access analytics', status: r.status, pass: r.status === 403});

  // 29. Unauthenticated analytics
  r = await fetch(BASE + '/analytics/hr');
  results.push({test: 'Unauthenticated analytics', status: r.status, pass: r.status === 401});

  // === EMPLOYEES TESTS ===

  // 30. Employee list HR access
  r = await fetch(BASE + '/employees', { headers: {'Authorization': 'Bearer ' + hrToken} });
  let hrEmployees = await r.json();
  results.push({test: 'Employee list HR access', status: r.status, pass: r.status === 200 && Array.isArray(hrEmployees.employees)});

  // 31. Employee list employee access
  r = await fetch(BASE + '/employees', { headers: {'Authorization': 'Bearer ' + empToken} });
  results.push({test: 'Employee list employee access blocked', status: r.status, pass: r.status === 403});

  const targetEmpId = hrEmployees.employees && hrEmployees.employees.find(e => e.email === 'john@dayflow.com')?.id || 2;

  // 32. Employee profile HR access
  r = await fetch(BASE + '/employees/' + targetEmpId, { headers: {'Authorization': 'Bearer ' + hrToken} });
  results.push({test: 'Employee profile HR access', status: r.status, pass: r.status === 200});

  // 33. Employee profile own access
  r = await fetch(BASE + '/employees/' + targetEmpId, { headers: {'Authorization': 'Bearer ' + empToken} });
  results.push({test: 'Employee profile own access', status: r.status, pass: r.status === 200});

  // 34. Employee profile other employee access
  r = await fetch(BASE + '/employees/3', { headers: {'Authorization': 'Bearer ' + empToken} });
  results.push({test: 'Employee profile other access blocked', status: r.status, pass: r.status === 403});

  // 35. Employee updates phone/address
  r = await fetch(BASE + '/employees/' + targetEmpId, { 
    method: 'PUT', 
    headers: {'Authorization': 'Bearer ' + empToken, 'Content-Type': 'application/json'},
    body: JSON.stringify({ phone: '+919876543210', address: '123 Test St' })
  });
  results.push({test: 'Employee updates phone/address', status: r.status, pass: r.status === 200});

  // 36. Employee attempts salary modification
  r = await fetch(BASE + '/employees/' + targetEmpId, { 
    method: 'PUT', 
    headers: {'Authorization': 'Bearer ' + empToken, 'Content-Type': 'application/json'},
    body: JSON.stringify({ salary: 1000000 })
  });
  results.push({test: 'Employee attempts salary modification', status: r.status, pass: r.status === 403});

  // 37. HR updates employee
  r = await fetch(BASE + '/employees/' + targetEmpId, { 
    method: 'PUT', 
    headers: {'Authorization': 'Bearer ' + hrToken, 'Content-Type': 'application/json'},
    body: JSON.stringify({ department: 'Engineering', salary: 75000 })
  });
  results.push({test: 'HR updates employee', status: r.status, pass: r.status === 200});

  // === SIGNOUT ===
  // 38. Signout
  r = await fetch(BASE + '/auth/signout', { method: 'POST', headers: {'Authorization': 'Bearer ' + empToken} });
  results.push({test: 'Signout', status: r.status, pass: r.status === 200});

  // === PRINT RESULTS ===
  console.log('\n=== DAYFLOW BACKEND TEST RESULTS ===\n');
  let passed = 0, failed = 0;
  for (const t of results) {
    const icon = t.pass ? 'PASS' : 'FAIL';
    console.log(`  ${icon} | ${t.test} (HTTP ${t.status})`);
    if (t.pass) passed++; else failed++;
  }
  console.log(`\n  ${passed}/${passed+failed} tests passed`);
  if (failed > 0) console.log(`  ${failed} FAILURES`);
  else console.log('  ALL TESTS PASSED');
}

test().catch(err => {
  console.error('Test runner error:', err.message);
  process.exit(1);
});
