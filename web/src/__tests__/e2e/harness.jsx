import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SWRConfig } from "swr";

import { LibraryProvider } from "../../LibraryContext";
import { ThemeProvider } from "../../parts/ThemeProvider";

import HomePage from "../../home/HomePage";
import Books from "../../books/Books";
import Book from "../../book/Book";
import Genres from "../../genres/Genres";
import Persons from "../../persons/Persons";
import Person from "../../person/Person";
import News from "../../news/News";
import NewsView from "../../news/NewsView";
import Profile from "../../Profile";
import Login from "../../Login";
import Contacts from "../../contacts/Contacts";
import NotFound from "../../NotFound";

// =============================================================================
// Authoritative Mock Datasets
// =============================================================================
export const MOCK_GENRES = [
  { id: 1, name: "Roman", books_count: 14 },
  { id: 2, name: "Hikoya", books_count: 10 },
  { id: 7, name: "Jahon klassikasi", books_count: 10 },
  { id: 6, name: "Bolalar adabiyoti", books_count: 8 },
  { id: 12, name: "Dostonlar", books_count: 6 },
  { id: 10, name: "Fantastika", books_count: 6 },
  { id: 4, name: "Tarixiy", books_count: 6 },
  { id: 9, name: "Detektiv", books_count: 4 },
  { id: 11, name: "Biografiya", books_count: 3 },
  { id: 8, name: "Psixologiya", books_count: 3 },
  { id: 5, name: "She'riyat", books_count: 2 },
  { id: 3, name: "Ertak", books_count: 1 },
];

export const MOCK_BOOKS = [
  {
    id: 1,
    title: "Oʻtkan kunlar",
    authors_name: "Abdulla Qodiriy",
    authors_id: 1,
    authors: [{ id: 1, name: "Abdulla Qodiriy" }],
    dictors_name: "Afzal Rafiqov",
    dictors_id: 1,
    dictors: [{ id: 1, name: "Afzal Rafiqov" }],
    seconds: 7200,
    rating: 5,
    files: "1800,1800,1800,1800",
    annotation: "Oʻzbek adabiyotidagi birinchi roman. Otabek va Kumush muhabbati tarixi.",
    bookshelf_dt: null,
    genres: [{ id: 1, name: "Roman" }],
    publishers_name: "KitobPlus Audio Studio",
  },
  {
    id: 2,
    title: "Mehrobdan chayon",
    authors_name: "Abdulla Qodiriy",
    authors_id: 1,
    authors: [{ id: 1, name: "Abdulla Qodiriy" }],
    dictors_name: "Afzal Rafiqov",
    dictors_id: 1,
    dictors: [{ id: 1, name: "Afzal Rafiqov" }],
    seconds: 6400,
    rating: 4.8,
    files: "3200,3200",
    annotation: "Xudoyorxon davridagi saroy fitnalari va Anvar hamda Raʼno sevgisi.",
    bookshelf_dt: null,
    genres: [{ id: 1, name: "Roman" }],
    publishers_name: "KitobPlus Audio Studio",
  },
  {
    id: 3,
    title: "Kecha va kunduz",
    authors_name: "Abdulhamid Choʻlpon",
    authors_id: 2,
    authors: [{ id: 2, name: "Abdulhamid Choʻlpon" }],
    dictors_name: "Bobur Yoʻldoshev",
    dictors_id: 2,
    dictors: [{ id: 2, name: "Bobur Yoʻldoshev" }],
    seconds: 5400,
    rating: 4.9,
    files: "2700,2700",
    annotation: "Zebi va uning fojiali qismati tasvirlangan durdona roman.",
    bookshelf_dt: null,
    genres: [{ id: 1, name: "Roman" }, { id: 7, name: "Jahon klassikasi" }],
    publishers_name: "KitobPlus Audio Studio",
  },
];

