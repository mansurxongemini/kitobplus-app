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

// IntersectionObserver mock: tests can trigger intersection via
// window.__ioInstances / window.triggerIntersection().
const ioInstances = [];
window.__ioInstances = ioInstances;
window.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.elements = new Set();
    ioInstances.push(this);
  }
  observe(el) { if (el) this.elements.add(el); }
  unobserve(el) { this.elements.delete(el); }
  disconnect() { this.elements.clear(); }
  trigger(isIntersecting = true) {
    const entries = [...this.elements].map((el) => ({ target: el, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 }));
    if (entries.length) this.callback(entries, this);
  }
};
window.triggerIntersection = () => { ioInstances.forEach((io) => io.trigger(true)); };

// LibraryProvider fetches the current user on mount; keep tests offline.
if (!window.fetch) {
  window.fetch = () => Promise.reject(new Error("offline in tests"));
}
