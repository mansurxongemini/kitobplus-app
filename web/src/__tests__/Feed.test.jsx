import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { SWRConfig } from "swr";
import Feed from "../home/Feed";
import { createAppTheme } from "../ds/theme";
import { LibraryProvider } from "../LibraryContext";
import { announce } from "../lib/a11y";

jest.mock("../lib/a11y", () => {
  const actual = jest.requireActual("../lib/a11y");
  return { ...actual, announce: jest.fn() };
});

const payloadFor = (url) => {
  const u = String(url);
  if (u.includes("genres.php")) return { data: [{ id: 1, name: "Roman", books_count: 5 }, { id: 2, name: "Sheʼr", books_count: 3 }] };
  if (u.includes("persons.php?table=authors")) return { data: [{ id: 2, name: "Muallif A", books_count: 3 }] };
  if (u.includes("persons.php?table=dictors")) return { data: [{ id: 3, name: "Diktor B", books_count: 4 }] };
  if (u.includes("books.php")) return { success: true, total: 1, data: [{ id: 10, title: "Kitob", authors_name: "Muallif", seconds: 60 }] };
  return { success: true, data: [] };
};

const wrap = (ui) => (
  <LibraryProvider>
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <MuiThemeProvider theme={createAppTheme("light")}>
        <MemoryRouter>{ui}</MemoryRouter>
      </MuiThemeProvider>
    </SWRConfig>
  </LibraryProvider>
);

describe("Feed", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn((url) => Promise.resolve({ json: () => Promise.resolve(payloadFor(url)) }));
  });

  it("renders first batch of 4 descriptors and hides personal shelves without a token", async () => {
    render(wrap(<Feed promos={{ join: <div>JOIN_PROMO</div>, access: <div>ACCESS_PROMO</div>, news: <div>NEWS_PROMO</div> }} />));
    // First 4: new, top-10, join promo, first genre shelf.
    expect(await screen.findByRole("heading", { name: "Yangi qoʻshilganlar" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Haftaning top-10 kitobi" })).toBeInTheDocument();
    expect(screen.getByText("JOIN_PROMO")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Roman" })).toBeInTheDocument();
    // Later descriptors not yet rendered.
    expect(screen.queryByText("ACCESS_PROMO")).not.toBeInTheDocument();
    // No token: personal shelves hidden.
    expect(screen.queryByRole("heading", { name: "Davom ettiring" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Kitob javoningiz" })).not.toBeInTheDocument();
  });

  it("clicking Yana koʻrsatish adds more and announces", async () => {
    render(wrap(<Feed promos={{ join: <div>JOIN_PROMO</div>, access: <div>ACCESS_PROMO</div>, news: <div>NEWS_PROMO</div> }} />));
    await screen.findByRole("heading", { name: "Roman" });
    fireEvent.click(screen.getByRole("button", { name: "Yana koʻrsatish" }));
    expect(await screen.findByText("ACCESS_PROMO")).toBeInTheDocument();
    expect(announce).toHaveBeenCalledWith(expect.stringContaining("3"));
  });
});
