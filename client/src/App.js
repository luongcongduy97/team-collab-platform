import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import TeamPage from './pages/TeamPage';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Team Collaboration</h1>
        <nav>
          <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teams" element={<TeamPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
