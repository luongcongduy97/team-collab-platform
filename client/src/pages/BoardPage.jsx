import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material';
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
        Team Boards
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}
      >
        <TextField
          label="Board Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #6a11cb, #2575fc)',
            fontWeight: 'bold',
            px: 4,
            ':hover': {
              background: 'linear-gradient(to right, #2575fc, #6a11cb)',
            },
          }}
        >
          Create
        </Button>
      </Box>
      {message && (
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      <Typography variant="h6" gutterBottom>
        Your Boards
      </Typography>

      <List>
        {boards.map((board) => (
          <Paper
            key={board.id}
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              transition: '0.2s',
              ':hover': { boxShadow: 4 },
            }}
          >
            <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {board.title}
                  </Typography>
                }
              />

              <Stack direction="row" spacing={1} sx={{ width: '100%', mt: 1 }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to={`/boards/${board.id}/tasks`}
                  sx={{ textTransform: 'none' }}
                >
                  View Tasks
                </Button>
              </Stack>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}

export default BoardPage;
