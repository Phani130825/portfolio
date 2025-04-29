import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Grid,
} from '@mui/material';
import { fetchProject } from '../store/slices/projectSlice';
import InteractionButtons from '../components/interactions/InteractionButtons';
import CommentsList from '../components/interactions/CommentsList';

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject: project, loading, error } = useSelector((state) => state.projects);
  const { targetInteractions } = useSelector((state) => state.interactions);

  useEffect(() => {
    dispatch(fetchProject(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>Project not found</Alert>
      </Container>
    );
  }

  const comments = targetInteractions.filter(interaction => interaction.type === 'comment');

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 12 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {project.title}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          {project.technologies.map((tech, index) => (
            <Chip
              key={index}
              label={tech}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        {project.imageUrl && (
          <Box
            component="img"
            src={project.imageUrl}
            alt={project.title}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 400,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 3,
            }}
          />
        )}

        <Typography variant="body1" paragraph>
          {project.description}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <InteractionButtons targetType="project" targetId={project._id} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          {project.githubUrl && (
            <Grid item xs={12} sm={6}>
              <Typography
                component="a"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ display: 'block', mb: 1 }}
              >
                View on GitHub
              </Typography>
            </Grid>
          )}
          {project.liveUrl && (
            <Grid item xs={12} sm={6}>
              <Typography
                component="a"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ display: 'block', mb: 1 }}
              >
                Live Demo
              </Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <CommentsList comments={comments} />
      </Paper>
    </Container>
  );
};

export default ProjectDetail; 