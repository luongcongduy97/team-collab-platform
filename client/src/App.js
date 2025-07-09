import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import TeamPage from './pages/TeamPage';
import BoardPage from './pages/BoardPage';
import TaskPage from './pages/TaskPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Team Collaboration</h1>
          <nav>
            <Link to="/register">Register</Link>
            {isLoggedIn ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </nav>
        </header>
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
      </div>
    </Router>
  );
}

export default App;
