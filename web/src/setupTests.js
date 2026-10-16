import "@testing-library/jest-dom";

// jsdom has no matchMedia / IntersectionObserver.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// LibraryProvider fetches the current user on mount; keep tests offline.
if (!window.fetch) {
  window.fetch = () => Promise.reject(new Error("offline in tests"));
}
