import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2563eb' : '#3b82f6',
        light: mode === 'light' ? '#60a5fa' : '#93c5fd',
        dark: mode === 'light' ? '#1d4ed8' : '#2563eb',
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'light' ? '#7c3aed' : '#8b5cf6',
        light: mode === 'light' ? '#a78bfa' : '#c4b5fd',
        dark: mode === 'light' ? '#6d28d9' : '#7c3aed',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
        secondary: mode === 'light' ? '#64748b' : '#94a3b8',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      info: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '3.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      subtitle1: {
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.75,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.75,
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.025em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'light' 
              ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
              : '0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                : '0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.2)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light'
              ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
              : '0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
            backdropFilter: 'blur(8px)',
            backgroundColor: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(15, 23, 42, 0.8)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'light' ? '#2563eb' : '#3b82f6',
                },
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
          },
        },
      },
    },
  });
}; 