import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import blogReducer from './slices/blogSlice';
import interactionReducer from './slices/interactionSlice';
import learningReducer from './slices/learningSlice';
import resourceReducer from './slices/resourceSlice';
import feedbackReducer from './slices/feedbackSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    blog: blogReducer,
    interactions: interactionReducer,
    learning: learningReducer,
    resources: resourceReducer,
    feedback: feedbackReducer,
  },
});

export default store; 