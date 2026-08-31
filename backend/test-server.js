const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello');
});
server.listen(4001, () => {
  console.log('HTTP Server is running on port 4001');
});
