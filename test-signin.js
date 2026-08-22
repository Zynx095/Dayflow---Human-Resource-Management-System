const http = require('http');

fetch('http://localhost:3000/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'hr@dayflow.com', password: 'hr123' })
})
.then(async res => {
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
})
.catch(console.error);
