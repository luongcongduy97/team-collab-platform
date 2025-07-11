import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import api from '../api/api';

function Register() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setMessage('✅ Register success! Now login.');
      navigate('/teams');
    } catch (err) {
      const apiError = err.response?.data?.error;
      setMessage('❌ ' + (apiError || err.message || 'Unexpected error'));
    }
  };
  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, width: '100%' }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>

        <TextField
          name="name"
          label="Name"
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="email"
          label="Email"
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
        {message && (
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Register;
