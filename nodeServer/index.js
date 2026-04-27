// Server to handle socket.io + serve frontend

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// 🔹 Serve frontend (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, '../')));

// 🔹 Socket.io setup
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

// 🔹 Handle connections
io.on('connection', socket => {

    socket.on('new-user-joined', name => {
        console.log("new user", name);
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

// 🔹 Start server
server.listen(8000, '0.0.0.0', () => {
    console.log("Server running on port 8000");
});