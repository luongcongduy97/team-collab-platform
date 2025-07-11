import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, List, ListItem } from '@mui/material';
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

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          placeholder="New team name"
          required
          fullWidth
        />
        <Button variant="contained" type="submit">
          Create Team
        </Button>
      </Box>
      {message && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      <Typography variant="h6" gutterBottom>
        All Teams
      </Typography>
      <List>
        {teams.map((team) => (
          <ListItem
            key={team.id}
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
              boxShadow: 1,
              alignItems: 'center',
            }}
          >
            <Typography sx={{ flexGrow: 1 }}>{team.name}</Typography>
            <Button component={RouterLink} to={`/teams/${team.id}/boards`} sx={{ mr: 1 }}>
              Boards
            </Button>
            <TextField
              placeholder="Email"
              value={inviteInputs[team.id] || ''}
              onChange={(e) => handleInviteInputChange(team.id, e.target.value)}
              size="small"
            />
            <Button
              onClick={() => handleInvite(team.id)}
              variant="contained"
              color="secondary"
              sx={{ ml: 1 }}
            >
              Invite
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default TeamPage;
