const http = require('http');

// Create an HTTP server that listens on port 3000
// The server responds with a simple "Hello World" message
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

// The server is now listening on port 3000
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});