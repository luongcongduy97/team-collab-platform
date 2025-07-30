let ioInstance;
function init(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, { cors: { origin: '*' } });
  return ioInstance;
}
function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
}
module.exports = { init, getIO };
