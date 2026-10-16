import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { SWRConfig } from "swr";
import BooksSection from "../books/BooksSeciton";
import { createAppTheme } from "../ds/theme";
import { LibraryProvider } from "../LibraryContext";

const wrap = (ui) => (
  <LibraryProvider>
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <MuiThemeProvider theme={createAppTheme("light")}>
        <MemoryRouter>{ui}</MemoryRouter>
      </MuiThemeProvider>
    </SWRConfig>
  </LibraryProvider>
);

describe("BooksSection infinite loading", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn((url) => {
      const u = String(url);
      const page = Number((u.match(/[?&]page=(\d+)/) || [])[1] || 0);
      const data = [{ id: page + 1, title: `Kitob ${page + 1}`, authors_name: "Muallif", seconds: 60 }];
      return Promise.resolve({ json: () => Promise.resolve({ success: true, total: 48, data }) });
    });
  });

  it("Yana yuklash requests page 1 with per_page 24", async () => {
    render(wrap(<BooksSection selectedGenres={new Set()} sort="new" filter="" onTotal={() => {}} />));
    let button;
    await waitFor(() => {
      button = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Yana yuklash"));
      expect(button).toBeTruthy();
    });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("page=0&per_page=24"));
    fireEvent.click(button);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("page=1&per_page=24"));
    });
  });
});
