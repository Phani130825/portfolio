import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchLearningProgress = createAsyncThunk(
  'learning/fetchLearningProgress',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/learning`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addLearningProgress = createAsyncThunk(
  'learning/addLearningProgress',
  async (progressData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(`${API_URL}/learning`, progressData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLearningProgress = createAsyncThunk(
  'learning/updateLearningProgress',
  async ({ id, progressData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(`${API_URL}/learning/${id}`, progressData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteLearningProgress = createAsyncThunk(
  'learning/deleteLearningProgress',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/learning/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPublicLearningProgress = createAsyncThunk(
  'learning/fetchPublicLearningProgress',
  async ({ targetType, targetId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/learning/public/${targetType}/${targetId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  userProgress: [],
  publicProgress: [],
  loading: false,
  error: null,
};

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPublicProgress: (state) => {
      state.publicProgress = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user progress
      .addCase(fetchLearningProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLearningProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.userProgress = action.payload;
      })
      .addCase(fetchLearningProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching learning progress';
      })
      // Add learning progress
      .addCase(addLearningProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLearningProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.userProgress.push(action.payload);
      })
      .addCase(addLearningProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error adding learning progress';
      })
      // Update learning progress
      .addCase(updateLearningProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLearningProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.userProgress.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.userProgress[index] = action.payload;
        }
      })
      .addCase(updateLearningProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error updating learning progress';
      })
      // Delete learning progress
      .addCase(deleteLearningProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLearningProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.userProgress = state.userProgress.filter(p => p._id !== action.payload);
      })
      .addCase(deleteLearningProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error deleting learning progress';
      })
      // Fetch public progress
      .addCase(fetchPublicLearningProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicLearningProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.publicProgress = action.payload;
      })
      .addCase(fetchPublicLearningProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching public learning progress';
      });
  },
});

export const { clearError, clearPublicProgress } = learningSlice.actions;
export default learningSlice.reducer; 