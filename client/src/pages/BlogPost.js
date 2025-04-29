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
import { useTheme } from '@mui/material/styles';

const BlogPost = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentPost: post, loading, error } = useSelector((state) => state.blog);
  const theme = useTheme();

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
              background: theme.palette.mode === 'light' ? '#f1f1f1' : '#1e293b',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.mode === 'light' ? '#888' : '#475569',
              borderRadius: '4px',
              '&:hover': {
                background: theme.palette.mode === 'light' ? '#555' : '#64748b',
              },
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: theme.palette.mode === 'light' 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)',
              margin: '1rem 0',
              display: 'block',
            },
            '& pre': {
              maxWidth: '100%',
              overflowX: 'auto',
              backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
              padding: '1rem',
              borderRadius: '8px',
              margin: '1rem 0',
            },
            '& table': {
              maxWidth: '100%',
              overflowX: 'auto',
              display: 'block',
              borderCollapse: 'collapse',
              margin: '1rem 0',
              '& th, & td': {
                border: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#334155'}`,
                padding: '0.75rem',
              },
              '& th': {
                backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
              },
            },
            '& blockquote': {
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              paddingLeft: '1rem',
              margin: '1rem 0',
              fontStyle: 'italic',
              color: theme.palette.text.secondary,
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& code': {
              backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1e293b',
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
              fontSize: '0.875em',
            },
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogPost; 