document.addEventListener('DOMContentLoaded', () => {

    const socket = io("http://13.60.44.89:8000");

    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector(".container");

    const audio = new Audio('iphone.mp3');

    const append = (message, position) => {
        const messageElement = document.createElement('div');

        messageElement.innerHTML = message.replace(
            /^(.+?):/,
            '<b>$1</b>:'
        );

        messageElement.classList.add('message', position);
        messageContainer.append(messageElement);

        messageContainer.scrollTop = messageContainer.scrollHeight;

        if (position === 'left') {
            audio.play().catch(() => {});
        }
    };

    const Name = prompt("Enter your name to join chat");
    socket.emit('new-user-joined', Name);

    socket.on('user-joined', name => {
        append(`${name} joined the chat`, 'right');
    });

    socket.on('receive', data => {
        append(`${data.name}: ${data.message}`, 'left');
    });

    socket.on('left', name => {
        append(`${name} left the chat`, 'right');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (message === "") return;

        append(`You: ${message}`, 'right');
        socket.emit('send', message);

        messageInput.value = '';
    });

});