import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  useMediaQuery,
  Theme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../../apis/firebase';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title = 'Dashboard'
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const drawerWidth = 240;

  const drawerContent = (
    <Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          User Management
        </Typography>
      </Box>
      <Divider />
      <List>
      <ListItem component="button" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
        <ListItemIcon>
            <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component="button" onClick={() => router.push('/profile')} sx={{ cursor: 'pointer' }}>
        <ListItemIcon>
            <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
        </ListItem>
        </List>
        <Divider />
        <List>
        <ListItem component="button" onClick={handleLogout} sx={{ cursor: 'pointer' }}>
        <ListItemIcon>
            <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
       </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, sm: 8 }, // Toolbar height
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
