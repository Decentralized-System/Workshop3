const express = require('express');
const app = express();
const port = 3000; // You can use any available port here

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Hello World server listening at http://localhost:${port}`);
});
