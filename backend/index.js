const childProcess = require('child_process');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

require('./csv').setupCsv();

if (process.platform === 'win32') {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.on('SIGINT', () => process.emit('SIGINT'));
}

const port = process.env.PORT || 4001;
const app = express();

app.use((req, res, next) => {
    console.log('[HTTP] ' + [req.method, req.url, "query=" + JSON.stringify(req.query)].join(' | '));
    next();
});
app.use(express.static(path.join(__dirname, '../react-ui/build')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../react-ui/build/index.html')));

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
    console.log('[SOCK] New client connected!');
    socket.on('disconnect', () => console.log('[SOCK] Client disconnected!'));
    require('./serial')(socket);
});

server.listen(port, () => {
    console.log(`[HTTP] Listening on port ${port}`);
    childProcess.exec(`chromium-browser --start-fullscreen --kiosk --app=http://localhost:${port}/`);
});