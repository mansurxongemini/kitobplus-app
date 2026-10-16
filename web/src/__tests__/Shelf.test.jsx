import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { SWRConfig } from "swr";
import Shelf from "../ds/components/Shelf";
import { createAppTheme } from "../ds/theme";
import { LibraryProvider } from "../LibraryContext";

const books = [
  { id: 1, title: "Birinchi kitob", authors_name: "Muallif", seconds: 3600 },
  { id: 2, title: "Ikkinchi kitob", authors_name: "Muallif", seconds: 3600 },
];

const wrap = (ui) => (
  <LibraryProvider>
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <MuiThemeProvider theme={createAppTheme("light")}>
        <MemoryRouter>{ui}</MemoryRouter>
      </MuiThemeProvider>
    </SWRConfig>
  </LibraryProvider>
);

describe("Shelf", () => {
  beforeEach(() => { localStorage.clear(); });

  it("renders section labelled by h2, list, Hammasi link and nav buttons", () => {
    const { container } = render(wrap(<Shelf id="s1" title="Yangi kitoblar" to="/books?sort=new" books={books} />));
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "s1");
    const heading = container.querySelector("h2#s1");
    expect(heading).not.toBeNull();
    expect(heading.textContent).toContain("Yangi kitoblar");
    expect(container.querySelector("ul")).not.toBeNull();
    const all = container.querySelector('a[aria-label="Yangi kitoblar: hammasi"]');
    expect(all).not.toBeNull();
    expect(all).toHaveAttribute("href", "/books?sort=new");
    expect(all.textContent).toContain("Hammasi");
    const prev = container.querySelector('button[aria-label="Oldingi kitoblar"]');
    const next = container.querySelector('button[aria-label="Keyingi kitoblar"]');
    expect(prev).not.toBeNull();
    expect(next).not.toBeNull();
    expect(prev).toHaveAttribute("aria-controls", "s1-list");
  });

  it("ranked shows visually hidden 1-oʻrin before the title", () => {
    const { container } = render(wrap(<Shelf title="Top" books={books} variant="ranked" />));
    expect(container.textContent).toContain("1-oʻrin");
    expect(container.textContent).toContain("2-oʻrin");
  });

  it("empty shelf renders nothing", () => {
    const { container } = render(wrap(<Shelf title="Boʻsh" books={[]} />));
    expect(container.querySelector("section")).toBeNull();
  });
});
