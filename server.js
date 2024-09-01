const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 클라이언트 소켓 연결 처리
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// 서버를 3000 포트에서 실행
server.listen(3000, () => {
    console.log('listening on *:3000');
});
