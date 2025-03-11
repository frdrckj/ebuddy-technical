import React from 'react';
import RegisterForm from '@/components/molecules/RegisterForm';
import { Box, Container } from '@mui/material';

export default function RegisterPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4
        }}
      >
        <RegisterForm />
      </Box>
    </Container>
  );
}