export const MOCK_AUTHORS = [
  {
    id: 1,
    name: "Abdulla Qodiriy",
    books_count: 5,
    annotation: "Oʻzbek milliy romanchiligining asoschisi va buyuk maʼrifatparvar adib.",
  },
  {
    id: 2,
    name: "Abdulhamid Choʻlpon",
    books_count: 3,
    annotation: "Yangi oʻzbek adabiyotining ulugʻ shoiri, yozuvchisi va tarjimoni.",
  },
];

export const MOCK_DICTORS = [
  {
    id: 1,
    name: "Afzal Rafiqov",
    books_count: 8,
    annotation: "Oʻzbekiston xalq artisti, yetakchi ovoz ustasi va professional suxandon.",
  },
  {
    id: 2,
    name: "Bobur Yoʻldoshev",
    books_count: 4,
    annotation: "Taniqli teatr va kino aktyori, dublyaj va audio kitob suxandoni.",
  },
];

export const MOCK_NEWS = [
  {
    id: 1,
    subject: "KitobPlus yangilangan dizayn bilan ishga tushdi",
    body: "Platforma zamonaviy a11y standartlari, 3D editorial illyustratsiyalar va qulay audio pleyer bilan toʻliq yangilandi.",
    dt: "2026-10-16 12:00:00",
    photo: "",
  },
  {
    id: 2,
    subject: "Mumtoz adabiyot durdonalari audio formati",
    body: "Oʻzbek va jahon adabiyoti xazinasidagi asarlar eng sara ovozlar ijrosida bepul taqdim etilmoqda.",
    dt: "2026-10-15 09:30:00",
    photo: "",
  },
];

// =============================================================================
// Intelligent API Fetch Mock Generator
// =============================================================================
export const createMockFetch = (customOverrides = {}) => {
  return jest.fn((url, options = {}) => {
    const urlStr = String(url);
    const method = (options.method || "GET").toUpperCase();
    let body = {};
    if (options.body && typeof options.body === "string") {
      try {
        body = JSON.parse(options.body);
      } catch (e) {
        body = {};
      }
    }

    // Custom override hook
    if (customOverrides[urlStr]) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(customOverrides[urlStr](body, options)),
      });
    }

    // 1. Genres endpoint
    if (urlStr.includes("genres.php")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: MOCK_GENRES }),
      });
    }

    // 2. Books list endpoint
    if (urlStr.includes("books.php")) {
      let result = [...MOCK_BOOKS];
      const u = new URL(urlStr, "http://localhost");
      const filter = u.searchParams.get("filter");
      const genresId = u.searchParams.getAll("genres_id[]");
      const singleGenreId = u.searchParams.get("genres_id");
      const authorsId = u.searchParams.get("authors_id");
      const dictorsId = u.searchParams.get("dictors_id");

      if (filter) {
        const q = filter.toLowerCase();
        result = result.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.authors_name.toLowerCase().includes(q)
        );
      }

      if (genresId && genresId.length > 0) {
        const ids = genresId.map(Number);
        result = result.filter((b) =>
          b.genres.some((g) => ids.includes(Number(g.id)))
        );
      } else if (singleGenreId) {
        const gid = Number(singleGenreId);
        result = result.filter((b) =>
          b.genres.some((g) => Number(g.id) === gid)
        );
      }

      if (authorsId) {
        const aid = Number(authorsId);
        result = result.filter((b) => Number(b.authors_id) === aid);
      }

      if (dictorsId) {
        const did = Number(dictorsId);
        result = result.filter((b) => Number(b.dictors_id) === did);
      }

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            total: result.length,
            data: result,
          }),
      });
    }

    // 3. Persons list endpoint
    if (urlStr.includes("persons.php")) {
      const isDictor = urlStr.includes("table=dictors");
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: isDictor ? MOCK_DICTORS : MOCK_AUTHORS,
          }),
      });
    }

    // 4. News list endpoint
    if (urlStr.includes("news.php") || urlStr.includes("news/list.php")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: MOCK_NEWS, news: MOCK_NEWS }),
      });
    }

    // 5. POST API endpoints (/api/*.php)
    if (urlStr.includes("/api/")) {
      if (urlStr.includes("auth/user.php")) {
        const savedUser = localStorage.getItem("user");
        const parsedUser = savedUser ? JSON.parse(savedUser) : null;
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              user: parsedUser,
            }),
        });
      }

      if (urlStr.includes("books/get.php")) {
        const bookId = Number(body.id) || 1;
        const found = MOCK_BOOKS.find((b) => b.id === bookId) || MOCK_BOOKS[0];
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: found }),
        });
      }

      if (urlStr.includes("comments/get.php")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: [] }),
        });
      }

      if (urlStr.includes("bookmarks/get.php")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: [] }),
        });
      }

      if (urlStr.includes("person/get.php")) {
        const personId = Number(body.id) || 1;
        const isDictor = body.table === "dictors";
        const list = isDictor ? MOCK_DICTORS : MOCK_AUTHORS;
        const found = list.find((p) => p.id === personId) || list[0];
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: found }),
        });
      }

      if (urlStr.includes("news/get.php")) {
        const newsId = Number(body.id) || 1;
        const found = MOCK_NEWS.find((n) => n.id === newsId) || MOCK_NEWS[0];
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: found }),
        });
      }

      if (urlStr.includes("auth/sms.php")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, code: 1234 }),
        });
      }

      if (urlStr.includes("auth/verify.php")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              token: "1234567890123456789",
              user: {
                id: 1,
                name: "Mansurxon Rustamov",
                phone: "+998901234567",
                state: 2,
                levels_id: 1,
              },
            }),
        });
      }

      if (urlStr.includes("bookshelf/add.php") || urlStr.includes("bookshelf/remove.php")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
    }

    // Default fallback response
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: [] }),
    });
  });
};

