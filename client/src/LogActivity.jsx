import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const LogActivity = () => {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [unit, setUnit] = useState('minutes');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  let API_BASE_URL = import.meta.env.VITE_API_URL || 'https://week-7-devops-deployment-assignment-dxo6.onrender.com';
  if (!API_BASE_URL.endsWith('/api')) API_BASE_URL += '/api';

  // Client-side validation
  const validate = () => {
    if (!type.trim()) return 'Activity type is required.';
    if (!duration || isNaN(duration) || Number(duration) <= 0) return 'Duration must be a positive number.';
    if (!date) return 'Date is required.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const clientError = validate();
    if (clientError) {
      setError(clientError);
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/activities`, {
        type,
        duration,
        unit,
        caloriesBurned,
        date,
        notes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Activity logged successfully!');
      setType('');
      setDuration('');
      setUnit('minutes');
      setCaloriesBurned('');
      setDate(() => {
        const today = new Date();
        return today.toISOString().slice(0, 10);
      });
      setNotes('');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (err.response?.data?.error ? String(err.response.data.error) : '') ||
        'Failed to log activity'
      );
    }
    setLoading(false);
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        px: { xs: 2, sm: 3 }, 
        py: { xs: 2, sm: 4 },
        bgcolor: 'background.default', 
        color: 'text.primary',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box 
        sx={{ 
          width: '100%',
          maxWidth: { xs: '100%', sm: 500 },
          mx: 'auto'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 }, 
            borderRadius: 3,
            bgcolor: 'background.paper', 
            color: 'text.primary',
            boxShadow: theme.shadows[8]
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <FitnessCenterIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'primary.main', mb: 2 }} />
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              align="center" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              Log Your Activity
            </Typography>
            
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Track your workouts and physical activities
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Activity Type"
              type="text"
              value={type}
              onChange={e => setType(e.target.value)}
              fullWidth
              margin="normal"
              required
              placeholder="e.g., Running, Gym Workout, Yoga"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3, mt: 2 }}>
              <TextField
                label="Duration"
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                fullWidth
                required
                inputProps={{ min: 1 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              <Select 
                value={unit} 
                onChange={e => setUnit(e.target.value)}
                sx={{ 
                  minWidth: { xs: 100, sm: 120 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              >
                <MenuItem value="minutes">minutes</MenuItem>
                <MenuItem value="hours">hours</MenuItem>
              </Select>
            </Box>
            
            <TextField
              label="Calories Burned (optional)"
              type="number"
              value={caloriesBurned}
              onChange={e => setCaloriesBurned(e.target.value)}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            
            <TextField
              label="Notes (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              placeholder="How did you feel? Any achievements?"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {success}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ 
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8]
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Logging...' : 'Log Activity'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LogActivity; 