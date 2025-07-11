import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  Navigate,
} from 'react-router-dom';
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Register from './pages/Register';
import Login from './pages/Login';
import TeamPage from './pages/TeamPage';
import BoardPage from './pages/BoardPage';
import TaskPage from './pages/TaskPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #6c63ff, #ff6584)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Team Collaboration
          </Typography>

          {!isLoggedIn && (
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
          )}
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2 }}>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/teams" /> : <Navigate to="/login" />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/teams" element={<TeamPage />} />
          <Route path="/teams/:teamId/boards" element={<BoardPage />} />
          <Route path="/boards/:boardId/tasks" element={<TaskPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
