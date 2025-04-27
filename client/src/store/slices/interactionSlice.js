import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://phanis-portfolio.onrender.com/api'  // Production URL
  : 'http://localhost:5000/api';  // Development URL

// Async thunks
export const fetchUserInteractions = createAsyncThunk(
  'interactions/fetchUserInteractions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/interactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addInteraction = createAsyncThunk(
  'interactions/addInteraction',
  async (interactionData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(`${API_URL}/interactions`, interactionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeInteraction = createAsyncThunk(
  'interactions/removeInteraction',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/interactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTargetInteractions = createAsyncThunk(
  'interactions/fetchTargetInteractions',
  async ({ targetType, targetId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/interactions/target/${targetType}/${targetId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  userInteractions: [],
  targetInteractions: [],
  loading: false,
  error: null,
};

const interactionSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTargetInteractions: (state) => {
      state.targetInteractions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user interactions
      .addCase(fetchUserInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.userInteractions = action.payload;
      })
      .addCase(fetchUserInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching interactions';
      })
      // Add interaction
      .addCase(addInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInteraction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.userInteractions.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.userInteractions[index] = action.payload;
        } else {
          state.userInteractions.push(action.payload);
        }
      })
      .addCase(addInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error adding interaction';
      })
      // Remove interaction
      .addCase(removeInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.userInteractions = state.userInteractions.filter(i => i._id !== action.payload);
      })
      .addCase(removeInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error removing interaction';
      })
      // Fetch target interactions
      .addCase(fetchTargetInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTargetInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.targetInteractions = action.payload;
      })
      .addCase(fetchTargetInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching target interactions';
      });
  },
});

export const { clearError, clearTargetInteractions } = interactionSlice.actions;
export default interactionSlice.reducer; 