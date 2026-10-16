import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { tr } from "../../lib/translator";

const CHUNK_RELOAD_KEY = "kp-chunk-reload";

export const isChunkLoadError = (error) => {
  if (!error) return false;
  const text = `${error.name || ""} ${error.message || ""}`;
  return (
    error.name === "ChunkLoadError" ||
    text.includes("Loading chunk") ||
    text.includes("Failed to fetch dynamically imported module") ||
    text.includes("Importing a module script failed")
  );
};

// Friendly fallback for render/runtime errors. Class component: error
// boundaries cannot be function components. Texts use tr() because hooks
// (T) are unavailable here; the language is read from storage/context-free
// helpers inside tr().
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.headingRef = React.createRef();
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    if (isChunkLoadError(error)) {
      try {
        if (!window.sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
          window.sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
          window.location.reload();
        }
      } catch (storageError) {
        console.error("ErrorBoundary: sessionStorage unavailable", storageError);
      }
    }
  }

  componentDidMount() {
    if (this.state.hasError && this.headingRef.current) {
      this.headingRef.current.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError && this.headingRef.current) {
      this.headingRef.current.focus();
    }
  }

  handleReload = () => {
    try {
      window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch (storageError) {
      console.error("ErrorBoundary: sessionStorage unavailable", storageError);
    }
    window.location.reload();
  };

  handleHome = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
          px: 2,
          py: 8,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          tabIndex={-1}
          ref={this.headingRef}
          sx={{ outline: "none" }}
        >
          {tr("Что-то пошло не так")}
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 560 }}>
          {tr(
            "Не удалось загрузить страницу. Попробуйте перезагрузить её. Если ошибка повторяется, вернитесь на главную страницу."
          )}
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center", mt: 2 }}>
          <Button variant="contained" onClick={this.handleReload} sx={{ minHeight: 56, px: 3 }}>
            {tr("Перезагрузить страницу")}
          </Button>
          <Button variant="outlined" onClick={this.handleHome} sx={{ minHeight: 56, px: 3 }}>
            {tr("На главную")}
          </Button>
        </Box>
      </Box>
    );
  }
}

export default ErrorBoundary;
