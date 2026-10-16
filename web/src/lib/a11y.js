import React from "react";

// Visually hidden content: visible to screen readers, hidden visually.
export const VisuallyHidden = ({ as: Component = "span", ...props }) => (
  <Component
    {...props}
    style={{
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      whiteSpace: "nowrap",
      border: 0,
      ...(props.style || {}),
    }}
  />
);

// Singleton polite live region + announce() helper.
let liveRegion = null;
export const announce = (message) => {
  if (typeof document === "undefined" || !message) return;
  if (!liveRegion || !document.body.contains(liveRegion)) {
    liveRegion = document.getElementById("a11y-announcer");
  }
  if (!liveRegion) return;
  liveRegion.textContent = "";
  // Force re-announcement even for repeated messages.
  window.setTimeout(() => {
    const el = document.getElementById("a11y-announcer");
    if (el) el.textContent = message;
  }, 30);
};

export const Announcer = () => (
  <div
    id="a11y-announcer"
    aria-live="polite"
    aria-atomic="true"
    style={{
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      whiteSpace: "nowrap",
      border: 0,
    }}
  />
);

// Format seconds as localized "X daqiqa Y soniya" style via parts.
export const formatDurationParts = (totalSeconds) => {
  const s = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const m = Math.floor(s / 60);
  return { m, s: s % 60 };
};

// Set document title and move focus to main heading (or <main>) on route change.
// Returns nothing; call inside a component under Router.
export const useRouteA11y = (title) => {
  React.useEffect(() => {
    if (title) {
      document.title = title + " — KitobPlus";
    }
    // Move focus to the page's h1[tabIndex=-1] if present, else <main>.
    const t = window.setTimeout(() => {
      const main = document.getElementById("main_content");
      if (main) {
        if (!main.hasAttribute("tabindex") && !main.hasAttribute("tabIndex")) {
          main.setAttribute("tabindex", "-1");
        }
        main.focus({ preventScroll: true });
        return;
      }
      const h1 = document.querySelector("h1");
      if (h1) {
        if (!h1.hasAttribute("tabindex") && !h1.hasAttribute("tabIndex")) {
          h1.setAttribute("tabindex", "-1");
        }
        h1.focus({ preventScroll: true });
      }
    }, 60);
    return () => window.clearTimeout(t);
  }, [title]);
};
