import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createBlogPost, updateBlogPost, fetchBlogPosts } from '../../store/slices/blogSlice';
import QuillEditor from '../editor/QuillEditor';
import CloudUpload from '@mui/icons-material/CloudUpload';

const BlogForm = ({ blog = null, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.blog);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    status: 'draft',
    image: null,
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        tags: blog.tags,
        status: blog.status,
        image: null,
      });
      setImagePreview(blog.imageUrl);
    }
  }, [blog]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      errors.content = 'Content must be at least 50 characters';
    }

    if (!formData.excerpt.trim()) {
      errors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length > 200) {
      errors.excerpt = 'Excerpt must be less than 200 characters';
    }

    if (formData.tags.length > 10) {
      errors.tags = 'Maximum 10 tags allowed';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for the field being changed
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    setFormError(null);
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
    if (validationErrors.content) {
      setValidationErrors(prev => ({
        ...prev,
        content: undefined
      }));
    }
    setFormError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setFormError('Please upload a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size should be less than 5MB');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
      setFormError(null);
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
    if (validationErrors.tags) {
      setValidationErrors(prev => ({
        ...prev,
        tags: undefined
      }));
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      
      // Validate tag length
      if (newTag.length > 20) {
        setFormError('Tag must be less than 20 characters');
        return;
      }

      // Check for duplicate tags
      if (formData.tags.includes(newTag)) {
        setFormError('Tag already exists');
        return;
      }

      // Check maximum tags limit
      if (formData.tags.length >= 10) {
        setFormError('Maximum 10 tags allowed');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setTagInput('');
      setFormError(null);
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
    if (validationErrors.tags) {
      setValidationErrors(prev => ({
        ...prev,
        tags: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    
    // Add all form fields to FormData
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('content', formData.content); // Send raw HTML content
    formDataToSend.append('excerpt', formData.excerpt.trim());
    formDataToSend.append('status', formData.status || 'draft'); // Ensure status is always set
    formDataToSend.append('tags', JSON.stringify(formData.tags));
    
    // Only append image if it exists
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (blog) {
        await dispatch(updateBlogPost({ id: blog._id, postData: formDataToSend }));
      } else {
        await dispatch(createBlogPost(formDataToSend));
      }
      
      if (!error) {
        // Refresh the posts list after successful update
        await dispatch(fetchBlogPosts());
        onClose();
      }
    } catch (err) {
      console.error('Error submitting blog post:', err);
      setFormError(err.message || 'Failed to save blog post');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
      </Typography>

      {(error || formError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError || error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!validationErrors.title}
              helperText={validationErrors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Excerpt"
              name="excerpt"
              multiline
              rows={2}
              value={formData.excerpt}
              onChange={handleChange}
              error={!!validationErrors.excerpt}
              helperText={validationErrors.excerpt}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Content
            </Typography>
            <QuillEditor
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              style={{ height: '300px', marginBottom: '50px' }}
            />
            {validationErrors.content && (
              <Typography color="error" variant="caption">
                {validationErrors.content}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Add Tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              helperText="Press Enter to add a tag (max 10 tags)"
              error={!!validationErrors.tags}
            />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleTagDelete(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                disabled={blog?.status === 'published'}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
            {blog?.status === 'published' && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Once published, a post cannot be changed back to draft status.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Featured Image
            </Typography>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
              >
                Upload Image
              </Button>
            </label>
            {imagePreview && (
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{
                  width: '100%',
                  maxHeight: 200,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mt: 2
                }}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : blog ? (
                  'Update Post'
                ) : (
                  'Create Post'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default BlogForm; 