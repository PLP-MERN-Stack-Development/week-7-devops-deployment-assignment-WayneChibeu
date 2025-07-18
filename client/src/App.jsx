import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import LogWeight from './LogWeight';
import LogActivity from './LogActivity';
import NavBar from './NavBar';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ProgressPhotos from './ProgressPhotos';
import getTheme from './theme';

function App() {
  // Use the deployed backend URL or fallback to environment variable
  let API_BASE_URL = import.meta.env.VITE_API_URL || 'https://week-8-capstone-waynechibeu.onrender.com';
  if (!API_BASE_URL.endsWith('/api')) API_BASE_URL += '/api';
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const theme = getTheme(darkMode);

  // Persist theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    // Set body background and text color based on theme
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
  }, [theme]);

  useEffect(() => {
    axios.get(`${API_BASE_URL.replace('/api', '')}/`)
      .then(() => {
        // API is reachable
      })
      .catch(() => {
        // API connection error - handled silently
      });
  }, [API_BASE_URL]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Container>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/log-weight" element={<ProtectedRoute><LogWeight /></ProtectedRoute>} />
            <Route path="/log-activity" element={<ProtectedRoute><LogActivity /></ProtectedRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/progress-photos" element={<ProtectedRoute><ProgressPhotos /></ProtectedRoute>} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;