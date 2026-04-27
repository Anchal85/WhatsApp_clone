document.addEventListener('DOMContentLoaded', () => {

    // ✅ IMPORTANT: connect to SAME server
    const socket = io("http://13.60.44.89:8000");

    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector(".container");

    // append messages
    const append = (message, position) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = message;
        messageElement.classList.add('message', position);
        messageContainer.append(messageElement);
    };

    // ask username
    const name = prompt("Enter your name");
    socket.emit('new-user-joined', name);

    // when someone joins
    socket.on('user-joined', name => {
        append(`<b>${name}</b> joined`, 'right');
    });

    // receive message
    socket.on('receive', data => {
        append(`<b>${data.name}</b>: ${data.message}`, 'left');
    });

    // when someone leaves
    socket.on('left', name => {
        append(`<b>${name}</b> left`, 'right');
    });

    // send message
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;

        append(`<b>You</b>: ${message}`, 'right');

        socket.emit('send', message);

        messageInput.value = '';
    });

});