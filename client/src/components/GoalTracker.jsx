import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function GoalTracker({ goalMsg, weightGoal, weights, goalProgress, handleGoalSave, goalInput, setGoalInput }) {
  return (
    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 1 }} component="span">
        <span role="img" aria-label="target">🎯</span> <b>Weight Goal</b>
      </Typography>
      <Box sx={{ display: 'inline-block' }}>
        <form onSubmit={handleGoalSave} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TextField
            type="number"
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            placeholder="Set your goal"
            size="small"
            sx={{ width: 80, mr: 0.5 }}
          />
                      <Button type="submit" variant="contained" size="small" sx={{ background: '#27ae60', '&:hover': { background: '#229954' } }}>
              Save
            </Button>
        </form>
      </Box>
      {goalMsg && (
        <Typography variant="body2" color="success.main" sx={{ ml: 1 }} component="span">{goalMsg}</Typography>
      )}
      {weightGoal && weights.length > 1 && goalProgress && (
        <Box sx={{ mt: 1, width: 300, maxWidth: '90%' }}>
          <Typography variant="body2" sx={{ mb: 0.5 }} component="div">Current: <b>{goalProgress.latest} {goalProgress.unit}</b> | Goal: <b>{goalProgress.goal} {goalProgress.unit}</b></Typography>
          <Box sx={{ background: '#eee', borderRadius: 1, height: 18, overflow: 'hidden', boxShadow: 1 }}>
            <Box sx={{ width: `${goalProgress.percent}%`, background: '#27ae60', height: '100%', transition: 'width 0.5s' }}></Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} component="div">{goalProgress.percent}% toward your goal</Typography>
        </Box>
      )}
    </Box>
  );
} 