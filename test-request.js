const http = require('http');
http.get('http://localhost:3001/api/auth/me', (res) => { 
  let d=''; 
  res.on('data',c=>d+=c); 
  res.on('end',()=>console.log(d)); 
}).on('error',console.error);
