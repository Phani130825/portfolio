import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchProjects, deleteProject, createProject, updateProject, clearError } from '../../store/slices/projectSlice';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    order: 0,
    featured: false,
    image: null
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpen = (project = null) => {
    if (project) {
      setEditMode(true);
      setCurrentProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        order: project.order,
        featured: project.featured,
        image: null
      });
    } else {
      setEditMode(false);
      setCurrentProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        order: 0,
        featured: false,
        image: null
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      order: 0,
      featured: false,
      image: null
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim())
    };

    if (editMode) {
      await dispatch(updateProject({ id: currentProject._id, projectData }));
    } else {
      await dispatch(createProject(projectData));
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await dispatch(deleteProject(id));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        onClose={() => dispatch(clearError())}
        sx={{ mb: 2 }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Project
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Technologies</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>
                  {project.technologies.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>{project.order}</TableCell>
                <TableCell>{project.featured ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(project)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Technologies (comma-separated)"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="GitHub URL"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Live URL"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.featured}
                  onChange={handleChange}
                  name="featured"
                />
              }
              label="Featured"
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Project Image
            </Typography>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              required={!editMode}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectList; 