import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, List, ListItem } from '@mui/material';
import api from '../api/api';

function BoardPage() {
  const { teamId } = useParams();
  const [boards, setBoards] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .get(`/teams/${teamId}/boards`)
      .then((res) => setBoards(res.data))
      .catch((err) => console.error(err));
  }, [teamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/teams/${teamId}/boards`, { title: newTitle });
      setBoards((prev) => [...prev, res.data]);
      setMessage('Board created successfully');
      setNewTitle('');
    } catch (err) {
      const apiError = err.response?.data?.error;
      setMessage(apiError || err.message || 'Error creating board');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Boards
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Board Title"
          required
          fullWidth
        />
        <Button variant="contained" type="submit">
          Create Board
        </Button>
      </Box>
      {message && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      <List>
        {boards.map((board) => (
          <ListItem
            key={board.id}
            sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1, boxShadow: 1 }}
          >
            <Typography sx={{ flexGrow: 1 }}>{board.title}</Typography>
            <Button component={RouterLink} to={`/boards/${board.id}/tasks`}>
              Tasks
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default BoardPage;
