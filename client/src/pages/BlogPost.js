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
} from '@mui/material';
// import ReactMarkdown from 'react-markdown';
import { fetchBlogPost } from '../store/slices/blogSlice';

const BlogPost = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentPost: post, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogPost(slug));
  }, [dispatch, slug]);

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

  if (!post) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>Post not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        {post.imageUrl && (
          <Box
            component="img"
            src={post.imageUrl}
            alt={post.title}
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
        <Box sx={{ mb: 3 }}>
          {post.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box 
          sx={{ 
            typography: 'body1',
            maxHeight: '70vh',
            maxWidth: '100%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
              '&:hover': {
                background: '#555',
              },
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
            },
            '& pre': {
              maxWidth: '100%',
              overflowX: 'auto',
            },
            '& table': {
              maxWidth: '100%',
              overflowX: 'auto',
              display: 'block',
            }
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogPost; 