// index.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const prisma = require('./src/prisma/client');
const app = express();
const server = http.createServer('app');
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

const authRoutes = require('./src/routes/auth.routes');
const teamRoutes = require('./src/routes/team.routes');
const boardRoutes = require('./src/routes/board.routes');
const taskRoutes = require('./src/routes/task.routes');
const messageRoutes = require('./src/routes/message.routes');

app.use(express.json());

app.get('/', (req, res) => res.send('Team Collaboration APIII'));

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/teams', boardRoutes);
app.use('/api/boards', taskRoutes);
app.use('/api/messages', messageRoutes);

io.on('connection', async (socket) => {
  const messages = await prisma.message.findMany({
    orderBy: { createAt: 'asc' },
    include: { user: { select: { id: true, name: true } } },
  });
  socket.emit('messages', messages);

  socket.on('send-message', async ({ token, content }) => {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const message = await prisma.message.create({
        data: { content, userId },
        include: { user: { select: { id: true, name: true } } },
      });
      io.emit('new-message', message);
    } catch (err) {
      console.error('[SOCKET_MESSAGE]', err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
