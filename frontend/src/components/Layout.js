import React from 'react';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CalculateIcon from '@mui/icons-material/Calculate'; 
import { useUser } from '../context/UserContext';
import Footer from './Footer';
const drawerWidth = 240;
const navItems = [
  { text: 'Registration', icon: <HomeIcon />, path: '/' },
  { text: 'Login', icon: <LoginIcon />, path: '/login' },
  { text: 'Verification', icon: <CheckCircleIcon />, path: '/verify' },
  { text: 'My Dashboard', icon: <PersonIcon />, path: '/dashboard' },
  { text: 'Global Dashboard', icon: <PeopleIcon />, path: '/global' },
];
const extractUsername = (email) => {
  if (!email) return '';
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
};
const Layout = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalculateIcon />
            <Typography variant="h6" noWrap component="div">
              Numbric
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={RouterLink} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        {currentUser && (
          <Box sx={{ marginTop: 'auto' }}>
            <Divider />
            <List>
              <ListItem>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary={extractUsername(currentUser.email)} secondary="Logged In" />
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar />
        <Box component="div" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};
export default Layout;