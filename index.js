// index.js
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

const authRoutes = require('./src/routes/auth.routes');
const teamRoutes = require('./src/routes/team.routes');
const boardRoutes = require('./src/routes/board.routes');
const taskRoutes = require('./src/routes/task.routes');

app.use(express.json());

app.get('/', (req, res) => res.send('Team Collaboration APIII'));

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/teams', boardRoutes);
app.use('/api/boards', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
