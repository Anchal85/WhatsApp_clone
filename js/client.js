document.addEventListener('DOMContentLoaded', () => {

    const socket = io("http://16.171.150.116:8000");

    // DOM elements
    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector(".container");

    // Audio
    const audio = new Audio('iphone.mp3');

    // Append message function
    const append = (message, position) => {
        const messageElement = document.createElement('div');

        messageElement.innerHTML = message.replace(
            /^(.+?):/,
            '<b>$1</b>:'
        );

        messageElement.classList.add('message');
        messageElement.classList.add(position);
        messageContainer.append(messageElement);

        // auto scroll
        messageContainer.scrollTop = messageContainer.scrollHeight;

        // play sound safely
        if (position === 'left') {
            audio.play().catch(() => {});
        }
    };

    // 🔥 LOAD OLD MESSAGES (NEW)
    socket.on('load-messages', (messages) => {
        messages.forEach(data => {
            append(`${data.name}: ${data.message}`, 'left');
        });
    });

    // Ask username
    const Name = prompt("Enter your name to join chat");
    socket.emit('new-user-joined', Name);

    // User joined
    socket.on('user-joined', name => {
        append(`${name} joined the chat`, 'right');
    });

    // Receive message
    socket.on('receive', data => {
        append(`${data.name}: ${data.message}`, 'left');
    });

    // User left
    socket.on('left', name => {
        append(`${name} left the chat`, 'right');
    });

    // Send message
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();

        // prevent empty message
        if (message === "") return;

        append(`You: ${message}`, 'right');
        socket.emit('send', message);

        messageInput.value = '';
    });

});