import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Typography, Paper, Grid, Chip, Divider, Box, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person'; 
const extractUsername = (email) => {
  if (!email) return 'User';
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
};
export default function GlobalDashboardPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    axios.get('http://localhost:8080/api/users/all')
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        console.error("Failed to fetch all users:", err);
        setError('Could not load user data. Please ensure the backend is running.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const filteredUsers = users.filter(user => {
    const searchTerm = filter.toLowerCase();
    if (searchTerm === '') return true;
    const emailMatch = user.email.toLowerCase().includes(searchTerm);
    const numberMatch = user.armstrong_numbers.some(num => 
      String(num.number).includes(searchTerm)
    );
    return emailMatch || numberMatch;
  });
  return (
    <Paper sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom> Global Users Dashboard</Typography>
      <TextField
        label="Search by email or number..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        sx={{ mb: 3 }}
      /> 
      {loading && <Typography>Loading users...</Typography>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <Grid container spacing={3}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => {
              const uniqueNumbers = [...new Set(user.armstrong_numbers.map(num => num.number))];
              return (
                <Grid item key={user.id} xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, borderRadius: 2, height: '100%', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon />
                      <Typography variant="h6" component="h3">
                        {extractUsername(user.email)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="subtitle2" gutterBottom>Saved Numbers:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {uniqueNumbers.length > 0 ? (
                        uniqueNumbers.map(number => (
                          <Chip key={number} label={number} size="small" />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">None</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Typography sx={{ mt: 4, textAlign: 'center' }}>No users match your search.</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Paper>
  );
}