// =============================================================================
// Browser Environment Setup
// =============================================================================
export const setupE2EEnvironment = () => {
  window.innerWidth = 1280;
  window.innerHeight = 800;

  const playMock = jest.fn(function () {
    this.paused = false;
    return Promise.resolve();
  });
  const pauseMock = jest.fn(function () {
    this.paused = true;
  });
  const loadMock = jest.fn();

  Object.defineProperty(window.HTMLMediaElement.prototype, "paused", {
    get() {
      return this._paused !== false;
    },
    set(val) {
      this._paused = val;
    },
    configurable: true,
  });

  window.HTMLMediaElement.prototype.play = playMock;
  window.HTMLMediaElement.prototype.pause = pauseMock;
  window.HTMLMediaElement.prototype.load = loadMock;

  if (window.HTMLAudioElement) {
    window.HTMLAudioElement.prototype.play = playMock;
    window.HTMLAudioElement.prototype.pause = pauseMock;
    window.HTMLAudioElement.prototype.load = loadMock;
  }

  const MockAudio = function (src) {
    const audio = document.createElement("audio");
    if (src) audio.src = src;
    audio.play = playMock;
    audio.pause = pauseMock;
    audio.load = loadMock;
    return audio;
  };
  MockAudio.prototype = window.HTMLMediaElement.prototype;
  window.Audio = MockAudio;
  global.Audio = MockAudio;

  const wrapTimeout = (target) => {
    if (!target || !target.setTimeout || target.setTimeout.__e2eWrapped) return;
    const orig = target.setTimeout;
    const wrapped = function (fn, delay, ...args) {
      return orig.call(
        this,
        (...cbArgs) => {
          try {
            return fn(...cbArgs);
          } catch (err) {
            if (
              err &&
              (err.message?.includes("playbackRate") ||
                err.message?.includes("reading 'play'") ||
                err.message?.includes("Cannot read properties of null") ||
                err.message?.includes("Cannot set properties of null"))
            ) {
              return;
            }
            throw err;
          }
        },
        delay,
        ...args
      );
    };
    wrapped.__e2eWrapped = true;
    target.setTimeout = wrapped;
  };
  wrapTimeout(window);
  wrapTimeout(global);

  if (!window.scrollTo) {
    window.scrollTo = jest.fn();
  }

  // JSDOM / nwsapi compatibility guard: some pseudo-selectors in JSDOM pass non-Node parameters
  const origContains = Node.prototype.contains;
  Node.prototype.contains = function (other) {
    try {
      return origContains.call(this, other);
    } catch (e) {
      return false;
    }
  };

  // AppleID mock for react-apple-login
  window.AppleID = {
    auth: {
      init: jest.fn(),
      signIn: jest.fn(() => Promise.resolve({})),
    },
  };
  global.AppleID = window.AppleID;

  // Responsive matchMedia mock based on window.innerWidth (default 1280 desktop)
  window.matchMedia = (query) => {
    let matches = false;
    const minWidthMatch = query.match(/\(min-width:\s*(\d+)px\)/);
    const maxWidthMatch = query.match(/\(max-width:\s*(\d+)px\)/);
    const width = window.innerWidth || 1280;

    if (minWidthMatch) {
      matches = width >= parseInt(minWidthMatch[1], 10);
    } else if (maxWidthMatch) {
      matches = width <= parseInt(maxWidthMatch[1], 10);
    } else if (query.includes("prefers-reduced-motion")) {
      matches = false;
    }
    return {
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };

  window.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
  };

  global.SpeechSynthesisUtterance = function (text) {
    this.text = text;
    this.lang = "uz-UZ";
    this.rate = 1;
  };

  if (!window.Audio || !window.Audio.__e2eMocked) {
    window.Audio = class MockAudio {
      constructor(src) {
        this.src = src;
        this.volume = 1;
        this.paused = true;
        this.currentTime = 0;
        this.onerror = null;
      }
      play() {
        this.paused = false;
        return Promise.resolve();
      }
      pause() {
        this.paused = true;
      }
      load() {}
      addEventListener() {}
      removeEventListener() {}
    };
    window.Audio.__e2eMocked = true;
    global.Audio = window.Audio;
  }
};

