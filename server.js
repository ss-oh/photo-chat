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
    console.log('A user connected');

    // 채팅 메시지 수신 처리
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });

    // 소켓 연결 종료 처리
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// 서버를 3000 포트에서 실행
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
