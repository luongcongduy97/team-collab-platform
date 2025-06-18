import React, { useState, useEffect } from 'react';
import api from '../api/api';

function TeamPage() {
  const [teams, setTeams] = useState([]);
  // const [newTeam, setNewTeam] = useState('');
  // const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .get('/teams/my')
      .then((res) => setTeams(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Team Management</h2>

      <h3>All Teams</h3>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TeamPage;
