"use client";
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Link as MuiLink
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../apis/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore with the CORRECT collection name
      const timestamp = new Date().toISOString();
      const userData = {
        email: email,
        displayName: displayName,
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true,
        role: 'user',
        metadata: {}
      };

      await setDoc(doc(firestore, 'USERS', user.uid), userData);
      await setDoc(doc(firestore, 'users', user.uid), userData);

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 4 },
        width: '100%',
        maxWidth: 450,
        mx: 'auto'
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create an Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="displayName"
          label="Full Name"
          name="displayName"
          autoFocus
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href="/" passHref>
              <MuiLink component="span">Sign In</MuiLink>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default RegisterForm;
