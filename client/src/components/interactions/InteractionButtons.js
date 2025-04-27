import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import { addInteraction, removeInteraction, fetchTargetInteractions } from '../../store/slices/interactionSlice';

const InteractionButtons = ({ targetType, targetId }) => {
  const dispatch = useDispatch();
  const { userInteractions, targetInteractions, loading } = useSelector((state) => state.interactions);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (targetType && targetId) {
      dispatch(fetchTargetInteractions({ targetType, targetId }));
    }
  }, [dispatch, targetType, targetId]);

  const handleLike = () => {
    if (!isAuthenticated) return;
    const existingLike = userInteractions.find(
      i => i.type === 'like' && i.targetType === targetType && i.targetId === targetId
    );

    if (existingLike) {
      dispatch(removeInteraction(existingLike._id));
    } else {
      dispatch(addInteraction({
        type: 'like',
        targetType,
        targetId
      }));
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) return;
    const existingBookmark = userInteractions.find(
      i => i.type === 'bookmark' && i.targetType === targetType && i.targetId === targetId
    );

    if (existingBookmark) {
      dispatch(removeInteraction(existingBookmark._id));
    } else {
      dispatch(addInteraction({
        type: 'bookmark',
        targetType,
        targetId
      }));
    }
  };

  const handleComment = () => {
    if (!isAuthenticated) return;
    setOpenComment(true);
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    dispatch(addInteraction({
      type: 'comment',
      targetType,
      targetId,
      comment: comment.trim()
    }));
    setComment('');
    setOpenComment(false);
  };

  const handleRating = (event, newValue) => {
    if (!isAuthenticated || !newValue) return;
    
    const existingRating = userInteractions.find(
      i => i.type === 'rating' && i.targetType === targetType && i.targetId === targetId
    );

    if (existingRating) {
      dispatch(addInteraction({
        type: 'rating',
        targetType,
        targetId,
        rating: newValue
      }));
    } else {
      dispatch(addInteraction({
        type: 'rating',
        targetType,
        targetId,
        rating: newValue
      }));
    }
  };

  const isLiked = userInteractions.some(
    i => i.type === 'like' && i.targetType === targetType && i.targetId === targetId
  );

  const isBookmarked = userInteractions.some(
    i => i.type === 'bookmark' && i.targetType === targetType && i.targetId === targetId
  );

  const userRating = userInteractions.find(
    i => i.type === 'rating' && i.targetType === targetType && i.targetId === targetId
  )?.rating || 0;

  const likeCount = targetInteractions.filter(i => i.type === 'like').length;
  const commentCount = targetInteractions.filter(i => i.type === 'comment').length;
  const averageRating = targetInteractions
    .filter(i => i.type === 'rating')
    .reduce((acc, curr) => acc + curr.rating, 0) / 
    targetInteractions.filter(i => i.type === 'rating').length || 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Tooltip title={isAuthenticated ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleLike} 
            disabled={!isAuthenticated || loading}
            color={isLiked ? 'primary' : 'default'}
          >
            <ThumbUpIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {likeCount}
          </Typography>
        </Box>
      </Tooltip>

      <Tooltip title={isAuthenticated ? (isBookmarked ? 'Remove bookmark' : 'Bookmark') : 'Login to bookmark'}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleBookmark} 
            disabled={!isAuthenticated || loading}
            color={isBookmarked ? 'primary' : 'default'}
          >
            <BookmarkIcon />
          </IconButton>
        </Box>
      </Tooltip>

      <Tooltip title={isAuthenticated ? 'Add comment' : 'Login to comment'}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleComment} 
            disabled={!isAuthenticated || loading}
          >
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {commentCount}
          </Typography>
        </Box>
      </Tooltip>

      <Tooltip title={isAuthenticated ? 'Rate this' : 'Login to rate'}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Rating
            value={userRating}
            onChange={handleRating}
            disabled={!isAuthenticated || loading}
          />
          {averageRating > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({averageRating.toFixed(1)})
            </Typography>
          )}
        </Box>
      </Tooltip>

      <Dialog open={openComment} onClose={() => setOpenComment(false)}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenComment(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={submitComment} 
            variant="contained" 
            disabled={!comment.trim() || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InteractionButtons; 