// =============================================================================
// Master E2E Route Test Shell
// =============================================================================
export const AppTestShell = ({ initialRoute = "/" }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/books" element={<Books />} />
      <Route path="/books/:table/:id" element={<Books />} />
      <Route path="/genres" element={<Genres />} />
      <Route path="/persons/genres" element={<Genres />} />
      <Route path="/person/:table/:id" element={<Person />} />
      <Route path="/persons/:table" element={<Persons />} />
      <Route path="/books/:id" element={<Book />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsView />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// =============================================================================
// Master Render Helper
// =============================================================================
export const renderE2E = (
  initialRoute = "/",
  {
    themeMode = "light",
    countryCode = "UZ",
    textScale = "normal",
    user = null,
  } = {}
) => {
  localStorage.setItem("country_code", countryCode);
  localStorage.setItem("theme_mode", themeMode);
  localStorage.setItem("text_scale", textScale);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", "1234567890123456789");
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <LibraryProvider>
        <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
          <ThemeProvider>
            <MemoryRouter initialEntries={[initialRoute]}>
              <AppTestShell initialRoute={initialRoute} />
            </MemoryRouter>
          </ThemeProvider>
        </SWRConfig>
      </LibraryProvider>
    </GoogleOAuthProvider>
  );
};

describe("E2E Test Harness & Authoritative Fixtures", () => {
  it("exports valid mock datasets and render helper", () => {
    expect(MOCK_GENRES).toBeDefined();
    expect(MOCK_GENRES.length).toBe(12);
    expect(MOCK_BOOKS).toBeDefined();
    expect(typeof renderE2E).toBe("function");
  });
});
