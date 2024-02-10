# B - E-commerce - Importance of redundancy

## Objectives

Understand the principles of service and data redundancies, its importance in system reliability and data integrity.

## Exercise - Simple Hello World Server

```bash
npm init
```

### `server.js`

```js
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
```

```bash
npm install express
```

### `dnsRegistry.js`

```js
const express = require('express');
const app = express();
const port = 3001;

app.get('/getServer', (req, res) => {
    res.json({code: 200, server: `http://localhost:${port}`});
});

app.listen(port, () => {
    console.log(`DNS Registry server listening at http://localhost:${port}`);
});
```

```bash
curl http://localhost:3001/getServer
```