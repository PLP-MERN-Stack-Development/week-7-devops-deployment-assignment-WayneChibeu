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

export default function WeightList({ weights, showWeights, setShowWeights, weightPageSize, setWeightPageSize, editingWeightId, setEditingWeightId, editingWeight, setEditingWeight, deletingWeightId, handleEditWeight, handleSaveWeight, handleDeleteWeight, weightsListRef, handleShowMoreWeights, handleShowLessWeights, navigate, user, randomQuote }) {
  return (
    <>
      <Box sx={{ position: 'static', bgcolor: 'background.paper', color: 'text.primary', paddingTop: 2, mb: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom>Recent Weights</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Showing {Math.min(showWeights, weights.length)} of {weights.length} entries
          <span style={{ marginLeft: 12 }}>
            Page size:
            <Select
              value={weightPageSize}
              onChange={e => { setWeightPageSize(Number(e.target.value)); setShowWeights(Number(e.target.value)); }}
              size="small"
              sx={{ ml: 0.5 }}
            >
              {[5, 10, 20].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
            </Select>
          </span>
        </Typography>
      </Box>
      {weights.length === 0 ? (
        <Box sx={{ textAlign: 'center', color: '#888', mt: 3 }}>
          <span style={{ fontSize: 48 }} role="img" aria-label="weight-lifter">🏋️‍♂️</span>
          <Typography variant="h6" component="h3" sx={{ mt: 1 }}>
            {user?.firstName ? `No weights logged yet, ${user.firstName}!` : 'No weights logged yet!'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>Start your journey by logging your first weight entry.</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/log-weight')}
            sx={{ mt: 1.5, mr: 1 }}
          >
            Log Weight
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {randomQuote}
          </Typography>
        </Box>
      ) : (
        <>
          <Box ref={weightsListRef} sx={{ transition: 'all 0.4s' }}>
            {weights.slice(0, showWeights).map((w, i) => (
              <Box
                key={w._id}
                sx={{
                  opacity: 0,
                  animation: 'fadeIn 0.5s forwards',
                  animationDelay: `${i * 0.05}s`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  background: editingWeightId === w._id ? (theme => theme.palette.mode === 'dark' ? '#222' : '#f9fbe7') : undefined,
                  '&:hover': {
                    background: editingWeightId === w._id ? (theme => theme.palette.mode === 'dark' ? '#222' : '#f9fbe7') : undefined,
                  },
                }}
              >
                {editingWeightId === w._id ? (
                  <>
                    <TextField
                      type="date"
                      value={editingWeight.date?.slice(0,10) || ''}
                      onChange={e => setEditingWeight(ew => ({ ...ew, date: e.target.value }))}
                      aria-label="Edit date"
                      size="small"
                      sx={{ width: 110, '& .MuiInputBase-input': { color: theme => theme.palette.text.primary }, '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary } }}
                    />
                    <TextField
                      type="number"
                      value={editingWeight.weight}
                      onChange={e => setEditingWeight(ew => ({ ...ew, weight: e.target.value }))}
                      aria-label="Edit weight"
                      size="small"
                      sx={{ width: 60, '& .MuiInputBase-input': { color: theme => theme.palette.text.primary }, '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary } }}
                    />
                    <Select
                      value={editingWeight.unit}
                      onChange={e => setEditingWeight(ew => ({ ...ew, unit: e.target.value }))}
                      aria-label="Edit unit"
                      size="small"
                      sx={{ width: 60, '& .MuiSelect-select': { color: theme => theme.palette.text.primary } }}
                    >
                      <MenuItem value="kg">kg</MenuItem>
                      <MenuItem value="lbs">lbs</MenuItem>
                    </Select>
                    <TextField
                      type="text"
                      value={editingWeight.notes || ''}
                      onChange={e => setEditingWeight(ew => ({ ...ew, notes: e.target.value }))}
                      aria-label="Edit notes"
                      size="small"
                      sx={{ width: 120, '& .MuiInputBase-input': { color: theme => theme.palette.text.primary }, '& .MuiInputLabel-root': { color: theme => theme.palette.text.secondary } }}
                    />
                    <Button
                      onClick={handleSaveWeight}
                      disabled={deletingWeightId === w._id}
                      aria-label="Save"
                      variant="contained"
                      size="small"
                      sx={{ background: '#27ae60', color: 'white', '&:hover': { background: '#229954' } }}
                    >
                      {deletingWeightId === w._id ? <CircularProgress size={20} /> : <SaveIcon />}
                    </Button>
                    <Button
                      onClick={() => setEditingWeightId(null)}
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
                    <Typography variant="body2">{w.date?.slice(0,10)}: {w.weight} {w.unit} {w.notes && `(${w.notes})`}</Typography>
                    <IconButton
                      onClick={() => handleEditWeight(w)}
                      aria-label="Edit"
                      title="Edit"
                      size="small"
                      sx={{ ml: 0.5, background: '#f1c40f', color: '#333', '&:hover': { background: '#f39c12' } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteWeight(w._id)}
                      disabled={deletingWeightId === w._id}
                      aria-label="Delete"
                      title="Delete"
                      size="small"
                      sx={{ ml: 0.5, background: '#e74c3c', color: 'white', '&:hover': { background: '#c62828' } }}
                    >
                      {deletingWeightId === w._id ? <CircularProgress size={20} /> : <DeleteIcon />}
                    </IconButton>
                  </>
                )}
              </Box>
            ))}
          </Box>
          <style>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>
          {showWeights < weights.length && (
            <Button
              onClick={handleShowMoreWeights}
              variant="contained"
              color="primary"
              sx={{ mt: 0.5, ml: 0.5, padding: '4px 14px', borderRadius: 4 }}
            >
              Show More
            </Button>
          )}
          {showWeights > weightPageSize && (
            <Button
              onClick={handleShowLessWeights}
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