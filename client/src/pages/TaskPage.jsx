import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import './Main.css';

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
    <li key={task.id} className="task-item">
      {editingTaskId === task.id ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Content"
          />
          <select value={editAssignedId} onChange={(e) => setEditAssignedId(e.target.value)}>
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <div className="task-actions">
            <button type="button" onClick={() => handleUpdate(task.id)}>
              Save
            </button>
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span>{task.title}</span>
          {task.content && <p>{task.content}</p>}
          {task.assigned && <span> (Assigned: {task.assigned.name})</span>}
          <div className="task-actions">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button type="button" onClick={() => startEdit(task)}>
              Edit
            </button>
            <button type="button" onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );

  return (
    <div className="page-container">
      <h2>Tasks</h2>
      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
        <select value={assignedId} onChange={(e) => setAssignedId(e.target.value)}>
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Task</button>
      </form>
      <p>{message}</p>
      <div className="task-columns">
        {[
          { key: 'todo', label: 'Todo' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'done', label: 'Done' },
        ].map((col) => (
          <div key={col.key} className="task-column">
            <h3>{col.label}</h3>
            <ul className="card-list task-list">
              {tasks.filter((t) => t.status === col.key).map((task) => renderTask(task))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskPage;
