const socketio = require('socket.io');

let io;

// object to hold all connected users
const users = [];

const onJoined = (sock) => {
  const socket = sock;

  //stuff that happens when a user joins
  socket.on('join', (data) => {
    socket.join('room1');
    console.log(`${data.username} has joined room 1 as ${data.nickname}`);
    socket.username = data.username;
  });
};

const onMessage = (sock) => {
  const socket = sock;

  socket.on('requestMessage', (data) => {
    io.sockets.in('room1').emit('serveMessage', { nickname: data.nickname, message: data.message });
  });
};

const onDisconnect = (sock) => {
  const socket = sock;
  socket.on('disconnect', () => {
    console.log(`${socket.username} has disconnected`);
    socket.leave('room1');
  });
};

const server = (app) => {
  // pass http server into socketio
  io = socketio(app);

  io.sockets.on('connection', (socket) => {
    console.log('connecting');

    onJoined(socket);
    onMessage(socket);
    onDisconnect(socket);
  });

  console.log('Websocket server started');
};

module.exports = server;

