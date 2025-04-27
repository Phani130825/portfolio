import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchUserInteractions } from '../store/slices/interactionSlice';
import { fetchProjects } from '../store/slices/projectSlice';

const Bookmarks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInteractions, loading: interactionsLoading } = useSelector((state) => state.interactions);
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchUserInteractions());
    dispatch(fetchProjects());
  }, [dispatch]);

  if (interactionsLoading || projectsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const bookmarkedProjects = userInteractions
    .filter(interaction => interaction.type === 'bookmark' && interaction.targetType === 'project')
    .map(interaction => projects.find(project => project._id === interaction.targetId))
    .filter(Boolean);

  if (bookmarkedProjects.length === 0) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>
          You haven't bookmarked any projects yet.
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Bookmarked Projects
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Your saved projects
      </Typography>

      <Grid container spacing={4}>
        {bookmarkedProjects.map((project) => (
          <Grid item key={project._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={project.imageUrl}
                alt={project.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {project.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {project.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {project.technologies.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Bookmarks; 