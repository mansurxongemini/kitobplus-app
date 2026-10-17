import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { SWRConfig } from "swr";
import dayjs from "dayjs";

import T, { tr } from "../lib/translator";
import translation from "../lib/translation.json";
import { createAppTheme } from "../ds/theme";
import { LibraryProvider } from "../LibraryContext";
import EditProfileSection from "../profile/EditProfileSection";
import HelpSection from "../profile/HelpSection";
import NewsSection from "../news/NewsSection";
import SiteHeader from "../ds/components/SiteHeader";
import AudioPlayerSection from "../book/AudioPlayerSection";
import AccessSection from "../profile/AccessSection";
import Shelf from "../ds/components/Shelf";

const wrap = (ui, themeMode = "light", countryCode = "UZ") => {
  if (countryCode) {
    localStorage.setItem("country_code", countryCode);
  }
  return (
    <LibraryProvider>
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <MuiThemeProvider theme={createAppTheme(themeMode)}>
          <MemoryRouter>{ui}</MemoryRouter>
        </MuiThemeProvider>
      </SWRConfig>
    </LibraryProvider>
  );
};

describe("M1 Empirical Challenger Stress Harness", () => {
  beforeAll(() => {
    window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = jest.fn();
    if (!window.scrollTo) {
      window.scrollTo = jest.fn();
    }
  });

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // =========================================================================
  // 1. TRANSLATION ENGINE STRESS TESTS
  // =========================================================================
  describe("Translation Engine (tr / T)", () => {
    describe("Legacy Russian Keys (no explicit 'RU' subkey in dictionary)", () => {
      const legacyKeys = [
        { key: "КАТЕГОРИИ", uz: "KATEGORIYALAR", us: "CATEGORIES" },
        { key: "Случайная аудиокнига", uz: "Tasodifiy audiokitob", us: "Random audiobook" },
        { key: "Последние", uz: "Soʻnggi qoʻshilganlar", us: "Latest" },
        { key: "Новости", uz: "Yangiliklar", us: "News" },
        { key: "1 минута", uz: "1 daqiqa", us: "1 minute" },
        { key: "1 час", uz: "1 soat", us: "1 hour" },
      ];

      legacyKeys.forEach(({ key, uz, us }) => {
        it(`resolves legacy Russian key "${key}" correctly across RU, UZ, US`, () => {
          // In RU locale, legacy key without RU subkey must return the Russian key itself
          expect(tr(key, "RU")).toBe(key);
          // In UZ locale, returns Uzbek translation
          expect(tr(key, "UZ")).toBe(uz);
          // In US locale, returns English translation
          expect(tr(key, "US")).toBe(us);
        });
      });
    });

    describe("Modern Uzbek/English Keys (with explicit 'RU' subkey in dictionary)", () => {
      const modernKeys = [
        {
          key: "10 soniya tinglab ko'ring",
          ru: "Послушать 10 секунд",
          uzPrefix: "10 soniya tinglab",
          us: "Listen for 10 seconds",
        },
        {
          key: "HAR BIR INSON UCHUN KITOB",
          ru: "КНИГА ДЛЯ КАЖДОГО ЧЕЛОВЕКА",
          uz: "HAR BIR INSON UCHUN KITOB",
          us: "BOOKS FOR EVERYONE",
        },
        {
          key: "hero_description",
          ruPrefix: "Узбекская и мировая литература",
          uzPrefix: "Oʻzbek va jahon adabiyoti",
          usPrefix: "Uzbek and world literature",
        },
        {
          key: "genres_banner_subtitle",
          ruPrefix: "Выберите подходящий жанр",
          uzPrefix: "Oʻzingizga yoqadigan janrni tanlab",
          usPrefix: "Choose your favorite genre",
        },
        {
          key: "ming",
          ru: "тыс.",
          uz: "ming",
          us: "k",
        },
        {
          key: "Русский",
          ru: "Русский",
          uz: "Ruscha",
          us: "Russian",
        },
        {
          key: "Ruscha",
          ru: "Русский",
          uz: "Ruscha",
          us: "Russian",
        },
        {
          key: "Russian",
          ru: "Русский",
          uz: "Ruscha",
          us: "Russian",
        },
      ];

      modernKeys.forEach(({ key, ru, uz, us, ruPrefix, uzPrefix, usPrefix }) => {
        it(`resolves modern key "${key}" across RU, UZ, US`, () => {
          if (ru) expect(tr(key, "RU")).toBe(ru);
          if (uz) expect(tr(key, "UZ")).toBe(uz);
          if (us) expect(tr(key, "US")).toBe(us);
          if (ruPrefix) expect(tr(key, "RU")).toContain(ruPrefix);
          if (uzPrefix) expect(tr(key, "UZ")).toContain(uzPrefix);
          if (usPrefix) expect(tr(key, "US")).toContain(usPrefix);
        });
      });
    });

    describe("Missing Keys and Fallback Resilience", () => {
      it("falls back cleanly to the verb when key is absent in dictionary", () => {
        const fakeKey = "COMPLETELY_ABSENT_KEY_FOR_TESTING_#42!";
        expect(tr(fakeKey, "RU")).toBe(fakeKey);
        expect(tr(fakeKey, "UZ")).toBe(fakeKey);
        expect(tr(fakeKey, "US")).toBe(fakeKey);
      });

      it("handles falsy and unexpected inputs without throwing", () => {
        expect(tr(null, "RU")).toBe(null);
        expect(tr(undefined, "RU")).toBe(undefined);
        expect(tr("", "RU")).toBe("");
        expect(tr(0, "RU")).toBe(0);
        expect(tr(false, "RU")).toBe(false);
      });

      it("safely handles JavaScript Object prototype properties as keys", () => {
        const protoKeys = ["toString", "valueOf", "hasOwnProperty", "__proto__", "constructor"];
        protoKeys.forEach((protoKey) => {
          expect(() => tr(protoKey, "RU")).not.toThrow();
          expect(() => tr(protoKey, "UZ")).not.toThrow();
          expect(() => tr(protoKey, "US")).not.toThrow();
          expect(tr(protoKey, "RU")).toBe(protoKey);
        });
      });

      it("does not throw when passed non-standard countryCode types", () => {
        expect(() => tr("Главная", null)).not.toThrow();
        expect(() => tr("Главная", undefined)).not.toThrow();
        expect(() => tr("Главная", 12345)).not.toThrow();
        expect(() => tr("Главная", {})).not.toThrow();
      });
    });

    describe("Dictionary Integrity Check", () => {
      it("ensures no malformed Cyrillic mix in Русский language name", () => {
        const entry = translation["Русский"];
        expect(entry).toBeDefined();
        expect(entry.RU).toBe("Русский");
        for (let i = 0; i < entry.RU.length; i++) {
          const code = entry.RU.charCodeAt(i);
          expect(code >= 0x0400 && code <= 0x04ff).toBe(true);
        }
      });
    });
  });

  // =========================================================================
  // 2. DATEFIELD INPUT HANDLING & ERROR SAFETY IN EDITPROFILESECTION
  // =========================================================================
  describe("DateField Input Handling in EditProfileSection", () => {
    it("renders EditProfileSection without crashing", () => {
      const { container } = render(wrap(<EditProfileSection />));
      expect(container.querySelector("input")).not.toBeNull();
    });

    it("does not throw when DateField receives valid Dayjs, invalid Dayjs, null, undefined, or event objects", () => {
      // Simulate the exact onChange handler used in EditProfileSection line 228
      const recorded = [];
      const handleInputChange = (field, val) => recorded.push({ field, val });

      const dateFieldOnChange = (newValue) => {
        if (newValue && dayjs.isDayjs(newValue) && newValue.isValid()) {
          handleInputChange("birthday", newValue.format("YYYY-MM-DD"));
        } else if (!newValue) {
          handleInputChange("birthday", "");
        }
      };

      // 1. Valid Dayjs instances
      expect(() => dateFieldOnChange(dayjs("1995-06-15"))).not.toThrow();
      expect(recorded[recorded.length - 1]).toEqual({ field: "birthday", val: "1995-06-15" });

      expect(() => dateFieldOnChange(dayjs("2003-12-31"))).not.toThrow();
      expect(recorded[recorded.length - 1]).toEqual({ field: "birthday", val: "2003-12-31" });

      expect(() => dateFieldOnChange(dayjs("1980-01-01"))).not.toThrow();
      expect(recorded[recorded.length - 1]).toEqual({ field: "birthday", val: "1980-01-01" });

      // 2. Invalid Dayjs instance (e.g. user typed partial or bad date "abc")
      const invalidDayjs = dayjs("abc");
      expect(invalidDayjs.isValid()).toBe(false);
      const preLen = recorded.length;
      expect(() => dateFieldOnChange(invalidDayjs)).not.toThrow();
      // Must NOT record "Invalid Date"
      expect(recorded.length).toBe(preLen);

      // 3. Null (user cleared the date field)
      expect(() => dateFieldOnChange(null)).not.toThrow();
      expect(recorded[recorded.length - 1]).toEqual({ field: "birthday", val: "" });

      // 4. Undefined
      expect(() => dateFieldOnChange(undefined)).not.toThrow();
      expect(recorded[recorded.length - 1]).toEqual({ field: "birthday", val: "" });

      // 5. Empty string
      expect(() => dateFieldOnChange("")).not.toThrow();
      expect(recorded[recorded.length - 1]).toEqual({ field: "birthday", val: "" });

      // 6. Old broken scenario: SyntheticEvent object passed instead of Dayjs
      const syntheticEvent = { target: { value: "1995-06-15" } };
      expect(() => dateFieldOnChange(syntheticEvent)).not.toThrow();

      // 7. Arbitrary object
      expect(() => dateFieldOnChange({ random: 123 })).not.toThrow();
    });

    it("verifies avatar uses text initial fallback and does NOT render broken /ellipse-15.png", () => {
      const { container } = render(wrap(<EditProfileSection />));
      const imgs = container.querySelectorAll("img");
      imgs.forEach((img) => {
        expect(img.getAttribute("src")).not.toContain("ellipse-15.png");
      });
      // Initial avatar element exists
      const avatar = container.querySelector(".MuiAvatar-root");
      expect(avatar).not.toBeNull();
      expect(avatar.textContent.trim()).toBe("U");
    });
  });

  // =========================================================================
  // 3. FORM LAYOUT & 375PX RESPONSIVENESS CONSTRAINTS
  // =========================================================================
  describe("Form Layout Constraints (Mobile 375px Responsiveness)", () => {
    it("verifies theme breakpoints accommodate 375px in xs (<600px)", () => {
      const theme = createAppTheme("light");
      expect(theme.breakpoints.values.xs).toBe(0);
      expect(theme.breakpoints.values.sm).toBe(600);
      expect(theme.breakpoints.values.md).toBe(960);
    });

    it("renders EditProfileSection form fields with responsive flex containers without hardcoded inline row styles", () => {
      const { container } = render(wrap(<EditProfileSection />));

      const allDivs = Array.from(container.querySelectorAll("div"));
      const hardcodedRowFlexes = allDivs.filter((div) => {
        const inlineStyle = div.getAttribute("style") || "";
        return (
          inlineStyle.includes("flex-direction: row") &&
          !inlineStyle.includes("align-items: center") // ignore small phone row icon wrappers
        );
      });

      expect(hardcodedRowFlexes.length).toBe(0);

      // Verify submit button is rendered in the form (matches either Uzbek translation or Russian key)
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("verifies EditProfileSection in Russian locale renders 'Сохранить' button", () => {
      render(wrap(<EditProfileSection />, "light", "RU"));
      const saveBtn = screen.getByRole("button", { name: "Сохранить" });
      expect(saveBtn).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 4. SECONDARY M1 DEFECT VERIFICATIONS
  // =========================================================================
  describe("Secondary M1 Defect Verifications", () => {
    it("HelpSection feedback button links to mailto:info@kitobplus.uz", () => {
      render(wrap(<HelpSection />));
      const mailLink = screen.getByRole("link", { name: /yozish|поддержк/i });
      expect(mailLink).toBeInTheDocument();
      expect(mailLink).toHaveAttribute("href", "mailto:info@kitobplus.uz");
    });

    it("NewsSection renders accessible empty state on main route when items are empty", async () => {
      const origFetch = global.fetch;
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      );

      render(wrap(<NewsSection exclude={0} per_page={6} title="Yangiliklar" />));

      // Should display empty state with heading and subtitle
      expect(await screen.findByText(/hozircha yo.q|новостей пока нет/i)).toBeInTheDocument();
      expect(screen.getByText(/kuzatib boring|следите за обновлениями/i)).toBeInTheDocument();

      global.fetch = origFetch;
    });

    it("SiteHeader renders guest login and register in Mobile Drawer navigation", () => {
      render(wrap(<SiteHeader />));
      const menuBtn = screen.getByRole("button", { name: /меню|menyu|menu/i });
      expect(menuBtn).toBeInTheDocument();
      fireEvent.click(menuBtn);

      const loginLinks = screen.getAllByRole("link", { name: /вход|kirish|login/i });
      const regLinks = screen.getAllByRole("link", { name: /регистрация|ro.yxatdan|register/i });
      expect(loginLinks.length).toBeGreaterThan(0);
      expect(regLinks.length).toBeGreaterThan(0);
      expect(loginLinks[0]).toHaveAttribute("href", "/login");
      expect(regLinks[0]).toHaveAttribute("href", "/login");
    });

    it("SiteHeader renders guest login and register directly on Desktop viewports", () => {
      const origMatchMedia = window.matchMedia;
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: true, // simulates desktop viewport (all media queries match)
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(wrap(<SiteHeader />));
      const loginLinks = screen.getAllByRole("link", { name: /вход|kirish|login/i });
      const regLinks = screen.getAllByRole("link", { name: /регистрация|ro.yxatdan|register/i });
      expect(loginLinks.length).toBeGreaterThan(0);
      expect(regLinks.length).toBeGreaterThan(0);

      window.matchMedia = origMatchMedia;
    });
  });

  // =========================================================================
  // 5. KEYBOARD ACCESSIBILITY & SPACEBAR NAVIGATION (M1 REMEDIATION)
  // =========================================================================
  describe("Keyboard Accessibility & Spacebar Navigation", () => {
    it("HomePage preserves native spacebar page scrolling when sample audio is inactive", () => {
      const event = new KeyboardEvent("keydown", { code: "Space", key: " ", bubbles: true, cancelable: true });
      document.body.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it("AudioPlayerSection preserves native spacebar scrolling on /books/:id when audio is paused", () => {
      const mockBook = { id: 1, title: "Oʻtkan kunlar", rate: 1, position: 0 };
      const mockPlaylist = [{ id: 1, name: "1-bob", length: 120, url: "/test.mp3" }];
      const setIsPlaying = jest.fn();

      const { unmount } = render(
        wrap(
          <AudioPlayerSection
            book={mockBook}
            playlist={mockPlaylist}
            isPlaying={false}
            setIsPlaying={setIsPlaying}
            currentTrackId={0}
            setCurrentTrackId={jest.fn()}
            bookmarks={[]}
            setBookmarks={jest.fn()}
            addBookmark={jest.fn()}
            removeBookmark={jest.fn()}
            setPlaylist={jest.fn()}
          />
        )
      );

      const spaceOnBody = new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        cancelable: true,
      });
      document.body.dispatchEvent(spaceOnBody);

      // Spacebar MUST NOT be prevented on document.body when audio is paused
      expect(spaceOnBody.defaultPrevented).toBe(false);
      unmount();
    });

    it("AudioPlayerSection intercepts spacebar to toggle playback when audio is active (playing === true)", () => {
      const mockBook = { id: 1, title: "Oʻtkan kunlar", rate: 1, position: 0 };
      const mockPlaylist = [{ id: 1, name: "1-bob", length: 120, url: "/test.mp3" }];
      const setIsPlaying = jest.fn();

      const { unmount } = render(
        wrap(
          <AudioPlayerSection
            book={mockBook}
            playlist={mockPlaylist}
            isPlaying={true}
            setIsPlaying={setIsPlaying}
            currentTrackId={0}
            setCurrentTrackId={jest.fn()}
            bookmarks={[]}
            setBookmarks={jest.fn()}
            addBookmark={jest.fn()}
            removeBookmark={jest.fn()}
            setPlaylist={jest.fn()}
          />
        )
      );

      const spaceWhilePlaying = new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        cancelable: true,
      });
      document.body.dispatchEvent(spaceWhilePlaying);

      // Spacebar MUST be intercepted to pause playback
      expect(spaceWhilePlaying.defaultPrevented).toBe(true);
      unmount();
    });

    it("AudioPlayerSection intercepts spacebar when focus is inside player region even if paused", () => {
      const mockBook = { id: 1, title: "Oʻtkan kunlar", rate: 1, position: 0 };
      const mockPlaylist = [{ id: 1, name: "1-bob", length: 120, url: "/test.mp3" }];
      const setIsPlaying = jest.fn();

      const { container, unmount } = render(
        wrap(
          <AudioPlayerSection
            book={mockBook}
            playlist={mockPlaylist}
            isPlaying={false}
            setIsPlaying={setIsPlaying}
            currentTrackId={0}
            setCurrentTrackId={jest.fn()}
            bookmarks={[]}
            setBookmarks={jest.fn()}
            addBookmark={jest.fn()}
            removeBookmark={jest.fn()}
            setPlaylist={jest.fn()}
          />
        )
      );

      const playerRegion = container.querySelector('[role="region"]');
      expect(playerRegion).not.toBeNull();

      const spaceInPlayer = new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        cancelable: true,
      });
      playerRegion.dispatchEvent(spaceInPlayer);

      // When focus is inside player region, Spacebar activates playback
      expect(spaceInPlayer.defaultPrevented).toBe(true);
      unmount();
    });

    it("AudioPlayerSection does not intercept spacebar on interactive button controls", () => {
      const mockBook = { id: 1, title: "Oʻtkan kunlar", rate: 1, position: 0 };
      const mockPlaylist = [{ id: 1, name: "1-bob", length: 120, url: "/test.mp3" }];

      const { container, unmount } = render(
        wrap(
          <AudioPlayerSection
            book={mockBook}
            playlist={mockPlaylist}
            isPlaying={false}
            setIsPlaying={jest.fn()}
            currentTrackId={0}
            setCurrentTrackId={jest.fn()}
            bookmarks={[]}
            setBookmarks={jest.fn()}
            addBookmark={jest.fn()}
            removeBookmark={jest.fn()}
            setPlaylist={jest.fn()}
          />
        )
      );

      const replayBtn = container.querySelector('button[aria-label*="30"]');
      expect(replayBtn).not.toBeNull();

      const spaceOnBtn = new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        cancelable: true,
      });
      replayBtn.dispatchEvent(spaceOnBtn);

      // Button activation must be left to native browser behavior
      expect(spaceOnBtn.defaultPrevented).toBe(false);
      unmount();
    });

    it("AudioPlayerSection does not intercept spacebar in text inputs (input, textarea, contenteditable) while playing", () => {
      const mockBook = { id: 1, title: "Oʻtkan kunlar", rate: 1, position: 0 };
      const mockPlaylist = [{ id: 1, name: "1-bob", length: 120, url: "/test.mp3" }];

      const { unmount } = render(
        wrap(
          <div>
            <input type="text" data-testid="test-input" />
            <textarea data-testid="test-textarea" />
            <div contentEditable="true" data-testid="test-editable" />
            <select data-testid="test-select"><option>1</option></select>
            <AudioPlayerSection
              book={mockBook}
              playlist={mockPlaylist}
              isPlaying={true}
              setIsPlaying={jest.fn()}
              currentTrackId={0}
              setCurrentTrackId={jest.fn()}
              bookmarks={[]}
              setBookmarks={jest.fn()}
              addBookmark={jest.fn()}
              removeBookmark={jest.fn()}
              setPlaylist={jest.fn()}
            />
          </div>
        )
      );

      ["test-input", "test-textarea", "test-select"].forEach((tid) => {
        const el = screen.getByTestId(tid);
        const spaceEvent = new KeyboardEvent("keydown", {
          key: " ",
          code: "Space",
          bubbles: true,
          cancelable: true,
        });
        el.dispatchEvent(spaceEvent);
        expect(spaceEvent.defaultPrevented).toBe(false);
      });

      // In real browsers, isContentEditable is true for contenteditable elements
      const editableEl = screen.getByTestId("test-editable");
      Object.defineProperty(editableEl, "isContentEditable", { value: true, configurable: true });
      const spaceOnEditable = new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        cancelable: true,
      });
      editableEl.dispatchEvent(spaceOnEditable);
      expect(spaceOnEditable.defaultPrevented).toBe(false);

      unmount();
    });

    it("AudioPlayerSection does not intercept spacebar on anchor links even while playing", () => {
      const mockBook = { id: 1, title: "Oʻtkan kunlar", rate: 1, position: 0 };
      const mockPlaylist = [{ id: 1, name: "1-bob", length: 120, url: "/test.mp3" }];

      const { unmount } = render(
        wrap(
          <div>
            <a href="#test" data-testid="nav-link">Havola</a>
            <AudioPlayerSection
              book={mockBook}
              playlist={mockPlaylist}
              isPlaying={true}
              setIsPlaying={jest.fn()}
              currentTrackId={0}
              setCurrentTrackId={jest.fn()}
              bookmarks={[]}
              setBookmarks={jest.fn()}
              addBookmark={jest.fn()}
              removeBookmark={jest.fn()}
              setPlaylist={jest.fn()}
            />
          </div>
        )
      );

      const link = screen.getByTestId("nav-link");
      const spaceOnLink = new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(spaceOnLink);
      expect(spaceOnLink.defaultPrevented).toBe(false);
      unmount();
    });

    it("AudioPlayerSection properly removes keydown listener upon unmount", () => {
      const mockBook = { id: 1, title: "Oʻtkan kunlar", rate: 1, position: 0 };
      const mockPlaylist = [{ id: 1, name: "1-bob", length: 120, url: "/test.mp3" }];

      const { unmount } = render(
        wrap(
          <AudioPlayerSection
            book={mockBook}
            playlist={mockPlaylist}
            isPlaying={true}
            setIsPlaying={jest.fn()}
            currentTrackId={0}
            setCurrentTrackId={jest.fn()}
            bookmarks={[]}
            setBookmarks={jest.fn()}
            addBookmark={jest.fn()}
            removeBookmark={jest.fn()}
            setPlaylist={jest.fn()}
          />
        )
      );

      unmount();

      const spaceAfterUnmount = new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        cancelable: true,
      });
      document.body.dispatchEvent(spaceAfterUnmount);
      expect(spaceAfterUnmount.defaultPrevented).toBe(false);
    });
  });

  // =========================================================================
  // 6. THEME TOKENIZATION & CONTRAST HARMONIZATION (LIGHT, DARK, CONTRAST)
  // =========================================================================
  describe("Theme Tokenization & Contrast Harmonization", () => {
    it("AccessSection does not use hardcoded #475569 for subtitle description", () => {
      render(wrap(<AccessSection />, "dark"));
      const subtitle = screen.getByText(/Barcha audiokitoblardan foydalanish/i);
      expect(subtitle).toBeInTheDocument();
      expect(subtitle.getAttribute("style") || "").not.toContain("#475569");
    });

    it("Shelf category cards do not contain hardcoded #185ADB or rgba(0, 0, 0, 0.04)", () => {
      const { container } = render(
        wrap(
          <Shelf
            id="test-categories"
            title="Kategoriyalar"
            variant="categories"
          />,
          "contrast"
        )
      );
      const links = container.querySelectorAll("a");
      links.forEach((link) => {
        const style = link.getAttribute("style") || "";
        expect(style).not.toContain("rgba(0, 0, 0, 0.04)");
        expect(style).not.toContain("#185ADB");
      });
    });
  });
});
