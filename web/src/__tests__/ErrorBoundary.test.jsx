import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import ErrorBoundary, { isChunkLoadError } from "../ds/components/ErrorBoundary";
import { createAppTheme } from "../ds/theme";

const Boom = () => {
  throw new Error("boom");
};

const ChunkBoom = () => {
  const err = new Error("Loading chunk 42 failed");
  err.name = "ChunkLoadError";
  throw err;
};

const renderBoundary = (ui) =>
  render(<MuiThemeProvider theme={createAppTheme("light")}>{ui}</MuiThemeProvider>);

describe("ErrorBoundary", () => {
  let reloadMock;
  let consoleErrorSpy;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    reloadMock = jest.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload: reloadMock, assign: jest.fn() },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders children when there is no error", () => {
    renderBoundary(
      <ErrorBoundary>
        <p>ok content</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("ok content")).toBeInTheDocument();
  });

  it("renders the fallback with heading and actions, focusing the heading", () => {
    renderBoundary(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent.length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(document.activeElement).toBe(heading);
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it("detects chunk load errors", () => {
    const chunkError = new Error("Failed to fetch dynamically imported module: /static/js/1.js");
    chunkError.name = "ChunkLoadError";
    expect(isChunkLoadError(chunkError)).toBe(true);
    expect(isChunkLoadError(new Error("Loading chunk 5 failed"))).toBe(true);
    expect(isChunkLoadError(new Error("plain error"))).toBe(false);
  });

  it("chunk error triggers a single reload guarded by sessionStorage", () => {
    const { unmount } = renderBoundary(
      <ErrorBoundary>
        <ChunkBoom />
      </ErrorBoundary>
    );
    expect(reloadMock).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem("kp-chunk-reload")).toBe("1");
    unmount();

    // Second mount with the flag set must not reload again.
    renderBoundary(
      <ErrorBoundary>
        <ChunkBoom />
      </ErrorBoundary>
    );
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
