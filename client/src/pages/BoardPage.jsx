import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import './Main.css';

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
    <div className="page-container">
      <h2>Boards</h2>
      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Board Title"
          required
        />
        <button type="submit">Create Board</button>
      </form>
      <p>{message}</p>
      <ul className="card-list">
        {boards.map((board) => (
          <li key={board.id}>{board.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default BoardPage;
