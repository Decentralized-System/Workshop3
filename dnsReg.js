const express = require('express');
const app = express();
const port = 3002;

app.get('/getServer', (req, res) => {
    const serverUrl = `localhost:${port}`;
    res.json({ code: 200, server: serverUrl });
});

app.listen(port, () => {
    console.log(`DNS registry server is running on port ${port}`);
});
