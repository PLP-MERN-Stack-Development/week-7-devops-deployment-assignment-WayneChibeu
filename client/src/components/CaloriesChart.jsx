import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Line } from 'react-chartjs-2';

export default function CaloriesChart({ caloriesChartData, caloriesChartOptions, caloriesLabels }) {
  return (
    <>
      <Typography variant="h5" component="h3" gutterBottom>Calories Burned Over Time</Typography>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 1 }}>
        {caloriesLabels.length < 2 ? (
          <Typography variant="body2" color="text.secondary">Not enough activity data for calories chart.</Typography>
        ) : (
          <Box sx={{ height: 300, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 1, p: 2 }}>
            <Line data={caloriesChartData} options={caloriesChartOptions} />
          </Box>
        )}
      </Box>
    </>
  );
} 