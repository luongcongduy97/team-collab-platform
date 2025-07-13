import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  List,
  ListItem,
  Paper,
} from '@mui/material';
import api from '../api/api';

function TaskPage() {
  const { boardId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [assignedId, setAssignedId] = useState('');
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAssignedId, setEditAssignedId] = useState('');

  useEffect(() => {
    api
      .get(`/boards/${boardId}/tasks`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, [boardId]);

  useEffect(() => {
    api
      .get('/teams/my')
      .then((res) => {
        const teams = res.data || [];
        const team = teams.find((t) => t.boards.some((b) => b.id === boardId));
        setMembers(team ? team.members : []);
      })
      .catch((err) => console.error(err));
  }, [boardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/boards/${boardId}/tasks`, {
        title,
        content,
        assignedId: assignedId || undefined,
      });
      setTasks((prev) => [...prev, res.data]);
      setTitle('');
      setContent('');
      setAssignedId('');
      setMessage('Task created');
    } catch (err) {
      const apiError = err.response?.data?.error;
      setMessage(apiError || err.message || 'Error creating task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await api.put(`/boards/tasks/${taskId}`, { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/boards/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditContent(task.content || '');
    setEditAssignedId(task.assignedId || task.assigned?.id || '');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditContent('');
    setEditAssignedId('');
  };

  const handleUpdate = async (taskId) => {
    try {
      const res = await api.put(`/boards/tasks/${taskId}`, {
        title: editTitle,
        content: editContent,
        assignedId: editAssignedId || undefined,
      });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const renderTask = (task) => (
    <Paper
      key={task.id}
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
        {editingTaskId === task.id ? (
          <>
            <TextField
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              label="Content"
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
            <Select
              value={editAssignedId}
              onChange={(e) => setEditAssignedId(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {members.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" onClick={() => handleUpdate(task.id)}>
                Save
              </Button>
              <Button size="small" onClick={cancelEdit}>
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" fontWeight={600}>
              {task.title}
            </Typography>
            {task.content && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {task.content}
              </Typography>
            )}
            {task.assigned && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Assigned: {task.assigned.name}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="todo">Todo</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
              <Button size="small" onClick={() => startEdit(task)}>
                Edit
              </Button>
              <Button size="small" onClick={() => handleDelete(task.id)} color="secondary">
                Delete
              </Button>
            </Box>
          </>
        )}
      </ListItem>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Tasks
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
        />
        <Select
          value={assignedId}
          onChange={(e) => setAssignedId(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">Unassigned</MenuItem>
          {members.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #6a11cb, #2575fc)',
            fontWeight: 'bold',
            px: 3,
            ':hover': {
              background: 'linear-gradient(to right, #2575fc, #6a11cb)',
            },
          }}
        >
          Add Task
        </Button>
      </Box>
      {message && (
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        {[
          { key: 'todo', label: 'Todo' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'done', label: 'Done' },
        ].map((col) => (
          <Box key={col.key} sx={{ flex: 1 }}>
            <Typography variant="h6" align="center" gutterBottom>
              {col.label}
            </Typography>
            <List>{tasks.filter((t) => t.status === col.key).map((task) => renderTask(task))}</List>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default TaskPage;
