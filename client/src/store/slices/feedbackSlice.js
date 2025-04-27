import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchUserFeedback = createAsyncThunk(
  'feedback/fetchUserFeedback',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAdminFeedback = createAsyncThunk(
  'feedback/fetchAdminFeedback',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/feedback/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPublicFeedback = createAsyncThunk(
  'feedback/fetchPublicFeedback',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/feedback/public`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createFeedback = createAsyncThunk(
  'feedback/createFeedback',
  async (feedbackData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      
      // Append all feedback data to formData
      Object.keys(feedbackData).forEach(key => {
        if (key === 'attachments') {
          feedbackData[key].forEach(file => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, feedbackData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/feedback`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateFeedbackStatus = createAsyncThunk(
  'feedback/updateFeedbackStatus',
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(
        `${API_URL}/feedback/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addFeedbackResponse = createAsyncThunk(
  'feedback/addFeedbackResponse',
  async ({ id, content }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${API_URL}/feedback/${id}/responses`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedback/deleteFeedback',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  userFeedback: [],
  adminFeedback: [],
  publicFeedback: [],
  loading: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user feedback
      .addCase(fetchUserFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.userFeedback = action.payload;
      })
      .addCase(fetchUserFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching user feedback';
      })
      // Fetch admin feedback
      .addCase(fetchAdminFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.adminFeedback = action.payload;
      })
      .addCase(fetchAdminFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching admin feedback';
      })
      // Fetch public feedback
      .addCase(fetchPublicFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.publicFeedback = action.payload;
      })
      .addCase(fetchPublicFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching public feedback';
      })
      // Create feedback
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.userFeedback.push(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error creating feedback';
      })
      // Update feedback status
      .addCase(updateFeedbackStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.adminFeedback.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.adminFeedback[index] = action.payload;
        }
      })
      .addCase(updateFeedbackStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error updating feedback status';
      })
      // Add feedback response
      .addCase(addFeedbackResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeedbackResponse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.userFeedback.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.userFeedback[index] = action.payload;
        }
      })
      .addCase(addFeedbackResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error adding feedback response';
      })
      // Delete feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.userFeedback = state.userFeedback.filter(f => f._id !== action.payload);
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error deleting feedback';
      });
  },
});

export const { clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer; 