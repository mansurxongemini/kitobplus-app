import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import React from "react";
import useLibrary from "../LibraryContext";

export const ThemeProvider = ({ children }) => {
  const {darkMode} = useLibrary();
  const appTheme = createTheme({
    breakpoints: {
      values: {
        xs: 0,      // мобильные устройства
        sm: 600,    // планшеты (портретная ориентация)
        md: 960,    // планшеты (альбомная) / маленькие ноутбуки
        lg: 1280,   // десктопы
        xl: 1920,   // большие экраны
      },
    },
    palette: {
      primary: {
        main: "rgba(0, 174, 199, 1)", // mainprimary
      },
      secondary: {
        main: darkMode ? "#E0E0E0" : "rgba(38, 38, 38, 1)", // mainsecondary
      },
      error: {
        main: "rgba(222, 52, 72, 1)", // red-warning
      },
      background: {
        default: darkMode ? "rgba(24, 24, 36, 1)" : "rgba(255, 255, 255, 1)", // lightwhite
        paper: darkMode ? "rgba(36, 36, 48, 1)" : "rgba(255, 255, 255, 1)", // lightwhite
      },
      text: {
        primary: darkMode ? "#E0E0E0" : "rgba(38, 38, 38, 1)", // mainsecondary
        secondary: darkMode ? "#A0A0A0" : "rgba(157, 160, 162, 1)", // from ContentSection text
      },
      icon: {
        main: "rgba(156, 176, 191, 1)", // icon
      },
      lightfirst: {
        main: darkMode ? "rgba(16, 16, 16, 1)" : "rgba(236, 241, 245, 1)", // lightfirst
      },
      maindark: {
        main: "rgba(2, 73, 89, 1)", // maindark
      },
      lightwhite: {
        main: "rgba(255, 255, 255, 1)", // lightwhite
      },
      neutral: {
        100: "rgba(238, 238, 238, 1)", // from NavigationSection
        200: "rgba(173, 172, 174, 1)", // from ContentSection
      },
      rating: {
        main: "rgba(247, 197, 77, 1)", // from NavigationSection star ratings
        inactive: "rgba(233, 233, 233, 1)", // from NavigationSection inactive stars
      },
      action: {
        hover: darkMode ? "rgba(48, 48, 48, 1)" : "rgba(230, 246, 248, 1)", // from NavigationSection hover state
      },
      divider: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    },
    typography: {
      fontFamily: "'PT_Root_UI-Regular', Helvetica, Arial, sans-serif",
      h1: {
        fontSize: "59px",
        fontWeight: 700,
        lineHeight: "82.6px",
        fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
      },
      h2: {
        fontSize: "30px",
        fontWeight: 700,
        lineHeight: "39px",
        fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
      },
      h3: {
        fontSize: "24px",
        fontWeight: 700,
        lineHeight: "normal",
        fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
      },
      h4: {
        fontSize: "20px",
        fontWeight: 700,
        lineHeight: "28px",
        fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
      },
      h5: {
        fontSize: "16px",
        fontWeight: 700,
        lineHeight: "normal",
        fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
      },
      subtitle1: {
        fontSize: "16px",
        fontWeight: 500,
        lineHeight: "normal",
        fontFamily: "'PT_Root_UI-Medium', Helvetica, Arial, sans-serif",
      },
      subtitle2: {
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "16px",
        fontFamily: "'PT_Root_UI-Medium', Helvetica, Arial, sans-serif",
      },
      body1: {
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "normal",
        fontFamily: "'PT_Root_UI-Regular', Helvetica, Arial, sans-serif",
      },
      body2: {
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "normal",
        fontFamily: "'PT_Root_UI-Regular', Helvetica, Arial, sans-serif",
      },
      button: {
        fontSize: "16px",
        fontWeight: 700,
        lineHeight: "normal",
        fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
        textTransform: "none",
      },
    },
    components: {    
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 0,
            boxShadow: "none",
          },
          containedPrimary: {
            "&:hover": {
              boxShadow: "0px 6px 40px rgba(2, 163, 184, 0.2)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            boxShadow: "0px 4px 24px rgba(38, 38, 38, 0.07)",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            ...theme.typography.body1,
          }),
          head: ({ theme }) => ({
            ...theme.typography.subtitle1,
            color: theme.palette.secondary.main,
          }),
          body: ({ theme }) => ({
            ...theme.typography.body1,
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: ({ theme }) => ({
            ...theme.typography.subtitle1,
            color: theme.palette.secondary.main,
          }),
          secondary: ({ theme }) => ({
            ...theme.typography.body2,
            color: theme.palette.text.secondary,
          }),
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
          },
        },
      },
    },
  });
  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
