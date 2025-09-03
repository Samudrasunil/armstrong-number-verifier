import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); // State to hold validation error
  const { login } = useUser();
  const navigate = useNavigate();

  const validate = () => {
    if (!email) {
      setError('Email address cannot be empty.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Stop submission if validation fails
    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users/login', { email });
      login(response.data); // Set the user in our global context
      navigate('/dashboard'); // Redirect to their dashboard on successful login
    } catch (err) {
      setError('No user found with that email address.');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      
      {/* Display a general error alert if the API call fails */}
      {error && !email.includes('@') === false && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField 
          label="Email Address" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          // Display inline validation error message
          error={!!error}
          helperText={error}
        />
        {/* This Box centers the button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" size="large">
            Login
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}