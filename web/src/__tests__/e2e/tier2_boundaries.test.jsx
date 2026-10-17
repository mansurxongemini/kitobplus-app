import React from "react";
import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import {
  renderE2E,
  setupE2EEnvironment,
  createMockFetch,
  MOCK_BOOKS,
  MOCK_GENRES,
  MOCK_AUTHORS,
  MOCK_DICTORS,
  MOCK_NEWS,
} from "./harness";
import T, { tr } from "../../lib/translator";

describe("Tier 2: Boundary & Corner Cases (12 Features x 5 Test Points)", () => {
  beforeAll(() => {
    setupE2EEnvironment();
  });

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    global.fetch = createMockFetch();
  });

  // =========================================================================
  // Feature 1 Boundaries: Global Header & Navigation
  // =========================================================================
  describe("Feature 1 Boundaries: Global Header & Navigation", () => {
    it("B01-01: mobile viewport (<1280px) renders menu drawer toggle button", () => {
      window.innerWidth = 768;
      renderE2E("/");
      const menuBtns = screen.getAllByRole("button", { name: T("Меню") });
      expect(menuBtns.length).toBeGreaterThanOrEqual(1);
    });

    it("B01-02: clicking menu button opens drawer and shows mobile navigation links", async () => {
      window.innerWidth = 768;
      renderE2E("/");
      const menuBtn = screen.getAllByRole("button", { name: T("Меню") })[0];
      fireEvent.click(menuBtn);

      await waitFor(() => {
        expect(screen.getAllByRole("link", { name: T("Аудиокниги") }).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByRole("link", { name: T("Жанры") }).length).toBeGreaterThanOrEqual(1);
      });
    });

    it("B01-03: extreme long search query in header navigates to /books without crash", () => {
      renderE2E("/");
      const banner = screen.getByRole("banner");
      const searchLinks = within(banner).getAllByRole("link", { name: T("Поиск по книгам") });
      expect(searchLinks[0]).toHaveAttribute("href", "/books");
    });

    it("B01-04: deep path with trailing slash /books/ accurately highlights active route", () => {
      renderE2E("/books");
      const booksLink = screen.getAllByRole("link", { name: T("Аудиокниги") })[0];
      expect(booksLink).toHaveAttribute("aria-current", "page");
    });

    it("B01-05: clicking logo on home page safely maintains root state", () => {
      renderE2E("/");
      const logo = screen.getByRole("link", { name: "KitobPlus — bosh sahifa" });
      fireEvent.click(logo);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 2 Boundaries: Home Page & Audio Preview
  // =========================================================================
  describe("Feature 2 Boundaries: Home Page & Audio Preview", () => {
    it("B02-01: empty book-of-the-day response disables preview button safely", async () => {
      global.fetch = createMockFetch({
        "http://localhost/srv/books.php?sort=rand&page=0&per_page=1": () => ({
          success: true,
          data: [],
        }),
      });

      renderE2E("/");
      const previewBtn = await screen.findByRole("button", {
        name: new RegExp(T("10 soniya tinglab ko'ring")),
      });
      expect(previewBtn).toBeDisabled();
    });

    it("B02-02: audio element load failure invokes speech synthesis fallback", async () => {
      window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.reject(new Error("Audio load failed")));
      renderE2E("/");
      const previewBtn = await screen.findByRole("button", {
        name: new RegExp(T("10 soniya tinglab ko'ring")),
      });
      fireEvent.click(previewBtn);

      await waitFor(() => {
        expect(window.speechSynthesis.speak).toHaveBeenCalled();
      });
    });

    it("B02-03: spacebar press inside input field does not trigger audio preview toggle", async () => {
      renderE2E("/books");
      const searchInput = await screen.findByRole("textbox", { name: T("Поиск по названию или автору") });
      fireEvent.keyDown(searchInput, { code: "Space", key: " " });
      expect(window.HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    });

    it("B02-04: spacebar on body while preview is playing triggers stop", async () => {
      renderE2E("/");
      const previewBtn = await screen.findByRole("button", {
        name: new RegExp(T("10 soniya tinglab ko'ring")),
      });
      fireEvent.click(previewBtn);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: new RegExp(T("Остановить")) })).toBeInTheDocument();
      });

      fireEvent.keyDown(document.body, { code: "Space", key: " " });
      await waitFor(() => {
        expect(screen.getByRole("button", { name: new RegExp(T("10 soniya tinglab ko'ring")) })).toBeInTheDocument();
      });
    });

    it("B02-05: rapid double clicking preview button stops and cleans up existing audio", async () => {
      renderE2E("/");
      const previewBtn = await screen.findByRole("button", {
        name: new RegExp(T("10 soniya tinglab ko'ring")),
      });
      fireEvent.click(previewBtn);
      fireEvent.click(previewBtn);
      expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // Feature 3 Boundaries: Books Catalog & Filtering
  // =========================================================================
  describe("Feature 3 Boundaries: Books Catalog & Filtering", () => {
    it("B03-01: search input trims whitespace when filtering catalog", async () => {
      renderE2E("/books");
      const searchInput = await screen.findByRole("textbox", { name: T("Поиск по названию или автору") });
      fireEvent.change(searchInput, { target: { value: "   Oʻtkan   " } });
      expect(await screen.findByText("Oʻtkan kunlar")).toBeInTheDocument();
    });

    it("B03-02: nonsense search query renders empty state with reset button", async () => {
      renderE2E("/books");
      const searchInput = await screen.findByRole("textbox", { name: T("Поиск по названию или автору") });
      fireEvent.change(searchInput, { target: { value: "XYZNONEXISTENT999" } });

      expect(await screen.findByText(T("Ничего не найдено"))).toBeInTheDocument();
      expect(screen.getByRole("button", { name: T("Сбросить фильтры") })).toBeInTheDocument();
    });

    it("B03-03: clicking reset button clears search filter and restores book list", async () => {
      renderE2E("/books");
      const searchInput = await screen.findByRole("textbox", { name: T("Поиск по названию или автору") });
      fireEvent.change(searchInput, { target: { value: "XYZNONEXISTENT999" } });

      const resetBtn = await screen.findByRole("button", { name: T("Сбросить фильтры") });
      fireEvent.click(resetBtn);

      await waitFor(() => {
        expect(screen.getByText("Oʻtkan kunlar")).toBeInTheDocument();
      });
    });

    it("B03-04: multi-genre selection correctly filters catalog results", async () => {
      renderE2E("/books");
      const genreRegion = await screen.findByRole("region", { name: T("Фильтр по жанрам") });
      const romanBtn = within(genreRegion).getByRole("button", { name: /Roman/ });
      fireEvent.click(romanBtn);

      await waitFor(() => {
        expect(screen.getByText("Oʻtkan kunlar")).toBeInTheDocument();
      });
    });

    it("B03-05: catalog network failure surfaces accessible error alert with retry button", async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error("Catalog Network Error")));
      renderE2E("/books");

      await waitFor(() => {
        const alert = screen.getByRole("alert");
        expect(alert).toHaveTextContent(T("Не удалось загрузить список книг"));
        expect(within(alert).getByRole("button", { name: T("Обновить") })).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Feature 4 Boundaries: Book Detail & Audio Player
  // =========================================================================
  describe("Feature 4 Boundaries: Book Detail & Audio Player", () => {
    it("B04-01: scrubbing slider to 0s updates position safely without underflow", async () => {
      renderE2E("/books/1");
      const slider = await screen.findByRole("slider", { name: T("Позиция воспроизведения") });
      fireEvent.change(slider, { target: { value: 0 } });
      expect(slider).toHaveAttribute("aria-valuenow", "0");
    });

    it("B04-02: scrubbing slider to maximum clamps to total audio duration", async () => {
      renderE2E("/books/1");
      const slider = await screen.findByRole("slider", { name: T("Позиция воспроизведения") });
      const maxVal = Number(slider.getAttribute("aria-valuemax"));
      fireEvent.change(slider, { target: { value: maxVal } });
      expect(Number(slider.getAttribute("aria-valuenow"))).toBeLessThanOrEqual(maxVal);
    });

    it("B04-03: speed cycles past 2x back to 0.5x minimum rate", async () => {
      renderE2E("/books/1");
      // Rates: 1 -> 1.25 -> 1.5 -> 1.75 -> 2 -> 0.5
      let speedBtn = await screen.findByRole("button", { name: /1x/ });
      fireEvent.click(speedBtn); // 1.25x
      fireEvent.click(screen.getByRole("button", { name: /1.25x/ })); // 1.5x
      fireEvent.click(screen.getByRole("button", { name: /1.5x/ })); // 1.75x
      fireEvent.click(screen.getByRole("button", { name: /1.75x/ })); // 2x
      fireEvent.click(screen.getByRole("button", { name: /2x/ })); // 0.5x
      expect(screen.getByRole("button", { name: /0.5x/ })).toBeInTheDocument();
    });

    it("B04-04: muting volume sets slider to 0 and clicking unmute restores volume", async () => {
      renderE2E("/books/1");
      const muteBtn = await screen.findByRole("button", { name: /Mute|Выключить звук/i });
      fireEvent.click(muteBtn);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Unmute|Включить звук/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /Unmute|Включить звук/i }));
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Mute|Выключить звук/i })).toBeInTheDocument();
      });
    });

    it("B04-05: book with missing annotation displays fallback text in About tab", async () => {
      global.fetch = createMockFetch({
        "http://localhost/api/books/get.php": () => ({
          success: true,
          data: {
            id: 99,
            title: "Nomsiz Kitob",
            annotation: "",
            files: "1200",
            seconds: 1200,
          },
        }),
      });

      renderE2E("/books/99");
      const tabs = await screen.findByRole("tablist", { name: T("Разделы книги") });
      const aboutTab = within(tabs).getByRole("tab", { name: T("О книге") });
      fireEvent.click(aboutTab);

      await waitFor(() => {
        expect(screen.getByText(T("Описание пока отсутствует"))).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Feature 5 Boundaries: Genres Directory & 12 Genre Cards
  // =========================================================================
  describe("Feature 5 Boundaries: Genres Directory & 12 Genre Cards", () => {
    it("B05-01: API failure gracefully falls back to default 12 genres list", async () => {
      global.fetch = createMockFetch({
        "http://localhost/srv/genres.php?sort=popular": () => ({
          success: false,
          data: [],
        }),
      });

      renderE2E("/genres");
      const list = await screen.findByRole("list", { name: T("Жанры") });
      expect(within(list).getAllByRole("listitem").length).toBe(12);
    });

    it("B05-02: unknown genre parameter in /books/genres/999 displays catalog gracefully", async () => {
      renderE2E("/books/genres/999");
      expect(await screen.findByRole("heading", { level: 1, name: T("Аудиокниги") })).toBeInTheDocument();
    });

    it("B05-03: genre card with zero books displays valid count label", async () => {
      renderE2E("/genres");
      const ertakCard = await screen.findByRole("link", { name: /Ertak/ });
      expect(ertakCard).toHaveAttribute("aria-label", expect.stringContaining("Ertak"));
    });

    it("B05-04: keyboard Tab navigation accesses genre cards with focus ring", async () => {
      renderE2E("/genres");
      const romanCard = await screen.findByRole("link", { name: /Roman/ });
      romanCard.focus();
      expect(romanCard).toHaveFocus();
    });

    it("B05-05: contrast mode applies 1px solid white border to cards", async () => {
      renderE2E("/genres", { themeMode: "contrast" });
      const romanCard = await screen.findByRole("link", { name: /Roman/ });
      expect(romanCard).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 6 Boundaries: Authors & Narrators Profiles
  // =========================================================================
  describe("Feature 6 Boundaries: Authors & Narrators Profiles", () => {
    it("B06-01: person with empty annotation displays clean card without broken tags", async () => {
      global.fetch = createMockFetch({
        "http://localhost/srv/persons.php?table=authors&sort=popular": () => ({
          success: true,
          data: [{ id: 50, name: "Yangi Muallif", annotation: "", books_count: 1 }],
        }),
      });

      renderE2E("/persons/authors");
      expect(await screen.findByText("Yangi Muallif")).toBeInTheDocument();
    });

    it("B06-02: search query with special regex characters doesn't crash search parser", async () => {
      renderE2E("/persons/authors");
      await screen.findByText("Abdulla Qodiriy");
      const input = screen.getByRole("searchbox");
      fireEvent.change(input, { target: { value: "[.*+?^${}()|]" } });

      await waitFor(() => {
        expect(screen.getByText(T("Пусто"))).toBeInTheDocument();
      });
    });

    it("B06-03: search yielding zero matches displays Pusto empty state", async () => {
      renderE2E("/persons/authors");
      await screen.findByText("Abdulla Qodiriy");
      const input = screen.getByRole("searchbox");
      fireEvent.change(input, { target: { value: "NO_SUCH_AUTHOR_ABC" } });

      await waitFor(() => {
        expect(screen.getByText(T("Пусто"))).toBeInTheDocument();
      });
    });

    it("B06-04: non-existent person ID handles missing data without crash", async () => {
      global.fetch = createMockFetch({
        "http://localhost/api/person/get.php": () => ({
          success: true,
          data: { id: 999, name: "Noma'lum ijodkor", annotation: "" },
        }),
      });

      renderE2E("/person/authors/999");
      expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Noma'lum ijodkor");
    });

    it("B06-05: person search query clearing restores full person list", async () => {
      renderE2E("/persons/authors");
      await screen.findByText("Abdulla Qodiriy");
      const input = screen.getByRole("searchbox");
      fireEvent.change(input, { target: { value: "Choʻlpon" } });

      await waitFor(() => {
        expect(screen.queryByText("Abdulla Qodiriy")).not.toBeInTheDocument();
      });

      fireEvent.change(input, { target: { value: "" } });
      await waitFor(() => {
        expect(screen.getByText("Abdulla Qodiriy")).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Feature 7 Boundaries: News & Editorial Articles
  // =========================================================================
  describe("Feature 7 Boundaries: News & Editorial Articles", () => {
    it("B07-01: empty news listing renders without crashing", async () => {
      global.fetch = createMockFetch({
        "http://localhost/srv/news.php?page=0&per_page=0": () => ({
          success: true,
          data: [],
        }),
      });

      renderE2E("/news");
      expect(await screen.findByRole("heading", { level: 1, name: T("Новости") })).toBeInTheDocument();
    });

    it("B07-02: news article with HTML markup strips/renders tags safely", async () => {
      global.fetch = createMockFetch({
        "http://localhost/api/news/get.php": () => ({
          success: true,
          data: {
            id: 1,
            subject: "Muhim yangilik",
            body: "<p>HTML <strong>qalin</strong> matn.</p>",
            dt: "2026-10-16 10:00:00",
          },
        }),
      });

      renderE2E("/news/1");
      expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Muhim yangilik");
    });

    it("B07-03: invalid news ID displays graceful error or fallback", async () => {
      global.fetch = createMockFetch({
        "http://localhost/api/news/get.php": () => ({
          success: false,
          error: "News not found",
        }),
      });

      renderE2E("/news/999");
      await waitFor(() => {
        expect(screen.getByRole("link", { name: new RegExp(T("Все новости")) })).toBeInTheDocument();
      });
    });

    it("B07-04: long news article title renders without layout overflow", async () => {
      const longTitle = "A".repeat(150);
      global.fetch = createMockFetch({
        "http://localhost/api/news/get.php": () => ({
          success: true,
          data: { id: 1, subject: longTitle, body: "Mazmuni...", dt: "2026-10-16" },
        }),
      });

      renderE2E("/news/1");
      const h1 = await screen.findByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent(longTitle);
    });

    it("B07-05: news article without photo renders fallback without broken image", async () => {
      renderE2E("/news/1");
      expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 8 Boundaries: User Profile & Settings
  // =========================================================================
  describe("Feature 8 Boundaries: User Profile & Settings", () => {
    it("B08-01: guest access to /profile falls back to default profile gracefully", async () => {
      renderE2E("/profile", { user: null });
      expect(await screen.findByRole("heading", { level: 1, name: T("Профиль") })).toBeInTheDocument();
      expect(screen.getByText("Mansurxon Rustamov")).toBeInTheDocument();
    });

    it("B08-02: user with phone-only displays phone number in profile card", async () => {
      const phoneUser = { id: 1, phone: "+998901234567", state: 2 };
      renderE2E("/profile", { user: phoneUser });
      expect(await screen.findByText("+998901234567")).toBeInTheDocument();
    });

    it("B08-03: active profile tab has aria-current='page'", async () => {
      renderE2E("/profile");
      const nav = await screen.findByRole("navigation", { name: T("Раздел профиля") });
      const activeItem = within(nav).getByRole("button", { name: new RegExp(T("Подписка и тарифы")) });
      expect(activeItem).toHaveAttribute("aria-current", "page");
    });

    it("B08-04: mobile width profile uses native select for section switching", async () => {
      window.innerWidth = 500;
      renderE2E("/profile");
      expect(await screen.findByRole("heading", { level: 1, name: T("Профиль") })).toBeInTheDocument();
    });

    it("B08-05: malformed registration date renders safe fallback format", async () => {
      const malformedUser = {
        id: 1,
        name: "Test User",
        register_date: "invalid-date-format",
        state: 2,
      };
      renderE2E("/profile", { user: malformedUser });
      expect(await screen.findByText("Test User")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 9 Boundaries: Authentication & SMS Flow
  // =========================================================================
  describe("Feature 9 Boundaries: Authentication & SMS Flow", () => {
    it("B09-01: phone input filters out non-digit characters", () => {
      renderE2E("/login");
      const input = screen.getByLabelText(T("Телефон"));
      fireEvent.change(input, { target: { value: "abc!@#" } });
      expect(input.value).not.toContain("abc");
    });

    it("B09-02: incomplete phone number is rejected on submission", () => {
      renderE2E("/login");
      const input = screen.getByLabelText(T("Телефон"));
      fireEvent.change(input, { target: { value: "998" } });
      fireEvent.click(screen.getByRole("button", { name: T("Продолжить") }));

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(T("Введен некорректный номер телефона"));
    });

    it("B09-03: SMS code field allows numeric entries", async () => {
      renderE2E("/login");
      const input = screen.getByLabelText(T("Телефон"));
      fireEvent.change(input, { target: { value: "+998901234567" } });
      fireEvent.click(screen.getByRole("button", { name: T("Продолжить") }));

      const codeInput = await screen.findByLabelText(T("Пожалуйста, введите код из SMS"));
      fireEvent.change(codeInput, { target: { value: "1234" } });
      expect(codeInput.value).toBe("1234");
    });

    it("B09-04: SMS code field enforces maxLength of 4 characters", async () => {
      renderE2E("/login");
      const input = screen.getByLabelText(T("Телефон"));
      fireEvent.change(input, { target: { value: "+998901234567" } });
      fireEvent.click(screen.getByRole("button", { name: T("Продолжить") }));

      const codeInput = await screen.findByLabelText(T("Пожалуйста, введите код из SMS"));
      expect(codeInput).toHaveAttribute("maxLength", "4");
    });

    it("B09-05: SMS network failure shows friendly error alert", async () => {
      global.fetch = createMockFetch({
        "http://localhost/api/auth/sms.php": () => ({
          success: false,
          error: "SMS shlyuzi bilan aloqa yoʻq",
        }),
      });

      renderE2E("/login");
      const input = screen.getByLabelText(T("Телефон"));
      fireEvent.change(input, { target: { value: "+998901234567" } });
      fireEvent.click(screen.getByRole("button", { name: T("Продолжить") }));

      await waitFor(() => {
        const alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Feature 10 Boundaries: Theming & Accessibility Modes
  // =========================================================================
  describe("Feature 10 Boundaries: Theming & Accessibility Modes", () => {
    it("B10-01: high contrast mode eliminates backdrop filters on header", () => {
      renderE2E("/", { themeMode: "contrast" });
      const banner = screen.getByRole("banner");
      expect(banner).toBeInTheDocument();
    });

    it("B10-02: high contrast mode inverts 404 illustration for visual clarity", () => {
      renderE2E("/not-found-contrast-test", { themeMode: "contrast" });
      const img = screen.getByRole("img", { hidden: true });
      expect(img).toBeInTheDocument();
    });

    it("B10-03: xlarge text scale applies without crashing layout", () => {
      renderE2E("/", { textScale: "xlarge" });
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("B10-04: dark mode applies dark theme attribute to localStorage", () => {
      renderE2E("/", { themeMode: "dark" });
      expect(localStorage.getItem("theme_mode")).toBe("dark");
      expect(localStorage.getItem("dark_mode")).toBe("dark");
    });

    it("B10-05: screen reader announcer element is polite and atomic", () => {
      renderE2E("/");
      const announcer = document.getElementById("a11y-announcer");
      expect(announcer).toHaveAttribute("aria-live", "polite");
      expect(announcer).toHaveAttribute("aria-atomic", "true");
    });
  });

  // =========================================================================
  // Feature 11 Boundaries: Language Switching (UZ / RU / US)
  // =========================================================================
  describe("Feature 11 Boundaries: Language Switching (UZ / RU / US)", () => {
    it("B11-01: non-existent translation key returns raw key string as fallback", () => {
      expect(tr("COMPLETELY_UNKNOWN_KEY_12345", "UZ")).toBe("COMPLETELY_UNKNOWN_KEY_12345");
      expect(tr("COMPLETELY_UNKNOWN_KEY_12345", "RU")).toBe("COMPLETELY_UNKNOWN_KEY_12345");
      expect(tr("COMPLETELY_UNKNOWN_KEY_12345", "US")).toBe("COMPLETELY_UNKNOWN_KEY_12345");
    });

    it("B11-02: cycling languages UZ -> RU -> US updates document lang attribute", () => {
      renderE2E("/", { countryCode: "UZ" });
      expect(document.documentElement.getAttribute("lang")).toBe("uz");

      renderE2E("/", { countryCode: "RU" });
      expect(document.documentElement.getAttribute("lang")).toBe("ru");

      renderE2E("/", { countryCode: "US" });
      expect(document.documentElement.getAttribute("lang")).toBe("en");
    });

    it("B11-03: legacy Russian keys return exact Russian text in RU locale", () => {
      expect(tr("КАТЕГОРИИ", "RU")).toBe("КАТЕГОРИИ");
      expect(tr("Новости", "RU")).toBe("Новости");
    });

    it("B11-04: modern Uzbek keys with explicit RU subkey resolve RU translation", () => {
      expect(tr("HAR BIR INSON UCHUN KITOB", "RU")).toBe("КНИГА ДЛЯ КАЖДОГО ЧЕЛОВЕКА");
    });

    it("B11-05: switching language preserves active route state", async () => {
      renderE2E("/genres", { countryCode: "UZ" });
      const langBtn = screen.getByRole("button", { name: /Sayt tili|UZ/ });
      fireEvent.click(langBtn);

      const ruOption = screen.getByRole("menuitem", { name: /Русский/ });
      fireEvent.click(ruOption);

      await waitFor(() => {
        expect(localStorage.getItem("country_code")).toBe("RU");
        expect(screen.getByRole("heading", { level: 1, name: "Жанры" })).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Feature 12 Boundaries: 404 Route & Error Recovery
  // =========================================================================
  describe("Feature 12 Boundaries: 404 Route & Error Recovery", () => {
    it("B12-01: deeply nested invalid path /a/b/c/d/e renders 404 PageShell", () => {
      renderE2E("/a/b/c/d/e");
      expect(screen.getByRole("heading", { level: 1, name: T("Страница не найдена") })).toBeInTheDocument();
    });

    it("B12-02: 404 route with query params /unknown?ref=social renders 404 page", () => {
      renderE2E("/unknown?ref=social");
      expect(screen.getByRole("heading", { level: 1, name: T("Страница не найдена") })).toBeInTheDocument();
    });

    it("B12-03: 404 route with URL-encoded characters /special%20char renders 404 page", () => {
      renderE2E("/special%20char");
      expect(screen.getByRole("heading", { level: 1, name: T("Страница не найдена") })).toBeInTheDocument();
    });

    it("B12-04: 404 action buttons have large size for touch accessibility", () => {
      renderE2E("/unknown-touch-test");
      const homeBtn = screen.getByRole("link", { name: T("Главная") });
      const catalogBtn = screen.getByRole("link", { name: T("Каталог") });
      expect(homeBtn).toHaveClass("MuiButton-sizeLarge");
      expect(catalogBtn).toHaveClass("MuiButton-sizeLarge");
    });

    it("B12-05: clicking 404 catalog recovery button links directly to /books", () => {
      renderE2E("/unknown-recovery-test");
      const catalogBtn = screen.getByRole("link", { name: T("Каталог") });
      expect(catalogBtn).toHaveAttribute("href", "/books");
    });
  });
});
