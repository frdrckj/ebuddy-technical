import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { User } from '@monorepo/shared';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { updateUserData, fetchUserData } from '@/store/user/userSlice';
import { auth } from '@/apis/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/apis/firebase';

interface UserProfileProps {
  user: User | null;
  loading: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, loading }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      if (!displayName.trim()) {
        throw new Error('Name cannot be empty');
      }
      await dispatch(updateUserData({ displayName })).unwrap();
      setSuccessMessage('Profile updated successfully');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const createManualUserDocument = async () => {
    setIsCreating(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const timestamp = new Date().toISOString();
      const userData = {
        email: currentUser.email || '',
        displayName: displayName || currentUser.displayName || '',
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true,
        role: 'user',
        metadata: {}
      };

      // Save to both collections to be safe
      await setDoc(doc(firestore, 'USERS', currentUser.uid), userData);
      await setDoc(doc(firestore, 'users', currentUser.uid), userData);

      setSuccessMessage('User document created successfully');
      // Refresh the data
      dispatch(fetchUserData());
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create user document');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Card>
      <CardContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {!user ? (
              <Box mb={3}>
                <Typography color="error" gutterBottom>
                  User data not found. Try creating a user document manually:
                </Typography>
                <TextField
                  fullWidth
                  label="Display Name"
                  margin="normal"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={createManualUserDocument}
                  disabled={isCreating}
                  sx={{ mt: 2 }}
                >
                  {isCreating ? <CircularProgress size={24} /> : 'Create User Document'}
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Edit Profile
                  </Typography>
                  <TextField
                    fullWidth
                    label="Display Name"
                    margin="normal"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    sx={{ mt: 2 }}
                  >
                    {isUpdating ? <CircularProgress size={24} /> : 'Update Profile'}
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
