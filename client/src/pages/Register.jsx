import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', form);
      setMessage('✅ Register success! Now login.');
    } catch (err) {
      const apiError = err.response?.data?.error;
      setMessage('❌ ' + (apiError || err.message || 'Unexpected error'));
    }
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Register;
