import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import BookCard from "../ds/components/BookCard";
import { createAppTheme } from "../ds/theme";
import { LibraryProvider } from "../LibraryContext";

const book = {
  id: 123,
  title: "Oʻtkan kunlar",
  authors_name: "Abdulla Qodiriy",
  seconds: 3600,
};

describe("BookCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders one link whose accessible name is the book title", () => {
    render(
      <LibraryProvider>
        <MuiThemeProvider theme={createAppTheme("light")}>
          <MemoryRouter>
            <BookCard book={book} />
          </MemoryRouter>
        </MuiThemeProvider>
      </LibraryProvider>
    );
    // jsdom's getComputedStyle trips on MUI/emotion stylesheets when
    // resolving roles, so query the anchor directly and check its name.
    const links = document.querySelectorAll("a");
    expect(links).toHaveLength(1);
    expect(links[0].textContent.trim()).toBe("Oʻtkan kunlar");
    expect(links[0]).toHaveAttribute("href", "/books/123");
  });
});
