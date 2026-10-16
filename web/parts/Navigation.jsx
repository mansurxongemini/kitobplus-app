import React from "react";
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logo_icon from "./img/logo_icon.png";
import group19 from "./img/group-19.png";
import group19_dark from "./img/group-19-dark.png";
import LoginIcon from "@mui/icons-material/Login";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import vision_impired_icon from "./img/vision_impired_icon.png";
import UserMenu from './UserMenu.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import { Link } from "react-router-dom";
import useLibrary from '../LibraryContext.js';
import T from "../lib/translator.js";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const {user, setUser} = useLibrary();
    // Navigation menu items
    const menuItems = [
        {label: T("Главная"), href: "/"},
        {label: T("О нас"), href: "/#about"},
        {label: T("Аудиокниги"), href: "/books"},
        /*{label: T("Гостевая книга"), href: "/"},*/
        {label: T("Контакты"), href: "/contacts"}
    ];

    const {darkMode, setDarkMode} = useLibrary();
    // Top bar items
    const topBarItems = {
        left: ["Русский"],
        right: ["Книжная полка", "Вход / Регистрация"],
    };

    const profileClick = () => {
        if (user) {
            navigate("/profile");
            return;
        }

        navigate("/login");
    }

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    const handleMenuItemClick = () => {
        setMobileMenuOpen(false);
    }

    return (
        <>
            <AppBar
                position="relative"
                color="lightwhite"
                elevation={0}
                sx={{
                    height: { xs: "64px", md: "96px" },
                    borderBottom: 1,
                    borderColor: "lightfirst.main",
                }}
            >
                <a
                    id="jump_to_main_content"
                    href="#main_content"
                    tabIndex={0}
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        top: '0',
                        zIndex: 9999,
                        padding: '8px 16px',
                        backgroundColor: '#000',
                        color: '#fff',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: '2px solid #fff',
                        borderRadius: '4px',
                        transition: 'left 0.3s ease'
                    }}
                    onFocus={(e) => {
                        e.target.style.left = '10px';
                    }}
                    onBlur={(e) => {
                        e.target.style.left = '-9999px';
                    }}
                >
                    {T('Перейти к основному содержимому')}
                </a>
                {/* Main navbar */}
                <Toolbar sx={{
                    height: { xs: "64px", md: "96px" },
                    px: { xs: 2, sm: 4, md: 8, lg: 15 },
                    justifyContent: "space-between"
                }}>
                    {/* Logo */}
                    <Box sx={{ display: "flex", alignItems: "center", height: { xs: "32px", md: "48px" } }}>
                        <Box
                            component="img"
                            sx={{
                                width: { xs: "26px", md: "39px" },
                                height: { xs: "32px", md: "48px" },
                            }}
                            src={logo_icon}
                        />
                        <Box
                            component="img"
                            src={darkMode ? group19_dark : group19}
                            alt="Logo"
                            sx={{ height: { xs: "16px", md: "24px" }, ml: { xs: 1, md: 2 } }}
                        />
                    </Box>

                    {/* Desktop Menu items */}
                    {!isMobile && (
                        <Stack direction="row" spacing={{ md: 4, lg: 8 }}>
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    color="secondary"
                                    style={{
                                        fontSize: "20px",
                                        lineHeight: "26px",
                                        fontFamily: "'PT_Root_UI-Medium', Helvetica",
                                        textDecoration: "none",
                                        color: "inherit"
                                    }}
                                    to={item.href}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Stack>
                    )}

                    {/* Right side controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, md: 0.25 } }}>
                        {!isMobile && (
                            <>
                                <IconButton
                                    title={T('Профиль')}
                                    aria-label={T('Профиль')}
                                    onClick={() => profileClick()}
                                    sx={{borderRadius: '50%'}}
                                >
                                    {user ? <ProfileIcon sx={{ color: 'primary.main', fontSize: '32px' }} /> : <LoginIcon sx={{ color: 'primary.main', fontSize: '32px' }} />}
                                </IconButton>
                                <IconButton
                                    title={darkMode ? T('Включить светлую тему') : T('Включить тёмную тему')}
                                    aria-label={darkMode ? T('Включить светлую тему') : T('Включить тёмную тему')}
                                    onClick={() => setDarkMode(!darkMode)}
                                    sx={{borderRadius: '50%'}}
                                >
                                    {darkMode ? <LightModeIcon sx={{ color: 'primary.main', fontSize: '32px' }} /> : <DarkModeIcon sx={{ color: 'primary.main', fontSize: '32px' }} />}
                                </IconButton>
                                <LanguageSelector />
                            </>
                        )}

                        {/* Mobile menu button */}
                        {isMobile && (
                            <IconButton
                                title={T('Меню')}
                                aria-label={T('Открыть меню')}
                                onClick={handleMobileMenuToggle}
                                sx={{borderRadius: '50%'}}
                            >
                                <MenuIcon sx={{ color: 'primary.main', fontSize: '32px' }} />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer Menu */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={handleMobileMenuToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: '80%', sm: '320px' },
                        bgcolor: 'background.default',
                    }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    p: 2
                }}>
                    {/* Close button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" color="text.primary">
                            {T('Меню')}
                        </Typography>
                        <IconButton
                            onClick={handleMobileMenuToggle}
                            aria-label={T('Закрыть меню')}
                        >
                            <CloseIcon sx={{ color: 'text.primary' }} />
                        </IconButton>
                    </Box>

                    {/* Menu items */}
                    <List sx={{ flex: 1 }}>
                        {menuItems.map((item, index) => (
                            <ListItem
                                key={index}
                                component={Link}
                                to={item.href}
                                onClick={handleMenuItemClick}
                                sx={{
                                    py: 2,
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '18px',
                                        fontFamily: "'PT_Root_UI-Medium', Helvetica",
                                        color: 'text.primary'
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>

                    {/* Bottom controls */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        pt: 2,
                        borderTop: 1,
                        borderColor: 'divider'
                    }}>
                        {/* Profile button */}
                        <Button
                            variant="contained"
                            startIcon={user ? <ProfileIcon /> : <LoginIcon />}
                            onClick={() => {
                                profileClick();
                                handleMenuItemClick();
                            }}
                            fullWidth
                        >
                            {user ? T('Профиль') : T('Вход')}
                        </Button>

                        {/* Theme and language controls */}
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                                title={darkMode ? T('Включить светлую тему') : T('Включить тёмную тему')}
                                aria-label={darkMode ? T('Включить светлую тему') : T('Включить тёмную тему')}
                                onClick={() => setDarkMode(!darkMode)}
                                sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: '50%',
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                {darkMode ? <LightModeIcon sx={{ color: 'primary.main' }} /> : <DarkModeIcon sx={{ color: 'primary.main' }} />}
                            </IconButton>
                            <LanguageSelector />
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    )
}

export default Navigation;
