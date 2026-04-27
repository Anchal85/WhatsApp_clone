const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Serve frontend
app.use(express.static(path.join(__dirname, '..')));

// Socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

const users = {};

io.on('connection', socket => {

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});

server.listen(8000, '0.0.0.0', () => {
    console.log("Server running on port 8000");
});