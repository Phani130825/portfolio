import React from 'react';
import { Box, Typography, Rating, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const RatingDisplay = ({ averageRating, totalRatings, userRating }) => {
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <Rating
          value={averageRating}
          precision={0.5}
          readOnly
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Typography variant="body2" color="text.secondary">
          ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
        </Typography>
      </Stack>
      {userRating && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Your rating: {userRating}
        </Typography>
      )}
    </Box>
  );
};

export default RatingDisplay; 