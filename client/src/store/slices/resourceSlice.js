import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/resources`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchResourcesByType = createAsyncThunk(
  'resources/fetchResourcesByType',
  async (type, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/resources/type/${type}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTargetResources = createAsyncThunk(
  'resources/fetchTargetResources',
  async ({ targetType, targetId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/resources/target/${targetType}/${targetId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createResource = createAsyncThunk(
  'resources/createResource',
  async (resourceData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      
      // Append all resource data to formData
      Object.keys(resourceData).forEach(key => {
        if (key === 'tags') {
          formData.append(key, resourceData[key].join(','));
        } else {
          formData.append(key, resourceData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/resources`, formData, {
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

export const updateResource = createAsyncThunk(
  'resources/updateResource',
  async ({ id, resourceData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      
      // Append all resource data to formData
      Object.keys(resourceData).forEach(key => {
        if (key === 'tags') {
          formData.append(key, resourceData[key].join(','));
        } else {
          formData.append(key, resourceData[key]);
        }
      });

      const response = await axios.put(`${API_URL}/resources/${id}`, formData, {
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

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const downloadResource = createAsyncThunk(
  'resources/downloadResource',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/resources/download/${id}`, {
        responseType: 'blob'
      });
      return { id, blob: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  resources: [],
  targetResources: [],
  loading: false,
  error: null,
};

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTargetResources: (state) => {
      state.targetResources = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all resources
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching resources';
      })
      // Fetch resources by type
      .addCase(fetchResourcesByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourcesByType.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResourcesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching resources by type';
      })
      // Fetch target resources
      .addCase(fetchTargetResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTargetResources.fulfilled, (state, action) => {
        state.loading = false;
        state.targetResources = action.payload;
      })
      .addCase(fetchTargetResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching target resources';
      })
      // Create resource
      .addCase(createResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.loading = false;
        state.resources.push(action.payload);
      })
      .addCase(createResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error creating resource';
      })
      // Update resource
      .addCase(updateResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.resources.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.resources[index] = action.payload;
        }
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error updating resource';
      })
      // Delete resource
      .addCase(deleteResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = state.resources.filter(r => r._id !== action.payload);
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error deleting resource';
      })
      // Download resource
      .addCase(downloadResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadResource.fulfilled, (state, action) => {
        state.loading = false;
        // Handle file download in component
      })
      .addCase(downloadResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error downloading resource';
      });
  },
});

export const { clearError, clearTargetResources } = resourceSlice.actions;
export default resourceSlice.reducer; 