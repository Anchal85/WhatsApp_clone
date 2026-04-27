//node server which will handle socket.io connections
// const io = require('socket.io')(8000)

const cors = require('cors');
const io = require('socket.io')(8000, {
    cors: {
        origin: "*", // Allow requests from all origins
        methods: ["GET", "POST"]
    }
});

const users = {};

// if any new user joins, let other users connected to the server know!
io.on ('connection', socket =>{
    socket.on('new-user-joined', name =>{
        console.log("new user", name)
       users[socket.id] = name;
       socket.broadcast.emit('user-joined', name);
    });

// if someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});

    });

// if someone liave the chat, let others know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];

    });
})