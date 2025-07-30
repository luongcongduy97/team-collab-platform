// index.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const prisma = require('./src/prisma/client');
const socketHelper = require('./src/socket');
const app = express();
const server = http.createServer(app);
const io = socketHelper.init(server);
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

const authRoutes = require('./src/routes/auth.routes');
const teamRoutes = require('./src/routes/team.routes');
const boardRoutes = require('./src/routes/board.routes');
const taskRoutes = require('./src/routes/task.routes');
const messageRoutes = require('./src/routes/message.routes');
const notificationRoutes = require('./src/routes/notification.routes');

app.use(express.json());

app.get('/', (req, res) => res.send('Team Collaboration APIII'));

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/teams', boardRoutes);
app.use('/api/boards', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/teams', messageRoutes);
app.use('/api', notificationRoutes);

io.on('connection', (socket) => {
  socket.on('join-team', async ({ token, teamId }) => {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const team = await prisma.team.findFirst({
        where: { id: teamId, members: { some: { id: userId } } },
      });
      if (!team) return;

      socket.join(`team-${teamId}`);

      const messages = await prisma.message.findMany({
        where: { teamId },
        orderBy: { createdAt: 'asc' },
        include: { user: { select: { id: true, name: true } } },
      });
      socket.emit('messages', messages);
    } catch (err) {
      console.error('[JOIN_TEAM]', err);
    }
  });

  socket.on('send-message', async ({ token, teamId, content }) => {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      const team = await prisma.team.findFirst({
        where: { id: teamId, members: { some: { id: userId } } },
      });
      if (!team) return;

      const message = await prisma.message.create({
        data: { content, userId, teamId },
        include: { user: { select: { id: true, name: true } } },
      });
      io.to(`team-${teamId}`).emit('new-message', message);
    } catch (err) {
      console.error('[SOCKET_MESSAGE]', err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
