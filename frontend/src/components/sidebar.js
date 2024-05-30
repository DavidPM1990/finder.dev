import React, { useState, useEffect, useContext } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { Context } from "../store/appContext";
import { useMediaQuery } from '@mui/material';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function Sidebar() {
    const theme = useTheme();
    const isLaptopOrLarger = useMediaQuery(theme.breakpoints.up('md'));
    const [open, setOpen] = useState(isLaptopOrLarger);
    const { store, actions } = useContext(Context);

    const currentUser = store.users;

    useEffect(() => {
        setOpen(isLaptopOrLarger);
    }, [isLaptopOrLarger]);

    const handleLogout = () => {
        console.log("Logging out...");
        actions.logOut();
        localStorage.removeItem("jwt-token");
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{ backgroundColor: 'white' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }), color: '#000000' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ color: 'black' }}>
                        Finder.dev
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant={isLaptopOrLarger ? "persistent" : "temporary"}
                anchor="left"
                open={open}
                onClose={!isLaptopOrLarger ? handleDrawerClose : undefined}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {['Profile', 'Chats', 'Notifications'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton component={Link} to={index === 0 ? `/profile/${currentUser.id}` : '#'}>
                                <ListItemIcon>
                                    {index === 0 && <AccountCircleIcon />}
                                    {index === 1 && <ChatIcon />}
                                    {index === 2 && <NotificationsIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem key="Find your Partner" disablePadding>
                        <ListItemButton component={Link} to="/" >
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                            <ListItemText primary="Find your Partner" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="LogOut" disablePadding>
                        <ListItemButton component={Link} to="/login" onClick={handleLogout} >
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="LogOut" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
        </Box>
    );
}
