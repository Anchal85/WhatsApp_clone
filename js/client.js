document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://16.171.150.116:8000');

    //get DOM elements in respective js variables
    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector(".container");

    //Audio that will play on receiveing the meassage
    var audio = new Audio('iphone.mp3');

    //function which will append  event info to the container
    // const append = (message, position) => {
    //     const messageElement = document.createElement('div');
    //     messageElement.innerText = message;
    //     messageElement.classList.add('message');
    //     messageElement.classList.add(position);
    //     messageContainer.append(messageElement);
    //     if(position == 'left')
    //     audio.play();
    // };

// // use this are that
    const append = (message, position) => {
        const messageElement = document.createElement('div');
    
        // Use innerHTML to include bold styling
        messageElement.innerHTML = message.replace(
            /^(.+?):/, 
            '<b>$1</b>:'
        );
    
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
    
        if (position == 'left') {
            audio.play();
        }
    };

    //Ask new user for his/her name and let the server know
    const Name = prompt("Enter your name to join chat");
     socket.emit('new-user-joined', Name);

    //if a new  user joins, receive his/her name from the server
    socket.on('user-joined', name => {
        append(`${name} joined the chat`, 'right');
    });

    // if server send the message receive it
    socket.on('receive', data => {
        append(`${data.name}: ${data.message}`, 'left');
    });

    // if a user leaves the chat append the info to the container
    socket.on('left', name => {
        append(`${name} left the chat`, 'right');
    });

// if the form gets submitted, send server the message
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';        // for clear the input box after sending the message
    });

});
