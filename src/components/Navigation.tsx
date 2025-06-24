/**
 * Navigation Component - Modern Sidebar Navigation
 * ==============================================
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  Psychology,
  Analytics,
  Security,
  RocketLaunch,
} from '@mui/icons-material';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
      description: 'Overview & Status',
    },
    {
      text: 'AI Predictions',
      icon: <Psychology />,
      path: '/predictions',
      description: 'Risk Assessment',
    },
    {
      text: 'Visualizations',
      icon: <Analytics />,
      path: '/visualizations',
      description: 'Data Analytics',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0 20px 20px 0',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-5px)' },
            },
          }}
        >
          <RocketLaunch sx={{ fontSize: 30 }} />
        </Avatar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 0.5,
          }}
        >
          CyberShield AI
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
          Advanced Security Platform
        </Typography>
        <Chip
          label="v2.0 Neural"
          size="small"
          sx={{
            mt: 1,
            background: 'rgba(76, 175, 80, 0.2)',
            color: '#4CAF50',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            fontSize: '0.7rem',
          }}
        />
      </Box>

      <Divider sx={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />

      {/* Navigation Items */}
      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {navigationItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 3,
                  mb: 1,
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(5px)',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#667eea' : 'text.secondary',
                    minWidth: 40,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#667eea' : 'text.primary',
                        fontSize: '0.95rem',
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        opacity: 0.8,
                      }}
                    >
                      {item.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Security sx={{ fontSize: 24, color: 'primary.main', mb: 1 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            CyberShield AI
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.7rem', mt: 0.5 }}>
            Advanced Security Platform
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Navigation; 