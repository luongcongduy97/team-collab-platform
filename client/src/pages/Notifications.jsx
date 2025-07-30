import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Typography, List, ListItem } from '@mui/material';
import api from '../api/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5555/api';
const SOCKET_URL = API_URL.replace('/api', '');
const ioClient = typeof window !== 'undefined' && window.io ? window.io : io;
const socket = ioClient(SOCKET_URL);

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.get('/teams/my').then((res) => {
      const teams = res.data || [];
      teams.forEach((team) => {
        socket.emit('join-team', { token, teamId: team.id });
      });
    });

    socket.on('task-created', (task) => {
      setNotifications((prev) => [...prev, `New task "${task.title}" created`]);
    });
    socket.on('task-updated', (task) => {
      setNotifications((prev) => [...prev, `Task "${task.title}" updated`]);
    });
    socket.on('task-deleted', () => {
      setNotifications((prev) => [...prev, 'Task deleted']);
    });

    return () => {
      socket.off('task-created');
      socket.off('task-updated');
      socket.off('task-deleted');
    };
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map((n, i) => (
          <ListItem key={i}>{n}</ListItem>
        ))}
      </List>
    </div>
  );
}

export default Notifications;
