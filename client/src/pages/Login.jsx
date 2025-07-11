import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import api from '../api/api';

function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      if (setIsLoggedIn) setIsLoggedIn(true);
      setMessage('✅ Login success!');
      navigate('/teams');
    } catch (err) {
      setMessage('❌ ' + err.response?.data?.error || 'Error');
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
          Login
        </Typography>
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
          Login
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

Login.propTypes = {
  setIsLoggedIn: PropTypes.func,
};

export default Login;
