import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import React, { useMemo } from "react";
import useLibrary from "../LibraryContext";
import { createAppTheme } from "../ds/theme";
import "../ds/fonts";

export const ThemeProvider = ({ children }) => {
  const { themeMode, textScale } = useLibrary();
  const appTheme = useMemo(() => createAppTheme(themeMode, textScale), [themeMode, textScale]);
  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
