import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function ActivityList({ activities, showActivities, setShowActivities, activityPageSize, setActivityPageSize, editingActivityId, setEditingActivityId, editingActivity, setEditingActivity, deletingActivityId, handleEditActivity, handleSaveActivity, handleDeleteActivity, activitiesListRef, handleShowMoreActivities, handleShowLessActivities, navigate, user, randomQuote }) {
  return (
    <>
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', color: 'text.primary', zIndex: 2, paddingTop: 2, mb: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom>Recent Activities</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Showing {Math.min(showActivities, activities.length)} of {activities.length} entries
          <span style={{ marginLeft: 12 }}>
            Page size:
            <Select
              value={activityPageSize}
              onChange={e => { setActivityPageSize(Number(e.target.value)); setShowActivities(Number(e.target.value)); }}
              size="small"
              sx={{ ml: 0.5 }}
            >
              {[5, 10, 20].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
            </Select>
          </span>
        </Typography>
      </Box>
      {activities.length === 0 ? (
        <Box sx={{ textAlign: 'center', color: '#888', mt: 3 }}>
          <span style={{ fontSize: 48 }} role="img" aria-label="runner">🏃‍♀️</span>
          <Typography variant="h6" component="h3" sx={{ mt: 1 }}>
            {user?.firstName ? `No activities logged yet, ${user.firstName}!` : 'No activities logged yet!'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>Ready to get moving? Log your first activity!</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/log-activity')}
            sx={{ mt: 1.5, mr: 1 }}
          >
            Log Activity
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {randomQuote}
          </Typography>
        </Box>
      ) : (
        <>
          <Box ref={activitiesListRef} sx={{ transition: 'all 0.4s' }}>
            {activities.slice(0, showActivities).map((a, i) => (
              <Box
                key={a._id}
                sx={{
                  opacity: 0,
                  animation: 'fadeIn 0.5s forwards',
                  animationDelay: `${i * 0.05}s`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  background: editingActivityId === a._id ? (theme => theme.palette.mode === 'dark' ? '#222' : '#f9fbe7') : undefined,
                  '&:hover': {
                    background: editingActivityId === a._id ? (theme => theme.palette.mode === 'dark' ? '#222' : '#f9fbe7') : undefined,
                  },
                }}
              >
                {editingActivityId === a._id ? (
                  <>
                    <TextField
                      type="date"
                      value={editingActivity.date?.slice(0,10) || ''}
                      onChange={e => setEditingActivity(ea => ({ ...ea, date: e.target.value }))}
                      aria-label="Edit date"
                      size="small"
                      sx={{ width: 110, '& .MuiInputBase-input': { color: theme => theme.palette.text.primary }, '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary } }}
                    />
                    <TextField
                      type="text"
                      value={editingActivity.type}
                      onChange={e => setEditingActivity(ea => ({ ...ea, type: e.target.value }))}
                      aria-label="Edit type"
                      size="small"
                      sx={{ width: 90, '& .MuiInputBase-input': { color: theme => theme.palette.text.primary }, '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary } }}
                    />
                    <TextField
                      type="number"
                      value={editingActivity.duration}
                      onChange={e => setEditingActivity(ea => ({ ...ea, duration: e.target.value }))}
                      aria-label="Edit duration"
                      size="small"
                      sx={{ width: 60, '& .MuiInputBase-input': { color: theme => theme.palette.text.primary }, '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary } }}
                    />
                    <Select
                      value={editingActivity.unit}
                      onChange={e => setEditingActivity(ea => ({ ...ea, unit: e.target.value }))}
                      aria-label="Edit unit"
                      size="small"
                      sx={{ width: 60, '& .MuiSelect-select': { color: theme => theme.palette.text.primary } }}
                    >
                      <MenuItem value="minutes">minutes</MenuItem>
                      <MenuItem value="hours">hours</MenuItem>
                    </Select>
                    <TextField
                      type="number"
                      value={editingActivity.caloriesBurned || ''}
                      onChange={e => setEditingActivity(ea => ({ ...ea, caloriesBurned: e.target.value }))}
                      aria-label="Edit calories burned"
                      size="small"
                      sx={{ width: 80, '& .MuiInputBase-input': { color: theme => theme.palette.text.primary }, '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary } }}
                    />
                    <TextField
                      type="text"
                      value={editingActivity.notes || ''}
                      onChange={e => setEditingActivity(ea => ({ ...ea, notes: e.target.value }))}
                      aria-label="Edit notes"
                      size="small"
                      sx={{ width: 120, '& .MuiInputBase-input': { color: theme => theme.palette.text.primary }, '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary } }}
                    />
                    <Button
                      onClick={handleSaveActivity}
                      disabled={deletingActivityId === a._id}
                      aria-label="Save"
                      variant="contained"
                      size="small"
                      sx={{ background: '#27ae60', color: 'white', '&:hover': { background: '#229954' } }}
                    >
                      {deletingActivityId === a._id ? <CircularProgress size={20} /> : <SaveIcon />}
                    </Button>
                    <Button
                      onClick={() => setEditingActivityId(null)}
                      aria-label="Cancel"
                      variant="outlined"
                      size="small"
                      sx={{ ml: 0.5, background: '#aaa', color: 'white', '&:hover': { background: '#7986cb' } }}
                    >
                      <CancelIcon />
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body2">{a.date?.slice(0,10)}: {a.type} - {a.duration} {a.unit} {a.notes && `(${a.notes})`}</Typography>
                    <IconButton
                      onClick={() => handleEditActivity(a)}
                      aria-label="Edit"
                      title="Edit"
                      size="small"
                      sx={{ ml: 0.5, background: '#f1c40f', color: '#333', '&:hover': { background: '#f39c12' } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteActivity(a._id)}
                      disabled={deletingActivityId === a._id}
                      aria-label="Delete"
                      title="Delete"
                      size="small"
                      sx={{ ml: 0.5, background: '#e74c3c', color: 'white', '&:hover': { background: '#c62828' } }}
                    >
                      {deletingActivityId === a._id ? <CircularProgress size={20} /> : <DeleteIcon />}
                    </IconButton>
                  </>
                )}
              </Box>
            ))}
          </Box>
          <style>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>
          {showActivities < activities.length && (
            <Button
              onClick={handleShowMoreActivities}
              variant="contained"
              color="primary"
              sx={{ mt: 0.5, ml: 0.5, padding: '4px 14px', borderRadius: 4 }}
            >
              Show More
            </Button>
          )}
          {showActivities > activityPageSize && (
            <Button
              onClick={handleShowLessActivities}
              variant="outlined"
              color="primary"
              sx={{ mt: 0.5, ml: 0.5, padding: '4px 14px', borderRadius: 4 }}
            >
              Show Less
            </Button>
          )}
        </>
      )}
    </>
  );
} 