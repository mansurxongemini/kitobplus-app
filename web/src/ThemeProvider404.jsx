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
      default: "#ffffff", // white background
      paper: "rgba(255, 255, 255, 1)", // --lightwhite
    },
    text: {
      primary: "rgba(38, 38, 38, 1)", // --mainsecondary
      secondary: "rgba(38, 38, 38, 0.4)", // #26262666 from the paragraph
    },
    // Custom colors from tailwind config
    icon: {
      main: "rgba(156, 176, 191, 1)", // --icon
    },
    lightfirst: {
      main: "rgba(236, 241, 245, 1)", // --lightfirst
    },
    lightwhite: {
      main: "rgba(255, 255, 255, 1)", // --lightwhite
    },
    maindark: {
      main: "rgba(2, 73, 89, 1)", // --maindark
    },
    mainprimary: {
      main: "rgba(0, 174, 199, 1)", // --mainprimary
    },
    mainsecondary: {
      main: "rgba(38, 38, 38, 1)", // --mainsecondary
    },
    redWarning: {
      main: "rgba(222, 52, 72, 1)", // --red-warning
    },
    accent: {
      main: "rgba(67, 24, 190, 1)", // #4318be from the accessibility button
    },
    lightBlue: {
      main: "rgba(230, 246, 248, 1)", // #e6f6f8 from the button
    },
  },
  typography: {
    fontFamily: "'PT_Root_UI-Medium', Helvetica, Arial, sans-serif",
    h1: {
      fontSize: "48px",
      fontWeight: 700,
      lineHeight: "46px",
      fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
    },
    h2: {
      fontSize: "36px",
      fontWeight: 700,
      lineHeight: "44px",
      fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
    },
    h3: {
      fontSize: "30px",
      fontWeight: 700,
      lineHeight: "38px",
      fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
    },
    h4: {
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: "32px",
      fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
    },
    h5: {
      fontSize: "20px",
      fontWeight: 700,
      lineHeight: "28px",
      fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
    },
    h6: {
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: "26px",
      fontFamily: "'PT_Root_UI-Bold', Helvetica, Arial, sans-serif",
    },
    subtitle1: {
      fontSize: "20px",
      fontWeight: 500,
      lineHeight: "28px",
      letterSpacing: "0px",
      fontFamily: "'PT_Root_UI-Medium', Helvetica, Arial, sans-serif",
    },
    subtitle2: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "normal",
      letterSpacing: "0px",
      fontFamily: "'PT_Root_UI-Medium', Helvetica, Arial, sans-serif",
    },
    body1: {
      fontSize: "20px",
      fontWeight: 500,
      lineHeight: "normal",
      letterSpacing: "0.4px",
      fontFamily: "'PT_Root_UI-Medium', Helvetica, Arial, sans-serif",
    },
    body2: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "normal",
      letterSpacing: "0.4px",
      fontFamily: "'PT_Root_UI-Medium', Helvetica, Arial, sans-serif",
    },
    button: {
      fontSize: "20px",
      fontWeight: 700,
      lineHeight: "28px",
      letterSpacing: "0px",
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
          padding: "13px 36px",
        },
        containedPrimary: {
          backgroundColor: "rgba(0, 174, 199, 1)",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "rgba(0, 156, 179, 1)",
          },
        },
        containedSecondary: {
          backgroundColor: "rgba(230, 246, 248, 1)",
          color: "rgba(0, 174, 199, 1)",
          "&:hover": {
            backgroundColor: "rgba(220, 236, 238, 1)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 1)",
          color: "rgba(38, 38, 38, 1)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(236, 241, 245, 1)",
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
          fontWeight: 700,
        }),
        body: ({ theme }) => ({
          ...theme.typography.body1,
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
          backgroundColor: "#ffffff",
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export const ThemeProvider404 = ({ children }) => {
  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
