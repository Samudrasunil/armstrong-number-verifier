import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Typography, Paper, Grid, Chip, Divider, Alert, Box, CircularProgress } from '@mui/material';
import { useUser } from '../context/UserContext';
import NumbersIcon from '@mui/icons-material/Numbers';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const extractUsername = (email) => {
  if (!email) return '';
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
};
const StatCard = ({ title, value, icon }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%', borderRadius: 2 }}>
    <Box sx={{ mr: 2, color: 'primary.main' }}>{icon}</Box>
    <Box>
      <Typography color="text.secondary">{title}</Typography>
      <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);
export default function UserDashboardPage() {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/users/${currentUser.id}/numbers`)
        .then(response => {
          setNumbers(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [currentUser]);
  const stats = useMemo(() => {
   if (!numbers || numbers.length === 0) {
      return {
        count: 0,
        largest: 'N/A',
        recent: 'N/A',
        uniqueNumbers: [], 
      };
    }
    const uniqueNumbers = [...new Set(numbers.map(item => item.number))];
    const largest = Math.max(...uniqueNumbers);
    const mostRecentRecord = numbers.reduce((latest, current) => 
      new Date(latest.created_at) > new Date(current.created_at) ? latest : current
    );
    return {
      count: uniqueNumbers.length,
      largest: largest,
      recent: mostRecentRecord.number,
      uniqueNumbers: uniqueNumbers.sort((a, b) => a - b),
    };
  }, [numbers]);
  if (!currentUser) {
    return (
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>My Dashboard</Typography>
        <Alert severity="warning">Please register or log in to see your dashboard.</Alert>
      </Paper>
    );
  }
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Dashboard</Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Welcome, <strong>{extractUsername(currentUser.email)}</strong>!
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}><StatCard title="Unique Numbers Found" value={stats.count} icon={<NumbersIcon fontSize="large"/>} /></Grid>
        <Grid item xs={12} sm={4}><StatCard title="Largest Number" value={stats.largest} icon={<StarIcon fontSize="large"/>} /></Grid>
        <Grid item xs={12} sm={4}><StatCard title="Most Recent" value={stats.recent} icon={<AccessTimeIcon fontSize="large"/>} /></Grid>
      </Grid>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Your Saved Armstrong Numbers</Typography>
        <Divider sx={{ mb: 2 }} />
        {stats.uniqueNumbers.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {stats.uniqueNumbers.map(number => (
              <Chip key={number} label={number} variant="outlined" />
            ))}
          </Box>
        ) : (
          <Typography sx={{ mt: 2 }}>You have not saved any Armstrong numbers yet.</Typography>
        )}
      </Paper>
    </Box>
  );
}