const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// ✅ FIXED path to frontend
app.use(express.static(path.join(__dirname, '..')));

const io = new Server(server, {
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

// ✅ send index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

server.listen(8000, () => {
    console.log("Server running on port 8000");
});