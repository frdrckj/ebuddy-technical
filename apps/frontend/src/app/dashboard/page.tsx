'use client'

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress
} from '@mui/material';
import DashboardLayout from '@/components/organisms/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchUserData } from '@/store/user/userSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/apis/firebase';
import { useRouter } from 'next/navigation';
import UpdateButton from '@/components/atoms/UpdateButton';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user, loading, error } = useSelector((state: RootState) => state.user);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);
      if (!user) {
        router.push('/');
      } else {
        dispatch(fetchUserData());
      }
    });

    return () => unsubscribe();
  }, [dispatch, router]);

  const handleFetchUser = () => {
    dispatch(fetchUserData());
  };

  if (!authChecked) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to your Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>

              {loading ? (
                <CircularProgress size={24} />
              ) : error ? (
                <>
                  <Typography color="error">{error}</Typography>
                  <Button
                    variant="outlined"
                    onClick={handleFetchUser}
                    sx={{ mt: 1 }}
                  >
                    Try Again
                  </Button>
                </>
              ) : user ? (
                <>
                  <Typography><strong>Name:</strong> {user.displayName}</Typography>
                  <Typography><strong>Email:</strong> {user.email}</Typography>
                  <Typography><strong>Role:</strong> {user.role}</Typography>
                  <Typography><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</Typography>
                  <Typography><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</Typography>

                  <Box mt={2}>
                    <UpdateButton onClick={handleFetchUser}>
                      Refresh Data
                    </UpdateButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography>No user data available</Typography>
                  <Button
                    variant="contained"
                    onClick={handleFetchUser}
                    sx={{ mt: 1 }}
                  >
                    Fetch User Data
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => router.push('/profile')}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
