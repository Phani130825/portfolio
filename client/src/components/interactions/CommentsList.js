import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider,
} from '@mui/material';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  return date.toLocaleDateString();
};

const CommentsList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        No comments yet. Be the first to comment!
      </Typography>
    );
  }

  return (
    <List>
      {comments.map((comment, index) => (
        <React.Fragment key={comment._id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar 
                src={comment.user?.avatar} 
                alt={comment.user?.name || 'User'}
              >
                {(comment.user?.name || 'U').charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography component="span" variant="subtitle2">
                    {comment.user?.name || 'Anonymous User'}
                  </Typography>
                  <Typography component="span" variant="caption" color="text.secondary">
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {comment.comment}
                </Typography>
              }
            />
          </ListItem>
          {index < comments.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default CommentsList; 