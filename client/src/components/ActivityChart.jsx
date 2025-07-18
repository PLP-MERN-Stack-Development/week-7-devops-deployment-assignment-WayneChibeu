import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Bar } from 'react-chartjs-2';

export default function ActivityChart({ activityChartData, activityChartOptions, activityTypes }) {
  return (
    <>
      <Typography variant="h5" component="h3" gutterBottom>Activity Summary</Typography>
      {activityTypes.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No activity data for chart.</Typography>
      ) : (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Bar data={activityChartData} options={activityChartOptions} />
        </Box>
      )}
    </>
  );
} 