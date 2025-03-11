import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../apis/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
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
        Login
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
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
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
          autoComplete="current-password"
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
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        <Box textAlign="center" mt={2}>
        <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/register" passHref>
            <MuiLink component="span">Sign Up</MuiLink>
            </Link>
        </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;
