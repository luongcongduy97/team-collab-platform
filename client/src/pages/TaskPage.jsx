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
    <ListItem
      key={task.id}
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        mb: 1,
      }}
    >
      {editingTaskId === task.id ? (
        <>
          <TextField
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Content"
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
            <Button
              type="button"
              variant="contained"
              size="small"
              onClick={() => handleUpdate(task.id)}
            >
              Save
            </Button>
            <Button type="button" size="small" onClick={cancelEdit}>
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography>{task.title}</Typography>
          {task.content && <Typography sx={{ mb: 1 }}>{task.content}</Typography>}
          {task.assigned && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Assigned: {task.assigned.name}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
              size="small"
            >
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
            <Button type="button" size="small" onClick={() => startEdit(task)}>
              Edit
            </Button>
            <Button
              type="button"
              size="small"
              onClick={() => handleDelete(task.id)}
              color="secondary"
            >
              Delete
            </Button>
          </Box>
        </>
      )}
    </ListItem>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Tasks
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          fullWidth
        />
        <TextField
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
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
        <Button type="submit" variant="contained">
          Add Task
        </Button>
      </Box>
      {message && (
        <Typography variant="body2" sx={{ mb: 2 }}>
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
