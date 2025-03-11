'use client'

import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import DashboardLayout from '@/components/organisms/DashboardLayout';
import UserProfile from '@/components/organisms/UserProfile';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchUserData } from '@/store/user/userSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/apis/firebase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user, loading } = useSelector((state: RootState) => state.user);
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
    <DashboardLayout title="Profile">
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>

      <UserProfile user={user} loading={loading} />
    </DashboardLayout>
  );
}
