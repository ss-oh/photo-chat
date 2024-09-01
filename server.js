const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Express 앱 및 HTTP 서버 초기화
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 정적 파일 제공을 위해 'public' 디렉토리 사용
app.use(express.static('public'));

// Multer를 사용하여 파일 업로드 설정
const upload = multer({ dest: 'uploads/' });

// POST 요청을 처리하여 메시지와 이미지 파일을 서버로부터 수신
app.post('/send', upload.single('image'), (req, res) => {
    const { message, nickname } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // 클라이언트로부터 받은 메시지와 이미지를 모든 클라이언트에 브로드캐스트
    io.emit('chat message', { message, nickname, image });

    res.json({ status: 'success' }); // 응답으로 성공 상태 전송
});

// 업로드된 이미지 파일 제공을 위해 'uploads' 디렉토리 사용
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO 연결 설정
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// 서버를 3000 포트에서 실행
server.listen(3000, () => {
    console.log('listening on *:3000');
});
