import React from 'react';
import { Box, Container, Typography, IconButton, Link, useTheme } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)',
        borderTop: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.mode === 'light' ? 'text.secondary' : 'text.secondary',
              transition: 'color 0.2s ease-in-out',
            }}
          >
            © {currentYear} Kandukuri Phani Datta. All rights reserved.
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1,
              mt: { xs: 2, sm: 0 },
            }}
          >
            <IconButton
              component={Link}
              href="https://github.com/phani130825"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              sx={{
                color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(37, 99, 235, 0.1)'
                    : 'rgba(59, 130, 246, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              component={Link}
              href="https://linkedin.com/in/k-phani-datta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              sx={{
                color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(37, 99, 235, 0.1)'
                    : 'rgba(59, 130, 246, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              component={Link}
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              sx={{
                color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(37, 99, 235, 0.1)'
                    : 'rgba(59, 130, 246, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
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