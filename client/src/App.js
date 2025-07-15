import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import Register from './pages/Register';
import Login from './pages/Login';
import TeamPage from './pages/TeamPage';
import BoardPage from './pages/BoardPage';
import TaskPage from './pages/TaskPage';
import ChatPage from './pages/ChatPage';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            background: 'linear-gradient(to right, #6a11cb, #2575fc)',
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                Team Collaboration
              </Link>
            </Typography>
            {!isLoggedIn && (
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            )}
            {isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/chat">
                  Chat
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
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
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
