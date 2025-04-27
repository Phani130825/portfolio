import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,

  Alert,
} from '@mui/material';

import ProjectList from '../components/dashboard/ProjectList';
import BlogList from '../components/dashboard/BlogList';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Is authenticated:', isAuthenticated);
  }, [user, isAuthenticated]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Please log in to access the dashboard.
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Loading user data...
        </Alert>
      </Container>
    );
  }

  if (user.role !== 'admin') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          You do not have permission to access this page. Current role: {user.role}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Projects" />
          <Tab label="Blog Posts" />
        </Tabs>
      </Box>
      {activeTab === 0 ? <ProjectList /> : <BlogList />}
    </Container>
  );
};

export default Dashboard; 