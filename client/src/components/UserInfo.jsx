import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function UserInfo({ user }) {
  if (!user) return null;
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Welcome, {user.firstName || user.email}!
      </Typography>
      <Typography variant="body2">Email: {user.email}</Typography>
    </Box>
  );
} 