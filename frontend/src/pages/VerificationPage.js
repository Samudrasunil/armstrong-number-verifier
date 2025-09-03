import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Paper, Alert, Stack } from '@mui/material';
import { useUser } from '../context/UserContext';
const extractUsername = (email) => {
  if (!email) return '';
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
};
export default function VerificationPage() {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);
  const [verifiedNumber, setVerifiedNumber] = useState(null);
  const { currentUser } = useUser();
  const handleVerify = async () => {
    setResult(null);
    setVerifiedNumber(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/verify/${number}`);
      setResult(response.data);
      if (response.data.is_armstrong) {
        setVerifiedNumber(parseInt(number));
      }
    } catch (err) {
      setResult({ message: 'Verification failed.' });
    }
  };
  const handleSave = async () => {
    if (!currentUser || !verifiedNumber) return;
    try {
      const response = await axios.post('http://localhost:8080/api/save', {
        user_id: currentUser.id,
        number: verifiedNumber
      });
      setResult({ message: response.data.message, is_armstrong: true });
      setVerifiedNumber(null);
    } catch (err) {
      setResult({ message: 'Failed to save the number.' });
    }
  };
  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom> Armstrong Number Verification</Typography>
      {!currentUser ? (
        <Alert severity="warning">You must be logged in to verify and save numbers.</Alert>
      ) : (
        <>
          <Typography sx={{ mb: 2 }}>
            Verifying as: <strong>{extractUsername(currentUser.email)}</strong>
          </Typography>
          <TextField
            label="Number to Verify"
            variant="outlined"
            fullWidth
            margin="normal"
            value={number}
            onChange={e => setNumber(e.target.value)}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button onClick={handleVerify} variant="outlined" size="large" fullWidth>Verify</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              size="large"
              fullWidth
              disabled={!verifiedNumber}
            >
              Save
            </Button>
          </Stack>
          {result && <Alert severity={result.is_armstrong ? 'success' : 'info'} sx={{ mt: 3 }}>{result.message}</Alert>}
        </>
      )}
    </Paper>
  );
}