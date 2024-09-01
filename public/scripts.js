// public/scripts.js
const socket = io();
let nickname = '';

function uploadImage() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];
    const reader = new FileReader();

    if (file) {
        reader.onload = function(event) {
            const imageData = event.target.result;
            socket.emit('chatMessage', { nickname, type: 'image', data: imageData });
        };
        reader.readAsDataURL(file);
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value;

    if (message.trim() !== '') {
        socket.emit('chatMessage', { nickname, type: 'text', data: message });
        input.value = ''; // 입력 필드 초기화
    }
}

socket.on('chatMessage', (msg) => {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    if (msg.type === 'text') {
        messageElement.textContent = `${msg.nickname || 'Anonymous'}: ${msg.data}`;
    } else if (msg.type === 'image') {
        const imgElement = document.createElement('img');
        imgElement.src = msg.data;
        messageElement.textContent = `${msg.nickname || 'Anonymous'}:`;
        messageElement.appendChild(imgElement);
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

document.getElementById('nicknameInput').addEventListener('change', (e) => {
    nickname = e.target.value.trim();
});
