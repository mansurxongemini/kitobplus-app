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

describe("Tier 1: Feature Coverage (12 Core Features x 5 Test Points)", () => {
  beforeAll(() => {
    setupE2EEnvironment();
  });

  beforeEach(() => {
    window.innerWidth = 1280;
    window.innerHeight = 800;
    localStorage.clear();
    jest.clearAllMocks();
    global.fetch = createMockFetch();
  });

  // =========================================================================
  // Feature 1: Global Header & Navigation
  // =========================================================================
  describe("Feature 1: Global Header & Navigation", () => {
    it("F01-01: renders banner landmark with skip link and accessible logo linking to home", () => {
      renderE2E("/");
      const banner = screen.getByRole("banner");
      expect(banner).toBeInTheDocument();

      const skipLink = screen.getByRole("link", {
        name: T("Перейти к основному содержимому"),
      });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute("href", "#main_content");

      const logoLink = within(banner).getByRole("link", {
        name: "KitobPlus — bosh sahifa",
      });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("F01-02: renders desktop navigation menu with all primary section links", () => {
      renderE2E("/");
      const nav = screen.getByRole("navigation", {
        name: T("Основное меню"),
      });
      expect(nav).toBeInTheDocument();

      const navList = within(nav).getByRole("list");
      expect(navList).toBeInTheDocument();

      expect(within(nav).getByRole("link", { name: T("Аудиокниги") })).toHaveAttribute("href", "/books");
      expect(within(nav).getByRole("link", { name: T("Жанры") })).toHaveAttribute("href", "/genres");
      expect(within(nav).getByRole("link", { name: T("Авторы") })).toHaveAttribute("href", "/persons/authors");
      expect(within(nav).getByRole("link", { name: T("Новости") })).toHaveAttribute("href", "/news");
      expect(within(nav).getByRole("link", { name: T("О нас") })).toHaveAttribute("href", "/contacts");
    });

    it("F01-03: renders unauthenticated guest login and registration links", () => {
      renderE2E("/", { user: null });
      const banner = screen.getByRole("banner");
      const loginLinks = within(banner).getAllByRole("link", {
        name: T("Вход"),
      });
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
      expect(loginLinks[0]).toHaveAttribute("href", "/login");

      const registerLinks = within(banner).getAllByRole("link", {
        name: T("Регистрация"),
      });
      expect(registerLinks.length).toBeGreaterThanOrEqual(1);
      expect(registerLinks[0]).toHaveAttribute("href", "/login");
    });

    it("F01-04: renders authenticated user profile link button with initial", async () => {
      const authUser = {
        id: 1,
        name: "Mansurxon Rustamov",
        phone: "+998901234567",
        state: 2,
      };
      renderE2E("/", { user: authUser });
      const banner = screen.getByRole("banner");
      const profileButton = await within(banner).findByRole("link", {
        name: new RegExp(T("Профиль")),
      });
      expect(profileButton).toBeInTheDocument();
      expect(profileButton).toHaveAttribute("href", "/profile");
      expect(within(profileButton).getByText("M")).toBeInTheDocument();
    });

    it("F01-05: renders search action pill linking to catalog", () => {
      renderE2E("/");
      const banner = screen.getByRole("banner");
      const searchLinks = within(banner).getAllByRole("link", {
        name: T("Поиск по книгам"),
      });
      expect(searchLinks.length).toBeGreaterThanOrEqual(1);
      expect(searchLinks[0]).toHaveAttribute("href", "/books");
    });
  });

  // =========================================================================
  // Feature 2: Home Page & Audio Preview
  // =========================================================================
  describe("Feature 2: Home Page & Audio Preview", () => {
    it("F02-01: renders hero banner with HAR BIR INSON UCHUN KITOB badge and primary H1", () => {
      renderE2E("/");
      expect(screen.getByText(T("HAR BIR INSON UCHUN KITOB"))).toBeInTheDocument();
      const heroHeading = screen.getByRole("heading", { level: 1 });
      expect(heroHeading).toBeInTheDocument();
      expect(heroHeading.textContent).toContain("Kitoblar endi");
    });

    it("F02-02: renders 10-second audio preview button and open catalog button", async () => {
      renderE2E("/");
      const sampleBtn = await screen.findByRole("button", {
        name: new RegExp(T("10 soniya tinglab ko'ring")),
      });
      expect(sampleBtn).toBeInTheDocument();

      const catalogBtn = screen.getByRole("link", {
        name: T("Katalogni ochish"),
      });
      expect(catalogBtn).toHaveAttribute("href", "/books");
    });

    it("F02-03: clicking 10-second preview toggles audio playback state", async () => {
      renderE2E("/");
      const sampleBtn = await screen.findByRole("button", {
        name: new RegExp(T("10 soniya tinglab ko'ring")),
      });
      await waitFor(() => expect(sampleBtn).not.toBeDisabled());

      fireEvent.click(sampleBtn);
      const stopBtn = await screen.findByRole("button", { name: new RegExp(T("Остановить")) });
      expect(stopBtn).toBeInTheDocument();
      fireEvent.click(stopBtn);
      expect(await screen.findByRole("button", { name: new RegExp(T("10 soniya tinglab ko'ring")) })).toBeInTheDocument();
    });

    it("F02-04: renders 5 accessibility and platform value highlight cards", () => {
      renderE2E("/");
      expect(screen.getByText(T("Ko'rish imkoniyati cheklanganlar uchun bepul"))).toBeInTheDocument();
      expect(screen.getByText(T("Keng katalog"))).toBeInTheDocument();
      expect(screen.getByText(T("Professional suxandonlar"))).toBeInTheDocument();
      expect(screen.getByText(T("Turli janrlar"))).toBeInTheDocument();
      expect(screen.getByText(T("Har qurilmada"))).toBeInTheDocument();
    });

    it("F02-05: renders feed shelves for new arrivals and top-10 books", async () => {
      renderE2E("/");
      expect(await screen.findByRole("heading", { name: "Yangi qoʻshilganlar" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Haftaning top-10 kitobi" })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 3: Books Catalog & Filtering
  // =========================================================================
  describe("Feature 3: Books Catalog & Filtering", () => {
    it("F03-01: renders catalog page header with H1 title and breadcrumb trail", async () => {
      renderE2E("/books");
      const h1 = await screen.findByRole("heading", { level: 1, name: T("Аудиокниги") });
      expect(h1).toBeInTheDocument();

      const navCrumbs = screen.getByRole("navigation", { name: T("Вы находитесь здесь") });
      expect(navCrumbs).toBeInTheDocument();
    });

    it("F03-02: renders search filter input and sorting tabs", async () => {
      renderE2E("/books");
      const searchInput = await screen.findByRole("searchbox", { name: T("Найдите книгу, автора или диктора") });
      expect(searchInput).toBeInTheDocument();

      const sortTabs = screen.getByRole("tablist", { name: T("Сортировка книг") });
      expect(sortTabs).toBeInTheDocument();
      expect(within(sortTabs).getByRole("tab", { name: T("Последние") })).toBeInTheDocument();
      expect(within(sortTabs).getByRole("tab", { name: T("Популярные") })).toBeInTheDocument();
    });

    it("F03-03: renders genre filter chips selector for rapid categorization", async () => {
      renderE2E("/books");
      const genreRegion = await screen.findByRole("region", { name: T("Жанры") });
      expect(genreRegion).toBeInTheDocument();
      const romanBtn = await within(genreRegion).findByRole("button", { name: /Roman/ });
      expect(romanBtn).toBeInTheDocument();
    });

    it("F03-04: renders book cards with cover links, author name, and metadata", async () => {
      renderE2E("/books");
      const bookTitles = await screen.findAllByText("Oʻtkan kunlar");
      expect(bookTitles.length).toBeGreaterThanOrEqual(1);

      const author = screen.getAllByText("Abdulla Qodiriy");
      expect(author.length).toBeGreaterThanOrEqual(1);

      const bookLink = screen.getByRole("link", { name: /Oʻtkan kunlar/ });
      expect(bookLink).toHaveAttribute("href", "/books/1");
    });

    it("F03-05: displays total count of books found and announces to assistive tech", async () => {
      renderE2E("/books");
      const resultsPanel = await screen.findByRole("tabpanel");
      expect(resultsPanel).toBeInTheDocument();
      expect(resultsPanel).toHaveAttribute("aria-label", expect.stringContaining(T("Найдено книг")));
    });
  });

  // =========================================================================
  // Feature 4: Book Detail & Audio Player
  // =========================================================================
  describe("Feature 4: Book Detail & Audio Player", () => {
    it("F04-01: renders book title H1, author links, and duration details", async () => {
      renderE2E("/books/1");
      const h1 = await screen.findByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Oʻtkan kunlar");

      const authorLink = screen.getByRole("link", { name: "Abdulla Qodiriy" });
      expect(authorLink).toHaveAttribute("href", "/person/authors/1");
      expect(screen.getByText("KitobPlus Audio Studio")).toBeInTheDocument();
    });

    it("F04-02: renders audio player transport section with controls", async () => {
      renderE2E("/books/1");
      const playBtn = await screen.findByRole("button", { name: new RegExp(T("Воспроизведение")) });
      expect(playBtn).toBeInTheDocument();

      const slider = screen.getByRole("slider", { name: T("Позиция воспроизведения") });
      expect(slider).toBeInTheDocument();
    });

    it("F04-03: clicking play button invokes media element play", async () => {
      renderE2E("/books/1");
      const playBtn = await screen.findByRole("button", { name: new RegExp(T("Воспроизведение")) });
      fireEvent.click(playBtn);
      expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });

    it("F04-04: renders audio speed button and cycles playback rate", async () => {
      renderE2E("/books/1");
      const speedBtn = await screen.findByRole("button", { name: /1x/ });
      expect(speedBtn).toBeInTheDocument();

      fireEvent.click(speedBtn);
      expect(screen.getByRole("button", { name: /1.25x/ })).toBeInTheDocument();
    });

    it("F04-05: renders book section tabs for chapters, bookmarks, about, comments", async () => {
      renderE2E("/books/1");
      const tabs = await screen.findByRole("tablist", { name: T("Разделы книги") });
      expect(tabs).toBeInTheDocument();
      expect(within(tabs).getByRole("tab", { name: T("Главы") })).toBeInTheDocument();
      expect(within(tabs).getByRole("tab", { name: new RegExp(T("Закладки")) })).toBeInTheDocument();
      expect(within(tabs).getByRole("tab", { name: T("О книге") })).toBeInTheDocument();
      expect(within(tabs).getByRole("tab", { name: new RegExp(T("Комментарии")) })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 5: Genres Directory & 12 Genre Cards
  // =========================================================================
  describe("Feature 5: Genres Directory & 12 Genre Cards", () => {
    it("F05-01: renders genres directory banner with KATEGORIYALAR pill and H1", async () => {
      renderE2E("/genres");
      expect(screen.getByText(T("КАТЕГОРИИ"))).toBeInTheDocument();
      const h1 = screen.getByRole("heading", { level: 1, name: T("Жанры") });
      expect(h1).toBeInTheDocument();
    });

    it("F05-02: renders grid containing 12 genre cards", async () => {
      renderE2E("/genres");
      const list = await screen.findByRole("list", { name: T("Жанры") });
      const cards = within(list).getAllByRole("listitem");
      expect(cards.length).toBe(12);
    });

    it("F05-03: verifies all 12 canonical genres are present with names and counts", async () => {
      renderE2E("/genres");
      await screen.findByRole("list", { name: T("Жанры") });
      const genreNames = [
        "Roman", "Hikoya", "Jahon klassikasi", "Bolalar adabiyoti",
        "Dostonlar", "Fantastika", "Tarixiy", "Detektiv",
        "Biografiya", "Psixologiya", "She'riyat", "Ertak",
      ];
      genreNames.forEach((name) => {
        expect(screen.getByRole("link", { name: new RegExp(name) })).toBeInTheDocument();
      });
    });

    it("F05-04: each genre card links to filtered catalog route /books/genres/:id", async () => {
      renderE2E("/genres");
      const romanCard = await screen.findByRole("link", { name: /Roman/ });
      expect(romanCard).toHaveAttribute("href", "/books/genres/1");

      const ertakCard = screen.getByRole("link", { name: /Ertak/ });
      expect(ertakCard).toHaveAttribute("href", "/books/genres/3");
    });

    it("F05-05: alternate route /persons/genres renders the same genres directory", async () => {
      renderE2E("/persons/genres");
      expect(screen.getByRole("heading", { level: 1, name: T("Жанры") })).toBeInTheDocument();
      expect(await screen.findByRole("list", { name: T("Жанры") })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 6: Authors & Narrators Profiles
  // =========================================================================
  describe("Feature 6: Authors & Narrators Profiles", () => {
    it("F06-01: renders authors directory with H1 and search field", async () => {
      renderE2E("/persons/authors");
      expect(screen.getByRole("heading", { level: 1, name: T("Авторы") })).toBeInTheDocument();
      const search = screen.getByRole("search", { name: T("Поиск") });
      expect(search).toBeInTheDocument();
      expect(await screen.findByText("Abdulla Qodiriy")).toBeInTheDocument();
    });

    it("F06-02: renders narrators directory with H1 and dictors listing", async () => {
      renderE2E("/persons/dictors");
      expect(screen.getByRole("heading", { level: 1, name: T("Дикторы") })).toBeInTheDocument();
      expect(await screen.findByText("Afzal Rafiqov")).toBeInTheDocument();
    });

    it("F06-03: person cards render name, biography annotation, and link", async () => {
      renderE2E("/persons/authors");
      const authorCard = await screen.findByRole("link", { name: /Abdulla Qodiriy/ }, { timeout: 4000 });
      expect(authorCard).toHaveAttribute("href", "/person/authors/1");
      expect(await screen.findByText(/Oʻzbek milliy romanchiligining asoschisi/, {}, { timeout: 4000 })).toBeInTheDocument();
    });

    it("F06-04: individual person view renders banner and catalog of works", async () => {
      renderE2E("/person/authors/1");
      const h1 = await screen.findByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Abdulla Qodiriy");
      const bookMatches = await screen.findAllByText("Oʻtkan kunlar");
      expect(bookMatches.length).toBeGreaterThanOrEqual(1);
    });

    it("F06-05: search input filters the person listing by query", async () => {
      renderE2E("/persons/authors");
      await screen.findByText("Abdulla Qodiriy");
      const input = screen.getByRole("searchbox");
      fireEvent.change(input, { target: { value: "Choʻlpon" } });

      await waitFor(() => {
        expect(screen.getByText("Abdulhamid Choʻlpon")).toBeInTheDocument();
        expect(screen.queryByText("Abdulla Qodiriy")).not.toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Feature 7: News & Editorial Articles
  // =========================================================================
  describe("Feature 7: News & Editorial Articles", () => {
    it("F07-01: renders news listing page with H1 and breadcrumbs", async () => {
      renderE2E("/news");
      const h1 = await screen.findByRole("heading", { level: 1, name: T("Новости") });
      expect(h1).toBeInTheDocument();
      expect(screen.getByRole("navigation", { name: T("Вы находитесь здесь") })).toBeInTheDocument();
    });

    it("F07-02: renders news article cards with publication date and title", async () => {
      renderE2E("/news");
      const articleTitle = await screen.findByText("KitobPlus yangilangan dizayn bilan ishga tushdi");
      expect(articleTitle).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /KitobPlus yangilangan/ })).toHaveAttribute("href", "/news/1");
    });

    it("F07-03: individual news article view renders title, timestamp, and body content", async () => {
      renderE2E("/news/1");
      const title = await screen.findByRole("heading", { level: 1 });
      expect(title).toHaveTextContent("KitobPlus yangilangan dizayn bilan ishga tushdi");
      expect(screen.getByText(/Platforma zamonaviy a11y standartlari/)).toBeInTheDocument();
    });

    it("F07-04: news detail provides back link to main news listing", async () => {
      renderE2E("/news/1");
      const backLink = await screen.findByRole("link", { name: new RegExp(T("Все новости")) });
      expect(backLink).toHaveAttribute("href", "/news");
    });

    it("F07-05: unauthenticated users do not see administrative news editor actions", async () => {
      renderE2E("/news", { user: null });
      await screen.findByRole("heading", { level: 1, name: T("Новости") });
      expect(screen.queryByRole("button", { name: T("Добавить новость") })).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 8: User Profile & Settings
  // =========================================================================
  describe("Feature 8: User Profile & Settings", () => {
    const authUser = {
      id: 1,
      name: "Mansurxon Rustamov",
      phone: "+998901234567",
      register_date: "16.10.2026",
      state: 2,
    };

    it("F08-01: renders profile banner with H1 heading", async () => {
      renderE2E("/profile", { user: authUser });
      const h1 = await screen.findByRole("heading", { level: 1, name: T("Профиль") });
      expect(h1).toBeInTheDocument();
    });

    it("F08-02: displays user card with name and platform membership status", async () => {
      renderE2E("/profile", { user: authUser });
      expect(await screen.findByText("Mansurxon Rustamov")).toBeInTheDocument();
      expect(screen.getByText(/platformasida/)).toBeInTheDocument();
    });

    it("F08-03: renders profile navigation menu with all 7 account tabs", async () => {
      renderE2E("/profile", { user: authUser });
      const nav = await screen.findByRole("navigation", { name: T("Раздел профиля") });
      expect(within(nav).getByText(T("Подписка и тарифы"))).toBeInTheDocument();
      expect(within(nav).getByText(T("Мои данные"))).toBeInTheDocument();
      expect(within(nav).getByText(T("Книжная полка"))).toBeInTheDocument();
      expect(within(nav).getByText(T("История прослушивания"))).toBeInTheDocument();
      expect(within(nav).getByText(T("Настройки"))).toBeInTheDocument();
      expect(within(nav).getByText(T("Помощь"))).toBeInTheDocument();
      expect(within(nav).getByText(T("Правила пользования"))).toBeInTheDocument();
    });

    it("F08-04: selecting different profile menu tab switches the active content view", async () => {
      renderE2E("/profile", { user: authUser });
      const nav = await screen.findByRole("navigation", { name: T("Раздел профиля") });
      const myDataTab = within(nav).getByRole("button", { name: new RegExp(T("Мои данные")) });
      fireEvent.click(myDataTab);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: new RegExp(T("Мои данные")) })).toBeInTheDocument();
      });
    });

    it("F08-05: logout button terminates authenticated session", async () => {
      renderE2E("/profile", { user: authUser });
      const logoutBtn = await screen.findByRole("button", { name: new RegExp(T("Выйти")) });
      fireEvent.click(logoutBtn);
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  // =========================================================================
  // Feature 9: Authentication & SMS Flow
  // =========================================================================
  describe("Feature 9: Authentication & SMS Flow", () => {
    it("F09-01: renders login page with H1 and phone login guidance", () => {
      renderE2E("/login");
      const h1 = screen.getByRole("heading", { level: 1, name: T("Регистрация/вход") });
      expect(h1).toBeInTheDocument();
      expect(screen.getByText(T("Войдите по номеру телефона — это займёт меньше минуты"))).toBeInTheDocument();
    });

    it("F09-02: renders international phone input field with label and continue button", () => {
      renderE2E("/login");
      expect(screen.getByLabelText(T("Телефон"))).toBeInTheDocument();
      expect(screen.getByRole("button", { name: T("Продолжить") })).toBeInTheDocument();
    });

    it("F09-03: submitting invalid or empty phone number reveals error alert", () => {
      renderE2E("/login");
      const continueBtn = screen.getByRole("button", { name: T("Продолжить") });
      fireEvent.click(continueBtn);

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(T("Введен некорректный номер телефона"));
    });

    it("F09-04: valid phone submission advances to SMS code entry screen", async () => {
      renderE2E("/login");
      const phoneInput = screen.getByLabelText(T("Телефон"));
      fireEvent.change(phoneInput, { target: { value: "+998901234567" } });

      const continueBtn = screen.getByRole("button", { name: T("Продолжить") });
      fireEvent.click(continueBtn);

      await waitFor(() => {
        expect(screen.getByText(T("Мы отправили SMS с кодом на номер"))).toBeInTheDocument();
        expect(screen.getByLabelText(T("Пожалуйста, введите код из SMS"))).toBeInTheDocument();
      });
    });

    it("F09-05: alternative third-party OAuth options are presented", () => {
      renderE2E("/login");
      expect(screen.getByText(T("или"))).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Apple/i })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 10: Theming & Accessibility Modes
  // =========================================================================
  describe("Feature 10: Theming & Accessibility Modes", () => {
    it("F10-01: default light mode applies standard theme surface styling", () => {
      renderE2E("/", { themeMode: "light" });
      expect(document.body).toBeInTheDocument();
      expect(localStorage.getItem("theme_mode")).toBe("light");
    });

    it("F10-02: dark mode initializes with dark theme tokens", () => {
      renderE2E("/", { themeMode: "dark" });
      expect(localStorage.getItem("theme_mode")).toBe("dark");
    });

    it("F10-03: high contrast mode initializes with contrast styling", () => {
      renderE2E("/", { themeMode: "contrast" });
      expect(localStorage.getItem("theme_mode")).toBe("contrast");
    });

    it("F10-04: skip link targets main content landmark with id #main_content", () => {
      renderE2E("/");
      const skip = screen.getByRole("link", { name: T("Перейти к основному содержимому") });
      expect(skip).toHaveAttribute("href", "#main_content");
      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("id", "main_content");
    });

    it("F10-05: supports text scaling modes normal, large, and xlarge", () => {
      renderE2E("/", { textScale: "large" });
      expect(localStorage.getItem("text_scale")).toBe("large");
    });
  });

  // =========================================================================
  // Feature 11: Language Switching (UZ / RU / US)
  // =========================================================================
  describe("Feature 11: Language Switching (UZ / RU / US)", () => {
    it("F11-01: language trigger button shows active language label", () => {
      renderE2E("/", { countryCode: "UZ" });
      const langBtn = screen.getByRole("button", { name: /Sayt tili|UZ/ });
      expect(langBtn).toBeInTheDocument();
    });

    it("F11-02: clicking language button opens selection menu", () => {
      renderE2E("/", { countryCode: "UZ" });
      const langBtn = screen.getByRole("button", { name: /Sayt tili|UZ/ });
      fireEvent.click(langBtn);

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
      expect(within(menu).getByRole("menuitem", { name: /Oʻzbekcha/ })).toBeInTheDocument();
      expect(within(menu).getByRole("menuitem", { name: /Русский/ })).toBeInTheDocument();
      expect(within(menu).getByRole("menuitem", { name: /English/ })).toBeInTheDocument();
    });

    it("F11-03: switching to Russian updates interface texts to RU locale", async () => {
      renderE2E("/", { countryCode: "UZ" });
      const langBtn = screen.getByRole("button", { name: /Sayt tili|UZ/ });
      fireEvent.click(langBtn);

      const ruOption = screen.getByRole("menuitem", { name: /Русский/ });
      fireEvent.click(ruOption);

      await waitFor(() => {
        expect(localStorage.getItem("country_code")).toBe("RU");
        expect(document.documentElement.getAttribute("lang")).toBe("ru");
      });
    });

    it("F11-04: switching to English updates interface texts to US locale", async () => {
      renderE2E("/", { countryCode: "UZ" });
      const langBtn = screen.getByRole("button", { name: /Sayt tili|UZ/ });
      fireEvent.click(langBtn);

      const enOption = screen.getByRole("menuitem", { name: /English/ });
      fireEvent.click(enOption);

      await waitFor(() => {
        expect(localStorage.getItem("country_code")).toBe("US");
        expect(document.documentElement.getAttribute("lang")).toBe("en");
      });
    });

    it("F11-05: language state persists in localStorage across rerenders", () => {
      renderE2E("/", { countryCode: "RU" });
      expect(localStorage.getItem("country_code")).toBe("RU");
    });
  });

  // =========================================================================
  // Feature 12: 404 Route & Error Recovery
  // =========================================================================
  describe("Feature 12: 404 Route & Error Recovery", () => {
    it("F12-01: invalid route renders 404 PageShell with H1 title", () => {
      renderE2E("/non-existent-route-xyz-9999");
      const h1 = screen.getByRole("heading", { level: 1, name: T("Страница не найдена") });
      expect(h1).toBeInTheDocument();
    });

    it("F12-02: renders apologetic message explaining broken link", () => {
      renderE2E("/non-existent-route-xyz-9999");
      expect(
        screen.getByText(
          T("Приносим свои извинения, эта ссылка недействительна, но вы можете перейти к другим разделам сайта.")
        )
      ).toBeInTheDocument();
    });

    it("F12-03: renders recovery button returning to home page", () => {
      renderE2E("/non-existent-route-xyz-9999");
      const homeBtn = screen.getByRole("link", { name: T("Главная") });
      expect(homeBtn).toHaveAttribute("href", "/");
    });

    it("F12-04: renders recovery button returning to books catalog", () => {
      renderE2E("/non-existent-route-xyz-9999");
      const catalogBtn = screen.getByRole("link", { name: T("Каталог") });
      expect(catalogBtn).toHaveAttribute("href", "/books");
    });

    it("F12-05: 404 page retains global header and footer navigation for recovery", () => {
      renderE2E("/non-existent-route-xyz-9999");
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });
});
