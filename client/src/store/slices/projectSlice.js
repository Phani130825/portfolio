import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://phanis-portfolio.onrender.com/api'  // Production URL
  : 'http://localhost:5000/api';  // Development URL

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      
      // Append all project data to formData
      Object.keys(projectData).forEach(key => {
        if (key === 'technologies') {
          formData.append(key, projectData[key].join(','));
        } else {
          formData.append(key, projectData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/projects`, formData, {
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

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      
      // Append all project data to formData
      Object.keys(projectData).forEach(key => {
        if (key === 'technologies') {
          formData.append(key, projectData[key].join(','));
        } else {
          formData.append(key, projectData[key]);
        }
      });

      const response = await axios.put(`${API_URL}/projects/${id}`, formData, {
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

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching projects';
      })
      // Fetch single project
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching project';
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error creating project';
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.currentProject = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error updating project';
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error deleting project';
      });
  },
});

export const { clearError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer; 