import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  PhotoCamera as PhotoIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const ProgressPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  let API_BASE_URL = import.meta.env.VITE_API_URL || 'https://week-7-devops-deployment-assignment-dxo6.onrender.com';
  if (!API_BASE_URL.endsWith('/api')) API_BASE_URL += '/api';

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/progress-photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos(res.data);
    } catch {
      setError('Failed to load progress photos.');
    }
    setLoading(false);
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    if (!image) {
      setError('Please select an image.');
      setUploading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', image);
      if (caption) formData.append('caption', caption);
      if (date) formData.append('date', date);
      await axios.post(`${API_BASE_URL}/progress-photos`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Photo uploaded successfully! 🎉');
      setImage(null);
      setImagePreview(null);
      setCaption('');
      setDate('');
      setOpenUploadDialog(false);
      fetchPhotos();
    } catch {
      setError('Failed to upload photo. Please try again.');
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/progress-photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Photo deleted successfully!');
      fetchPhotos();
    } catch {
      setError('Failed to delete photo. Please try again.');
    }
  };

  const handleViewPhoto = (photo) => {
    setSelectedPhoto(photo);
    setOpenViewDialog(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const photoDate = new Date(dateString);
    const diffTime = Math.abs(now - photoDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            📸 Progress Photos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your fitness journey with visual progress
          </Typography>
        </Box>
        <Fab
          color="primary"
          aria-label="add photo"
          onClick={() => setOpenUploadDialog(true)}
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Upload Dialog */}
      <Dialog 
        open={openUploadDialog} 
        onClose={() => setOpenUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Upload Progress Photo</Typography>
          <IconButton onClick={() => setOpenUploadDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpload} sx={{ mt: 2 }}>
            {/* Image Upload Area */}
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                mb: 3,
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => document.getElementById('image-input').click()}
            >
              {imagePreview ? (
                <Box>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 200, 
                      borderRadius: 8,
                      objectFit: 'cover'
                    }} 
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Click to change image
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <PhotoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Choose a photo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click to select an image file
                  </Typography>
                </Box>
              )}
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Caption (optional)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a description..."
                  multiline
                  rows={1}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenUploadDialog(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleUpload}
            disabled={!image || uploading}
            startIcon={uploading ? <LinearProgress sx={{ width: 20 }} /> : <UploadIcon />}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)'
              }
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Photo Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Progress Photo</Typography>
          <IconButton onClick={() => setOpenViewDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPhoto && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={`data:image/jpeg;base64,${selectedPhoto.image}`}
                alt={selectedPhoto.caption || 'Progress Photo'}
                style={{
                  maxWidth: '100%',
                  maxHeight: 500,
                  borderRadius: 8,
                  objectFit: 'contain'
                }}
              />
              {selectedPhoto.caption && (
                <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
                  "{selectedPhoto.caption}"
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {formatDate(selectedPhoto.date)}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Error and Success Messages */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setMessage('')} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {/* Photos Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      ) : photos.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <PhotoIcon sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
          <Typography variant="h5" gutterBottom>
            No Progress Photos Yet
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Start your visual fitness journey by uploading your first progress photo!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setOpenUploadDialog(true)}
            startIcon={<AddIcon />}
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Upload Your First Photo
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={photo._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`data:image/jpeg;base64,${photo.image}`}
                  alt={photo.caption || 'Progress Photo'}
                  sx={{ cursor: 'pointer', objectFit: 'cover' }}
                  onClick={() => handleViewPhoto(photo)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  {photo.caption && (
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      {photo.caption}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(photo.date)}
                    </Typography>
                    <Chip
                      label={getTimeAgo(photo.date)}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewPhoto(photo)}
                    title="View full size"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(photo._id)}
                    title="Delete photo"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Stats Section */}
      {photos.length > 0 && (
        <Paper sx={{ mt: 4, p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <Typography variant="h6" gutterBottom>
            📊 Photo Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {photos.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Photos
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  {photos.filter(p => p.caption).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  With Captions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {new Set(photos.map(p => p.date?.slice(0, 10))).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unique Dates
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {formatDate(photos[0]?.date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest Photo
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ProgressPhotos; 