import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function TrendsInsights({ weightChange, weightChange7, weightChange30, mostFrequentActivity, totalActivities, totalDuration, longestSession, mostActiveDay, streak, encouragement, goalMsg, weightGoal, weights, goalProgress, handleGoalSave, goalInput, setGoalInput }) {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2, sm: 3 }, mb: 3, bgcolor: 'background.paper', color: 'text.primary' }}>
      <Typography variant="h6" component="h2" gutterBottom>Trends & Insights</Typography>
      {weightChange ? (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1">
            <span role="img" aria-label="weight">⚖️</span> Weight change: <b style={{ color: parseFloat(weightChange.value) < 0 ? '#27ae60' : '#e67e22' }}>
              {parseFloat(weightChange.value) < 0 ? '⬇️' : '⬆️'} {Math.abs(weightChange.value)} {weightChange.unit}
            </b> ({weightChange.from} → {weightChange.to}) from {weightChange.startDate} to {weightChange.endDate}.
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Not enough data to show weight trend.</Typography>
      )}
      {weightChange7 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <span role="img" aria-label="calendar">📅</span> Last 7 days: <b style={{ color: parseFloat(weightChange7.value) < 0 ? '#27ae60' : '#e67e22' }}>
            {parseFloat(weightChange7.value) < 0 ? '⬇️' : '⬆️'} {Math.abs(weightChange7.value)} {weightChange7.unit}
          </b> ({weightChange7.from} → {weightChange7.to})
        </Typography>
      )}
      {weightChange30 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <span role="img" aria-label="calendar">📅</span> Last 30 days: <b style={{ color: parseFloat(weightChange30.value) < 0 ? '#27ae60' : '#e67e22' }}>
            {parseFloat(weightChange30.value) < 0 ? '⬇️' : '⬆️'} {Math.abs(weightChange30.value)} {weightChange30.unit}
          </b> ({weightChange30.from} → {weightChange30.to})
        </Typography>
      )}
      {mostFrequentActivity ? (
        <Typography variant="body2" sx={{ mt: 1 }}>
          <span role="img" aria-label="activity">🏅</span> Most frequent activity: <b>{mostFrequentActivity}</b>
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No activity data yet for insights.</Typography>
      )}
      <Typography variant="body2" sx={{ mt: 1 }}>
        <span role="img" aria-label="calendar">📅</span> Activities logged: <b>{totalActivities}</b>
        {totalActivities > 0 && (
          <> | Total duration: <b>{totalDuration} minutes</b></>
        )}
      </Typography>
      {longestSession && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          <span role="img" aria-label="stopwatch">⏱️</span> Longest session: <b>{longestSession} minutes</b>
        </Typography>
      )}
      {mostActiveDay && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          <span role="img" aria-label="star">⭐</span> Most active day: <b>{mostActiveDay}</b>
        </Typography>
      )}
      {streak > 1 && (
        <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
          <span role="img" aria-label="fire">🔥</span> Activity streak: <b>{streak} days</b>
        </Typography>
      )}
      {encouragement && (
        <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>{encouragement}</Typography>
      )}
      {/* Progress bar for goals */}
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
    </Paper>
  );
} 