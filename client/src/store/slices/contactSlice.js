import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const sendMessage = createAsyncThunk(
  'contact/sendMessage',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/contact`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer; 