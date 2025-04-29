import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import Bookmarks from './pages/Bookmarks';
import Footer from './components/layout/Footer';

const AppRoutes = () => {
  return (
    <>
      <Container 
        component="main" 
        sx={{ 
          flex: 1, 
          py: { xs: 6, sm: 4 }, 
          pb: { xs: 12, sm: 8 },
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <PrivateRoute>
                <Bookmarks />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
      <Footer />
    </>
  );
};

export default AppRoutes; 