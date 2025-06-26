import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import './Main.css';

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
    <div className="page-container">
      <h2>Team Management</h2>

      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          placeholder="New team name"
          required
        />
        <button type="submit">Create Team</button>
      </form>
      <p>{message}</p>

      <h3>All Teams</h3>
      <ul className="card-list">
        {teams.map((team) => (
          <li key={team.id}>
            <span>{team.name}</span>
            <Link to={`/teams/${team.id}/boards`}>Boards</Link>
            <input
              placeholder="Email"
              value={inviteInputs[team.id] || ''}
              onChange={(e) => handleInviteInputChange(team.id, e.target.value)}
            />
            <button onClick={() => handleInvite(team.id)}>Invite</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamPage;
