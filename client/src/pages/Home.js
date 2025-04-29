import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../store/slices/projectSlice';
import { fetchBlogPosts } from '../store/slices/blogSlice';
import LoginIcon from '@mui/icons-material/Login';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { posts, loading: postsLoading } = useSelector((state) => state.blog);
  const { isAuthenticated } = useSelector((state) => state.auth);

  React.useEffect(() => {
    // Fetch featured content
    dispatch(fetchProjects());
    if (isAuthenticated) {
      dispatch(fetchBlogPosts());
    }
  }, [dispatch, isAuthenticated]);

  const featuredProjects = projects?.slice(0, 3) || [];
  const featuredPosts = posts?.slice(0, 3) || [];

  if (projectsLoading || postsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Welcome to My Portfolio
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            I'm a full-stack developer passionate about creating beautiful and
            functional web applications. Explore my projects and blog posts to learn
            more about my work.
          </Typography>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/projects')}
            >
              View Projects
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/contact')}
            >
              Contact Me
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Projects */}
      <Container sx={{ py: 8, pb: { xs: 12, sm: 8 } }} maxWidth="md">
        <Typography
          component="h2"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Featured Projects
        </Typography>
        <Grid container spacing={4}>
          {featuredProjects.map((project) => (
            <Grid item key={project._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
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
                  <Typography>
                    {project.description.substring(0, 100)}...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Blog Posts */}
      <Container sx={{ py: 8, pb: { xs: 12, sm: 8 } }} maxWidth="md">
        <Typography
          component="h2"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Latest Blog Posts
        </Typography>
        {!isAuthenticated ? (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              mt: 2
            }}
          >
            <Typography variant="body1" color="text.secondary" paragraph>
              To view the latest blog posts, please log in to your account.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Log In to View Posts
            </Button>
          </Paper>
        ) : featuredPosts.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No blog posts available yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <Grid item key={post._id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.imageUrl || 'https://source.unsplash.com/random'}
                    alt={post.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {post.title}
                    </Typography>
                    <Typography>
                      {post.excerpt.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Home; 