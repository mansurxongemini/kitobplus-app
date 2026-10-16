import React, { useState } from 'react';
import { 
    IconButton, 
    Menu, 
    MenuItem, 
    Box, 
    Typography,
    ListItemIcon,
    ListItemText,
    useTheme
} from '@mui/material';
import useLibrary from '../LibraryContext.js';
import T from '../lib/translator.js';
import { setCountryCode as saveCountryCode } from '../lib/api.js';
// Эмодзи флагов для каждой страны
const flagEmojis = {
    UZ: '🇺🇿',
    RU: '🇷🇺', 
    US: '🇺🇸'
};

// Названия языков на соответствующих языках
const languageNames = {
    UZ: 'O\'zbekcha',
    RU: 'Русский',
    US: 'English'
};

const LanguageSelector = () => {
    const { countryCode, setCountryCode, darkMode } = useLibrary();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageSelect = (langCode) => {
        setCountryCode(langCode);
        saveCountryCode(langCode);
        handleClose();
    };

    const languages = [
        { code: 'UZ', name: languageNames.UZ, flag: flagEmojis.UZ },
        { code: 'RU', name: languageNames.RU, flag: flagEmojis.RU },
        { code: 'US', name: languageNames.US, flag: flagEmojis.US }
    ];

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{ 
                    fontSize: '32px',
                    opacity: 1,
                    color: theme.palette.text.primary,
                    '& > *': {
                        opacity: 1
                    },
                    '&:hover': {
                        backgroundColor: darkMode 
                            ? 'rgba(255, 255, 255, 0.08)' 
                            : theme.palette.action.hover
                    }
                }}
                aria-label={T('Выбор языка')}
                title={T('Выбор языка')}
            >
                <span style={{ opacity: 1, fontSize: 'inherit' }}>
                    {flagEmojis[countryCode] || flagEmojis.UZ}
                </span>
            </IconButton>
            
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        minWidth: 160,
                        mt: 1,
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        ...(darkMode && {
                            backgroundColor: theme.palette.background.default,
                            border: `1px solid ${theme.palette.text.secondary}`,
                        })
                    }
                }}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                        selected={countryCode === language.code}
                        sx={{
                            py: 1,
                            px: 2,
                            color: theme.palette.text.primary,
                            opacity: 1,
                            '&:hover': {
                                backgroundColor: darkMode 
                                    ? 'rgba(255, 255, 255, 0.08)' 
                                    : theme.palette.action.hover
                            },
                            '&.Mui-selected': {
                                backgroundColor: darkMode 
                                    ? 'rgba(0, 174, 199, 0.2)' 
                                    : 'rgba(0, 174, 199, 0.1)',
                                '&:hover': {
                                    backgroundColor: darkMode 
                                        ? 'rgba(0, 174, 199, 0.3)' 
                                        : 'rgba(0, 174, 199, 0.2)'
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <Typography sx={{ fontSize: '24px', opacity: 1 }}>
                                {language.flag}
                            </Typography>
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2">
                                {language.name}
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default LanguageSelector;
