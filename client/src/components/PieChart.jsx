import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Pie } from 'react-chartjs-2';

export default function PieChart({ pieChartData, pieChartOptions, pieLabels }) {
  return (
    <>
      <Typography variant="h5" component="h3" gutterBottom>Activity Type Distribution</Typography>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 1 }}>
        {pieLabels.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No activity data for pie chart.</Typography>
        ) : (
          <Box sx={{ height: 300, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 1, p: 2 }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </Box>
        )}
      </Box>
    </>
  );
} 