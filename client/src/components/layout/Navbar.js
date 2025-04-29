import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../store/slices/authSlice';

const pages = [
  { title: 'Home', path: '/' },
  { title: 'Projects', path: '/projects' },
  { title: 'Blog', path: '/blog' },
  { title: 'Contact', path: '/contact' },
];

const settings = [
  { title: 'Dashboard', path: '/dashboard', adminOnly: true, icon: <DashboardIcon /> },
  { title: 'Bookmarks', path: '/bookmarks', icon: <BookmarkIcon /> },
  { title: 'Logout', action: 'logout', icon: <LogoutIcon /> },
];

const Navbar = ({ toggleColorMode }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      dispatch(logout());
      navigate('/');
    } else {
      navigate(item.path);
    }
    handleCloseUserMenu();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              textDecoration: 'none',
              letterSpacing: '.1rem',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: theme.palette.mode === 'light' ? 'primary.dark' : 'primary.main',
              },
            }}
          >
            Portfolio
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color={theme.palette.mode === 'light' ? 'primary' : 'inherit'}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(8px)',
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                  selected={location.pathname === page.path}
                  sx={{
                    color: theme.palette.mode === 'light' ? 'text.primary' : 'text.primary',
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'light' 
                        ? 'rgba(37, 99, 235, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'light'
                          ? 'rgba(37, 99, 235, 0.2)'
                          : 'rgba(59, 130, 246, 0.2)',
                      },
                    },
                  }}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              textDecoration: 'none',
              letterSpacing: '.1rem',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: theme.palette.mode === 'light' ? 'primary.dark' : 'primary.main',
              },
            }}
          >
            Portfolio
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ 
                  my: 2, 
                  mx: 1,
                  color: theme.palette.mode === 'light' ? 'text.primary' : 'text.primary',
                  display: 'block',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: location.pathname === page.path ? '100%' : '0%',
                    height: '2px',
                    bottom: 0,
                    left: 0,
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease-in-out',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    '&::after': {
                      width: '100%',
                    },
                  },
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Dark Mode Toggle */}
          <IconButton 
            sx={{ 
              ml: 1,
              color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light'
                  ? 'rgba(37, 99, 235, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)',
              },
            }} 
            onClick={toggleColorMode}
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0, ml: 2 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={user?.username} 
                      src="/static/images/avatar/2.jpg"
                      sx={{ 
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{
                    mt: '45px',
                    '& .MuiPaper-root': {
                      backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 2,
                      boxShadow: theme.palette.mode === 'light'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)',
                      minWidth: 180,
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting, index) => (
                    (!setting.adminOnly || (setting.adminOnly && user?.role === 'admin')) && (
                      <React.Fragment key={setting.title}>
                        {index > 0 && <Divider sx={{ my: 1 }} />}
                      <MenuItem
                        onClick={() => handleMenuItemClick(setting)}
                          sx={{
                            color: theme.palette.mode === 'light' ? 'text.primary' : 'text.primary',
                            py: 1.5,
                            px: 2,
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'light'
                                ? 'rgba(37, 99, 235, 0.1)'
                                : 'rgba(59, 130, 246, 0.1)',
                            },
                            '& .MuiSvgIcon-root': {
                              color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                              mr: 1.5,
                              fontSize: 20,
                            },
                          }}
                        >
                          {setting.icon}
                          <Typography 
                            textAlign="center"
                            sx={{
                              fontWeight: 500,
                              transition: 'color 0.2s ease-in-out',
                            }}
                          >
                            {setting.title}
                          </Typography>
                      </MenuItem>
                      </React.Fragment>
                    )
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(37, 99, 235, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 