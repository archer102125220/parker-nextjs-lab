import autocannon from 'autocannon';

// yarn autocannon -c 1000 http://localhost:3000
autocannon({
  url: 'http://localhost:3000',
  connections: 1000,
}, console.log);