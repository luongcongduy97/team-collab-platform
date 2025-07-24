import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

function TeamPage() {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState('');
  const [message, setMessage] = useState('');
  const [inviteInputs, setInviteInputs] = useState({});

  useEffect(() => {
    api
      .get('/teams/my')
      .then((res) => setTeams(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/teams', { name: newTeam });
      setTeams((prev) => [...prev, res.data]);
      setMessage('Team created successfully!');
      setNewTeam('');
    } catch (err) {
      const apiError = err.response?.data?.error;
      setMessage(apiError || err.message || 'Error creating team');
    }
  };

  const handleInviteInputChange = (teamId, value) => {
    setInviteInputs((prev) => ({ ...prev, [teamId]: value }));
  };

  const handleInvite = async (teamId) => {
    const email = inviteInputs[teamId];
    if (!email) return;

    try {
      await api.post(`/teams/${teamId}/invite-by-email`, { email });
      setMessage('User invited successfully');
      setInviteInputs((prev) => ({ ...prev, [teamId]: '' }));
    } catch (err) {
      const apiError = err.response?.data?.error;
      setMessage(apiError || err.message || 'Error inviting user');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Team Management
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}
      >
        <TextField
          label="New team name"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
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
          Create Team
        </Button>
      </Box>
      {message && (
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      <Typography variant="h6" gutterBottom>
        Your Teams
      </Typography>
      <List>
        {teams.map((team) => (
          <Paper
            key={team.id}
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              transition: '0.2s',
              ':hover': {
                boxShadow: 4,
              },
            }}
          >
            <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {team.name}
                  </Typography>
                }
              />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ width: '100%', mt: 1 }}
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to={`/teams/${team.id}/boards`}
                  sx={{ textTransform: 'none' }}
                >
                  View Boards
                </Button>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to={`/teams/${team.id}/chat`}
                  sx={{ textTransform: 'none' }}
                >
                  Chat
                </Button>
                <TextField
                  label="Invite by email"
                  size="small"
                  value={inviteInputs[team.id] || ''}
                  onChange={(e) => handleInviteInputChange(team.id, e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleInvite(team.id)}
                  sx={{ px: 3 }}
                >
                  Invite
                </Button>
              </Stack>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}

export default TeamPage;
