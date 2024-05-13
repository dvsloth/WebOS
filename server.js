const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'host')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'host', 'html', 'bios.html'));
});

app.get('/9x', (req, res) => {
    res.sendFile(path.join(__dirname, 'host', 'html', '9x' ,'9x.html'));
});

app.get('/load', (req, res) => {
    res.sendFile(path.join(__dirname, 'host', 'html', 'load.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
