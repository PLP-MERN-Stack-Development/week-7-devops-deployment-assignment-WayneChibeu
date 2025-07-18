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
import ScaleIcon from '@mui/icons-material/Scale';

const LogWeight = () => {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kg');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  let API_BASE_URL = import.meta.env.VITE_API_URL || 'https://week-7-devops-deployment-assignment-dxo6.onrender.com';
  if (!API_BASE_URL.endsWith('/api')) API_BASE_URL += '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/weights`, {
        weight,
        unit,
        date,
        notes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Weight logged successfully!');
      setWeight('');
      setUnit('kg');
      setDate('');
      setNotes('');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log weight');
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
            <ScaleIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'primary.main', mb: 2 }} />
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
              Log Your Weight
            </Typography>
            
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Track your weight progress to stay motivated
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
              <TextField
                label="Weight"
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                fullWidth
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
              <Select 
                value={unit} 
                onChange={e => setUnit(e.target.value)}
                sx={{ 
                  minWidth: { xs: 80, sm: 100 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              >
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="lbs">lbs</MenuItem>
              </Select>
            </Box>
            
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
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
                {loading ? 'Logging...' : 'Log Weight'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LogWeight; 