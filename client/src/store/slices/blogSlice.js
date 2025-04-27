import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchBlogPosts = createAsyncThunk(
  'blog/fetchBlogPosts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/blog`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch blog posts' });
    }
  }
);

export const fetchPublicBlogPosts = createAsyncThunk(
  'blog/fetchPublicBlogPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/blog/public`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch public blog posts' });
    }
  }
);

export const fetchBlogPost = createAsyncThunk(
  'blog/fetchBlogPost',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/blog/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createBlogPost = createAsyncThunk(
  'blog/createBlogPost',
  async (postData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(`${API_URL}/blog`, postData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create blog post' });
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  'blog/updateBlogPost',
  async ({ id, postData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(`${API_URL}/blog/${id}`, postData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update blog post' });
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  'blog/deleteBlogPost',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete blog post' });
    }
  }
);

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  success: null
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blog Posts
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch blog posts';
      })
      // Fetch Single Blog Post
      .addCase(fetchBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch blog post';
      })
      // Create Blog Post
      .addCase(createBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.success = 'Blog post created successfully';
      })
      .addCase(createBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create blog post';
      })
      // Update Blog Post
      .addCase(updateBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        // Update the post in the posts array
        const index = state.posts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        } else {
          // If the post wasn't in the array, add it
          state.posts.unshift(action.payload);
        }
        // Update currentPost if it's the same post
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
        state.success = 'Blog post updated successfully';
      })
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update blog post';
      })
      // Delete Blog Post
      .addCase(deleteBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(p => p._id !== action.payload);
        if (state.currentPost?._id === action.payload) {
          state.currentPost = null;
        }
        state.success = 'Blog post deleted successfully';
      })
      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete blog post';
      });
  },
});

export const { clearError, clearSuccess, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer; 