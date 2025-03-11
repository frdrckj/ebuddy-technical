'use client'

import React, { useEffect } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import LoginForm from '@/components/molecules/LoginForm';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/apis/firebase';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          User Management App
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
}
