const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🚨 1. Command Injection
app.get('/ping', (req, res) => {
    const ip = req.query.ip;
    require('child_process').exec(`ping -c 1 ${ip}`, (err, stdout, stderr) => {
        if (err) return res.send('Error');
        res.send(stdout);
    });
});

// 🚨 2. Path Traversal
app.get('/read-file', (req, res) => {
    const filename = req.query.file;
    fs.readFile(`./files/${filename}`, 'utf8', (err, data) => {
        if (err) return res.send('Cannot read file');
        res.send(data);
    });
});

// 🚨 3. Hardcoded Secret
const SECRET_KEY = "my-super-secret-key-12345";

// 🚨 4. Insecure Cookie
app.get('/login', (req, res) => {
    res.cookie('session', 'abc123', { httpOnly: false, secure: false });
    res.send('Logged in!');
});

// 🚨 5. No Input Validation (XSS Potential)
app.post('/comment', (req, res) => {
    const comment = req.body.comment;
    res.send(`<div>User says: ${comment}</div>`);
});

app.listen(3000, () => console.log("Vulnerable app running on port 3000"));
