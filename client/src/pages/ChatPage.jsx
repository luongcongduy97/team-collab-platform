import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Box, TextField, Button, Typography, List, ListItem } from '@mui/material';
import { useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5555/api';
const SOCKET_URL = API_URL.replace('/api', '');
const socket = io(SOCKET_URL);

function ChatPage() {
  const { teamId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && teamId) {
      socket.emit('join-team', { token, teamId });
    }

    socket.on('messages', (msgs) => setMessages(msgs));
    socket.on('new-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off('messages');
      socket.off('new-message');
    };
  }, [teamId]);

  const send = () => {
    const token = localStorage.getItem('token');
    if (!content.trim() || !token || !teamId) return;
    socket.emit('send-message', { token, teamId, content });
    setContent('');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Team Chat
      </Typography>
      <List sx={{ mb: 2 }}>
        {messages.map((m) => (
          <ListItem key={m.id} sx={{ display: 'block' }}>
            <strong>{m.user?.name || 'Unknown'}:</strong> {m.content}
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message"
        />
        <Button variant="contained" onClick={send}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ChatPage;
