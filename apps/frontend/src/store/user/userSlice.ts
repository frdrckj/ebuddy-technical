import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@monorepo/shared';
import { fetchUserData as fetchUserAPI, updateUserData as updateUserAPI } from '../../apis/userApi';

interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateError: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
  updateStatus: 'idle',
  updateError: null,
};

// Async thunks
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserAPI();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
    }
  }
);

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      return await updateUserAPI(userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user data');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.data = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user data
    builder.addCase(fetchUserData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'An error occurred';
    });

    // Update user data
    builder.addCase(updateUserData.pending, (state) => {
      state.updateStatus = 'loading';
      state.updateError = null;
    });
    builder.addCase(updateUserData.fulfilled, (state, action: PayloadAction<User>) => {
      state.updateStatus = 'succeeded';
      state.data = action.payload;
    });
    builder.addCase(updateUserData.rejected, (state, action) => {
      state.updateStatus = 'failed';
      state.updateError = action.payload as string || 'An error occurred';
    });
  },
});

export const { clearUserData, resetUpdateStatus } = userSlice.actions;
export const userReducer = userSlice.reducer;
