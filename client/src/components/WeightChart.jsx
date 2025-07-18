import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Line } from 'react-chartjs-2';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function WeightChart({ weightChartData, weightChartOptions, weights }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 3, 
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.primary'
      }}
    >
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        component="h3" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 'bold',
          mb: 2
        }}
      >
        Weight Progress
      </Typography>
      {weights.length < 2 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          color: 'text.secondary'
        }}>
          <Typography variant="body2">
            Not enough data for chart. Log at least 2 weight entries to see your progress.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          width: '100%',
          height: { xs: 250, sm: 300, md: 350 },
          position: 'relative'
        }}>
          <Line 
            data={weightChartData} 
            options={{
              ...weightChartOptions,
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                ...weightChartOptions.plugins,
                legend: {
                  ...weightChartOptions.plugins?.legend,
                  labels: {
                    ...weightChartOptions.plugins?.legend?.labels,
                    font: {
                      size: isMobile ? 12 : 14
                    }
                  }
                }
              },
              scales: {
                ...weightChartOptions.scales,
                x: {
                  ...weightChartOptions.scales?.x,
                  ticks: {
                    ...weightChartOptions.scales?.x?.ticks,
                    font: {
                      size: isMobile ? 10 : 12
                    }
                  }
                },
                y: {
                  ...weightChartOptions.scales?.y,
                  ticks: {
                    ...weightChartOptions.scales?.y?.ticks,
                    font: {
                      size: isMobile ? 10 : 12
                    }
                  }
                }
              }
            }} 
          />
        </Box>
      )}
    </Paper>
  );
} 