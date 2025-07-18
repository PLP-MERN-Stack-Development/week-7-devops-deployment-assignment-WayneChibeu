import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScaleIcon from '@mui/icons-material/Scale';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function NavBar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const authenticatedMenuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Log Weight', path: '/log-weight', icon: <ScaleIcon /> },
    { text: 'Log Activity', path: '/log-activity', icon: <FitnessCenterIcon /> },
    { text: 'Progress Photos', path: '/progress-photos', icon: <PhotoCameraIcon /> },
  ];

  const unauthenticatedMenuItems = [
    { text: 'Login', path: '/login', icon: <LoginIcon /> },
    { text: 'Register', path: '/register', icon: <PersonAddIcon /> },
  ];

  const drawer = (
    <div style={{ minWidth: 240, background: theme.palette.background.default, height: '100%' }}>
      <List>
        {(isAuthenticated ? authenticatedMenuItems : unauthenticatedMenuItems).map((item) => (
          <ListItem 
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{ minHeight: 56, '&:hover': { background: theme.palette.action.hover } }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.primary }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem button onClick={handleLogout} sx={{ minHeight: 56, '&:hover': { background: theme.palette.action.hover } }}>
            <ListItemIcon sx={{ color: theme.palette.text.primary }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="static" elevation={2} sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              fontWeight: 700,
              letterSpacing: 1
            }}
          >
            Fitness Tracker
          </Typography>
          {!isMobile && (
            <>
              {isAuthenticated ? (
                <>
                  {authenticatedMenuItems.map(item => (
                  <Button 
                      key={item.text}
                    color="inherit" 
                    component={Link} 
                      to={item.path}
                      startIcon={item.icon}
                    sx={{ 
                      minWidth: 'auto',
                      px: { sm: 1, md: 2 },
                        fontSize: { sm: '0.95rem', md: '1.05rem' },
                        fontWeight: 500,
                        textTransform: 'none',
                        borderRadius: 2,
                        transition: 'background 0.2s',
                        '&:hover': { background: theme.palette.action.hover }
                      }}
                    >
                      {item.text}
                  </Button>
                  ))}
                  <Button 
                    color="inherit" 
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ 
                      minWidth: 'auto',
                      px: { sm: 1, md: 2 },
                      fontSize: { sm: '0.95rem', md: '1.05rem' },
                      fontWeight: 500,
                      textTransform: 'none',
                      borderRadius: 2,
                      transition: 'background 0.2s',
                      '&:hover': { background: theme.palette.action.hover }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  {unauthenticatedMenuItems.map(item => (
                  <Button 
                      key={item.text}
                    color="inherit" 
                    component={Link} 
                      to={item.path}
                      startIcon={item.icon}
                    sx={{ 
                      minWidth: 'auto',
                      px: { sm: 1, md: 2 },
                        fontSize: { sm: '0.95rem', md: '1.05rem' },
                        fontWeight: 500,
                        textTransform: 'none',
                        borderRadius: 2,
                        transition: 'background 0.2s',
                        '&:hover': { background: theme.palette.action.hover }
                      }}
                    >
                      {item.text}
                  </Button>
                  ))}
                </>
              )}
            </>
          )}
          <IconButton 
            sx={{ ml: 2, borderRadius: 2, bgcolor: theme.palette.action.selected, '&:hover': { bgcolor: theme.palette.action.hover } }} 
            onClick={() => setDarkMode(!darkMode)} 
            color="inherit"
            aria-label="toggle dark mode"
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              minHeight: '100vh',
              bgcolor: theme.palette.background.paper
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
} 