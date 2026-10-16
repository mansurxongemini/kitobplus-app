import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import React from "react";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "rgba(0, 174, 199, 1)", // --mainprimary
    },
    secondary: {
      main: "rgba(38, 38, 38, 1)", // --mainsecondary
    },
    error: {
      main: "rgba(222, 52, 72, 1)", // --red-warning
    },
    background: {
      default: "rgba(255, 255, 255, 1)", // --lightwhite
      paper: "rgba(255, 255, 255, 1)", // --lightwhite
    },
    text: {
      primary: "rgba(38, 38, 38, 1)", // --mainsecondary
      secondary: "rgba(157, 160, 162, 1)", // #9da0a2 from the code
    },
    icon: {
      main: "rgba(156, 176, 191, 1)", // --icon
    },
    lightfirst: {
      main: "rgba(236, 241, 245, 1)", // --lightfirst
    },
    maindark: {
      main: "rgba(2, 73, 89, 1)", // --maindark
    },
  },
  typography: {
    fontFamily: "'PT_Root_UI', Helvetica, Arial, sans-serif",
    h1: {
      fontSize: "24px",
      fontWeight: 700, // bold
      lineHeight: "normal",
      letterSpacing: "0",
    },
    h2: {
      fontSize: "20px",
      fontWeight: 700, // bold
      lineHeight: "normal",
      letterSpacing: "0",
    },
    h3: {
      fontSize: "18px",
      fontWeight: 700, // bold
      lineHeight: "normal",
      letterSpacing: "0",
    },
    subtitle1: {
      fontSize: "18px",
      fontWeight: 500, // medium
      lineHeight: "normal",
      letterSpacing: "0",
    },
    subtitle2: {
      fontSize: "16px",
      fontWeight: 500, // medium
      lineHeight: "normal",
      letterSpacing: "0",
    },
    body1: {
      fontSize: "16px",
      fontWeight: 400, // regular
      lineHeight: "normal",
      letterSpacing: "0",
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400, // regular
      lineHeight: "normal",
      letterSpacing: "0",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 0,
          fontWeight: 700, // bold
          fontSize: "16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
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
          padding: "12px 16px",
        }),
        head: ({ theme }) => ({
          ...theme.typography.subtitle1,
          backgroundColor: theme.palette.lightfirst.main,
        }),
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: ({ theme }) => ({
          ...theme.typography.subtitle1,
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
          backgroundColor: "rgba(255, 255, 255, 1)", // --lightwhite
        },
      },
    },
  },
});

export const ThemeProvider = ({ children }) => {
  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
