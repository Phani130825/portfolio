import React from 'react';
import { Box, Container, Typography, IconButton, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Kandukuri Phani Datta. All rights reserved.
          </Typography>

          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <IconButton
              component={Link}
              href="https://github.com/phani130825"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              component={Link}
              href="https://linkedin.com/in/k-phani-datta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              component={Link}
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <TwitterIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 