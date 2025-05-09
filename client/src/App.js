import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getTheme } from './theme';
import AppRoutes from './routes';
import Navbar from './components/layout/Navbar';
import { Box } from '@mui/material';
import { verifyToken } from './store/slices/authSlice';

function App() {
  const [mode, setMode] = useState('dark');
  const dispatch = useDispatch();

  useEffect(() => {
    // Verify token on initial load
    dispatch(verifyToken());
  }, [dispatch]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}>
        <Navbar toggleColorMode={colorMode.toggleColorMode} />
        <Box sx={{ flex: 1, pb: '60px' }}>
          <AppRoutes />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 