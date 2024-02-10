const express = require('express');
const app = express();
const port = 3001;

app.get('/getServer', (req, res) => {
    res.json({code: 200, server: `http://localhost:${port}`});
});

app.listen(port, () => {
    console.log(`DNS Registry server listening at http://localhost:${port}`);
});