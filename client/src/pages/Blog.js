import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Paper,
} from '@mui/material';
import { fetchBlogPosts } from '../store/slices/blogSlice';
import LoginIcon from '@mui/icons-material/Login';

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.blog);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBlogPosts());
    }
  }, [dispatch, isAuthenticated]);

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

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to the Blog
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            To view and interact with blog posts, please log in to your account.
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
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Blog Posts
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Thoughts, tutorials, and insights about web development
      </Typography>

      {posts.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No blog posts available yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item key={post._id} xs={12}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.01)',
                  },
                }}
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <CardMedia
                  component="img"
                  sx={{ width: { xs: '100%', md: 300 }, height: { xs: 200, md: 'auto' } }}
                  image={post.imageUrl || 'https://source.unsplash.com/random/800x600?technology'}
                  alt={post.title}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {post.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {post.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  <Typography color="primary" sx={{ cursor: 'pointer' }}>
                    Read more →
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Blog; 