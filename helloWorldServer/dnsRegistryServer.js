const express = require('express');
const app = express();
const port = 3001; // Ensure this port is different from the first server


app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur DNS Registry!');
});


app.get('/getServer', (req, res) => {
  res.json({
    code: 200,
    server: `localhost:${port}`
  });
});


app.listen(port, () => {
  console.log(`DNS Registry server listening at http://localhost:${port}`);
});
