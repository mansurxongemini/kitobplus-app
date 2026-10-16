import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { Reveal, RiseText } from "../ds/motion";
import { createAppTheme } from "../ds/theme";

// setupTests mocks matchMedia so prefers-reduced-motion matches.

describe("Reveal / RiseText with reduced motion", () => {
  it("Reveal renders its content", () => {
    render(
      <MuiThemeProvider theme={createAppTheme("light")}>
        <Reveal>
          <p>Visible content</p>
        </Reveal>
      </MuiThemeProvider>
    );
    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });

  it("RiseText keeps the whole heading readable with spaces between lines", () => {
    const { container } = render(
      <MuiThemeProvider theme={createAppTheme("light")}>
        <h1>
          <RiseText lines={[["Birinchi", "qator"], ["Ikkinchi", "qator"]]} />
        </h1>
      </MuiThemeProvider>
    );
    const heading = container.querySelector("h1");
    expect(heading.textContent.replace(/\s+/g, " ").trim()).toBe(
      "Birinchi qator Ikkinchi qator"
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
