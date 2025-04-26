import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProjectList from '../components/dashboard/ProjectList';
import BlogList from '../components/dashboard/BlogList';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useSelector((state) => state.auth);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          You do not have permission to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your projects and blog posts
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Projects" />
          <Tab label="Blog Posts" />
        </Tabs>
      </Paper>

      {activeTab === 0 ? (
        <Box>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* TODO: Implement new project dialog */}}
            >
              New Project
            </Button>
          </Box>
          <ProjectList />
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* TODO: Implement new blog post dialog */}}
            >
              New Blog Post
            </Button>
          </Box>
          <BlogList />
        </Box>
      )}
    </Container>
  );
};

export default Dashboard; 