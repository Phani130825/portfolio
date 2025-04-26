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
} from '@mui/material';
import { fetchBlogPosts } from '../store/slices/blogSlice';

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Blog Posts
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Thoughts, tutorials, and insights about web development
      </Typography>

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
    </Container>
  );
};

export default Blog; 