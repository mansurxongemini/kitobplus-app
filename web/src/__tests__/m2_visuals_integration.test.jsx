import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { createAppTheme } from "../ds/theme";
import { LibraryProvider } from "../LibraryContext";

import { GENRE_ITEMS_DEFAULT, GENRE_IMG_MAP, GenreCardItem } from "../genres/GenresView";
import { GenreHeaderIcon } from "../person/PersonBanner";
import NotFound from "../NotFound";
import ShelfSection from "../profile/ShelfSection";
import HistorySection from "../profile/HistorySection";
import T from "../lib/translator";

import genreRoman from "../img/genre_roman.png";
import genreHikoya from "../img/genre_hikoya.png";
import genreJahonKlassikasi from "../img/genre_jahon_klassikasi.png";
import genreBolalarAdabiyoti from "../img/genre_bolalar_adabiyoti.png";
import genreDostonlar from "../img/genre_dostonlar.png";
import genreFantastika from "../img/genre_fantastika.png";
import genreTarixiy from "../img/genre_tarixiy.png";
import genreDetektiv from "../img/genre_detektiv.png";
import genreBiografiya from "../img/genre_biografiya.png";
import genrePsixologiya from "../img/genre_psixologiya.png";
import genreSheriyat from "../img/genre_sheriyat.png";
import genreErtak from "../img/genre_ertak.png";

const wrap = (node, themeMode = "light") => (
  <LibraryProvider>
    <MuiThemeProvider theme={createAppTheme(themeMode)}>
      <MemoryRouter>{node}</MemoryRouter>
    </MuiThemeProvider>
  </LibraryProvider>
);

describe("Milestone M2: Bespoke 3D Editorial Visuals Integration", () => {
  describe("12 Genre Artwork Mapping & Integrity", () => {
    it("maps all 12 genre IDs cleanly in GENRE_IMG_MAP", () => {
      const expectedIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
      expectedIds.forEach((id) => {
        expect(GENRE_IMG_MAP[id]).toBeDefined();
        expect(typeof GENRE_IMG_MAP[id]).toBe("string");
      });
    });

    it("ensures GENRE_ITEMS_DEFAULT contains exactly 12 configured items with non-empty titles and counts", () => {
      expect(GENRE_ITEMS_DEFAULT).toHaveLength(12);
      GENRE_ITEMS_DEFAULT.forEach((g) => {
        expect(g.name.length).toBeGreaterThan(0);
        expect(g.count.length).toBeGreaterThan(0);
        expect(g.img).toBeDefined();
      });
    });

    it("renders GenreCardItem with proper accessibility label and target link", () => {
      render(wrap(<GenreCardItem id="1" name="Roman" count="14 ta kitob" img={genreRoman} />));
      const link = screen.getByRole("link", { name: "Roman: 14 ta kitob" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/books/genres/1");
      const img = link.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", genreRoman);
    });
  });

  describe("GenreHeaderIcon in PersonBanner", () => {
    it("renders local 3D genre image for ID 1 (Roman) without falling back to generic icon", () => {
      const { container } = render(wrap(<GenreHeaderIcon id="1" />));
      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img.getAttribute("src")).toContain("genre_roman");
    });

    it("renders local 3D genre image for ID 12 (Dostonlar)", () => {
      const { container } = render(wrap(<GenreHeaderIcon id="12" />));
      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img.getAttribute("src")).toContain("genre_dostonlar");
    });
  });

  describe("NotFound Route 3D Illustration & Recovery", () => {
    it("renders NotFound page with 404 WebP illustration and primary recovery button", () => {
      render(wrap(<NotFound />));
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      const images = screen.getAllByRole("img", { hidden: true });
      const found404 = images.some((img) => img.getAttribute("src")?.includes("404"));
      expect(found404).toBe(true);
    });
  });

  describe("ShelfSection & HistorySection Editorial Empty States", () => {
    it("renders empty shelf illustration and title when shelf has 0 books", async () => {
      render(wrap(<ShelfSection />));
      const heading = await screen.findByRole("heading", { name: new RegExp(T("Книжная полка пуста"), "i") });
      expect(heading).toBeInTheDocument();
      const img = document.querySelector("img[src*='empty_shelf']");
      expect(img).toBeInTheDocument();
    });

    it("renders empty history illustration and title when listening history has 0 books", async () => {
      render(wrap(<HistorySection />));
      const heading = await screen.findByRole("heading", { name: new RegExp(T("История прослушивания пуста"), "i") });
      expect(heading).toBeInTheDocument();
      const img = document.querySelector("img[src*='empty_shelf']");
      expect(img).toBeInTheDocument();
    });
  });
});
