import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom'; 

export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/users', { email });
      login(response.data); 
      navigate('/dashboard'); 
    } catch (err) {
      setError('Failed to register user or email already exists.');
    }
  };
  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom> User Registration</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField 
          label="Email Address" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" size="large">
            Register
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}