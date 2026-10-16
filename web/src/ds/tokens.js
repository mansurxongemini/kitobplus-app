// KitobPlus design tokens.
// Основная аудитория — незрячие и слабовидящие пользователи, поэтому контраст текста не ниже 7:1
// (AAA) для основного текста и 4.5:1 для всего остального, во всех трёх темах.

export const palettes = {
  light: {
    mode: "light",
    bg: "#F7F7F3",          // тёплая «бумага»
    surface: "#FFFFFF",
    surfaceAlt: "#EEF3F1",
    surfaceSunken: "#E6ECE9",
    border: "#DCE3E0",
    borderStrong: "#74827F",  // 3.8:1 — рамки полей и кнопок (WCAG 1.4.11)
    text: "#0F1E24",        // 16.8:1 на bg
    textSecondary: "#44555B", // 7.6:1 на bg
    primary: "#0B6E79",     // белый текст 6.0:1
    primaryHover: "#075861",
    onPrimary: "#FFFFFF",
    primarySoft: "#DDF0EF",
    onPrimarySoft: "#08515A",
    accent: "#F2B33D",      // шафран, только с тёмным текстом
    onAccent: "#1C1404",
    ink: "#0D1A20",         // тёмные секции
    onInk: "#F2F5F3",
    onInkSecondary: "#B7C6C4",
    cyan: "#3FC6D6",        // декоративный акцент бренда на тёмном фоне
    success: "#1F7A4D",
    error: "#B42318",
    focus: "#0B6E79",
    focusHalo: "rgba(11, 110, 121, 0.25)",
    overlay: "rgba(13, 26, 32, 0.55)",
  },
  dark: {
    mode: "dark",
    bg: "#0B1215",
    surface: "#121C20",
    surfaceAlt: "#18252A",
    surfaceSunken: "#0E171A",
    border: "#25343A",
    borderStrong: "#5E7178",
    text: "#EEF3F2",        // 16.5:1
    textSecondary: "#A9B9BD", // 9.4:1
    primary: "#5CD3DD",
    primaryHover: "#86E0E7",
    onPrimary: "#04282C",
    primarySoft: "#123A40",
    onPrimarySoft: "#BDEFF2",
    accent: "#F5BE55",
    onAccent: "#1C1404",
    ink: "#060B0D",
    onInk: "#EEF3F2",
    onInkSecondary: "#A9B9BD",
    cyan: "#5CD3DD",
    success: "#5DD39E",
    error: "#FF8A80",
    focus: "#86E0E7",
    focusHalo: "rgba(134, 224, 231, 0.30)",
    overlay: "rgba(0, 0, 0, 0.65)",
  },
  // Высокий контраст: чёрный фон, белый текст, жёлтые акценты и рамки вместо теней.
  contrast: {
    mode: "dark",
    bg: "#000000",
    surface: "#000000",
    surfaceAlt: "#000000",
    surfaceSunken: "#000000",
    border: "#FFFFFF",
    borderStrong: "#FFFFFF",
    text: "#FFFFFF",
    textSecondary: "#FFFFFF",
    primary: "#FFE14D",
    primaryHover: "#FFF08A",
    onPrimary: "#000000",
    primarySoft: "#000000",
    onPrimarySoft: "#FFE14D",
    accent: "#FFE14D",
    onAccent: "#000000",
    ink: "#000000",
    onInk: "#FFFFFF",
    onInkSecondary: "#FFFFFF",
    cyan: "#FFE14D",
    success: "#7CFF8A",
    error: "#FF8A80",
    focus: "#FFE14D",
    focusHalo: "rgba(255, 225, 77, 0.35)",
    overlay: "rgba(0, 0, 0, 0.85)",
  },
};

export const radii = { xs: 8, sm: 12, md: 16, lg: 24, xl: 32, pill: 999 };

export const fonts = {
  heading: "'Manrope Variable', 'Manrope', 'Inter Variable', system-ui, sans-serif",
  body: "'Inter Variable', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};

// Масштаб текста из панели «Ko'rinish»: html font-size 16px × scale.
export const textScales = { normal: 1, large: 1.15, xlarge: 1.3 };

export const layout = { maxWidth: 1240, headerHeight: 76 };

export const shadows = (p) =>
  p === palettes.contrast
    ? { card: "none", raised: "none", float: "none" }
    : p.mode === "dark"
      ? {
          card: "0 1px 2px rgba(0,0,0,.4)",
          raised: "0 2px 4px rgba(0,0,0,.4), 0 16px 40px rgba(0,0,0,.45)",
          float: "0 24px 64px rgba(0,0,0,.55)",
        }
      : {
          card: "0 1px 2px rgba(15,30,36,.05), 0 6px 20px rgba(15,30,36,.05)",
          raised: "0 2px 6px rgba(15,30,36,.07), 0 18px 44px rgba(15,30,36,.12)",
          float: "0 30px 80px rgba(13,26,32,.22)",
        };

// Палитра для сгенерированных обложек (когда у книги нет картинки). Все пары проходят 4.5:1.
export const coverGradients = [
  ["#0B6E79", "#0D3B47", "#FFFFFF"],
  ["#7A3E9D", "#3A1F55", "#FFFFFF"],
  ["#B4532A", "#5A2410", "#FFFFFF"],
  ["#1F6F4A", "#0E3524", "#FFFFFF"],
  ["#2B4C9B", "#14234D", "#FFFFFF"],
  ["#8A6A12", "#3D2E05", "#FFFFFF"],
  ["#9B2F4E", "#4A1424", "#FFFFFF"],
  ["#3B5560", "#17252B", "#FFFFFF"],
];
