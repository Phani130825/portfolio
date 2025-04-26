import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import blogReducer from './slices/blogSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    blog: blogReducer,
  },
});

export default store; 