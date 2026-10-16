import { createTheme, alpha } from "@mui/material";
import { palettes, radii, fonts, shadows, layout, textScales } from "./tokens";

// themeMode: "light" | "dark" | "contrast"; textScale: ключ из textScales.
export const createAppTheme = (themeMode = "light", textScale = "normal") => {
  const p = palettes[themeMode] || palettes.light;
  const sh = shadows(p);
  const isContrast = themeMode === "contrast";
  const scale = textScales[textScale] || 1;
  const focusRing = {
    outline: `3px solid ${p.focus}`,
    outlineOffset: 3,
    boxShadow: `0 0 0 6px ${p.focusHalo}`,
  };

  return createTheme({
    kp: { p, radii, shadows: sh, layout, isContrast, focusRing },
    breakpoints: { values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 } },
    shape: { borderRadius: 4 }, // sx borderRadius: N → N × 4px
    palette: {
      mode: p.mode,
      primary: { main: p.primary, dark: p.primaryHover, contrastText: p.onPrimary },
      secondary: { main: p.text, contrastText: p.bg },
      warning: { main: p.accent, contrastText: p.onAccent },
      error: { main: p.error },
      success: { main: p.success },
      background: { default: p.bg, paper: p.surface },
      text: { primary: p.text, secondary: p.textSecondary },
      divider: p.border,
      action: { hover: alpha(p.primary, p.mode === "dark" ? 0.14 : 0.08) },
      // Совместимость со старыми компонентами, которые обращаются к этим ключам.
      lightfirst: { main: p.surfaceAlt },
      lightwhite: { main: p.surface },
      maindark: { main: p.ink },
      icon: { main: p.textSecondary },
      neutral: { 100: p.border, 200: p.textSecondary },
      rating: { main: p.accent, inactive: p.surfaceSunken },
    },
    typography: {
      htmlFontSize: 16,
      fontSize: 16,
      fontFamily: fonts.body,
      h1: { fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(2.25rem, 1.4rem + 3.6vw, 4.25rem)", lineHeight: 1.06, letterSpacing: "-0.035em" },
      h2: { fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(1.75rem, 1.3rem + 1.9vw, 2.75rem)", lineHeight: 1.12, letterSpacing: "-0.03em" },
      h3: { fontFamily: fonts.heading, fontWeight: 700, fontSize: "clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)", lineHeight: 1.2, letterSpacing: "-0.02em" },
      h4: { fontFamily: fonts.heading, fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.3, letterSpacing: "-0.015em" },
      h5: { fontFamily: fonts.heading, fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.35 },
      h6: { fontFamily: fonts.heading, fontWeight: 700, fontSize: "1rem", lineHeight: 1.4 },
      subtitle1: { fontSize: "1.1875rem", lineHeight: 1.6, fontWeight: 500 },
      subtitle2: { fontSize: "1rem", lineHeight: 1.5, fontWeight: 600 },
      body1: { fontSize: "1.125rem", lineHeight: 1.65 },
      body2: { fontSize: "1rem", lineHeight: 1.6 },
      button: { fontFamily: fonts.body, fontWeight: 600, fontSize: "1.0625rem", textTransform: "none", letterSpacing: 0 },
      caption: { fontSize: "0.9375rem", lineHeight: 1.5 },
      overline: { fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.08em", lineHeight: 1.5 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { fontSize: `${100 * scale}%`, scrollBehavior: "smooth", WebkitTextSizeAdjust: "100%" },
          body: {
            margin: 0,
            backgroundColor: p.bg,
            color: p.text,
            fontFeatureSettings: "'cv11', 'ss01'",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
          "::selection": { background: alpha(p.primary, 0.25) },
          "a": { color: p.primary, textUnderlineOffset: "0.2em" },
          ":focus-visible": focusRing,
          // Скрытая подсказка «Перейти к основному содержимому»
          ".kp-skip-link": {
            position: "fixed", left: 16, top: -100, zIndex: 2000,
            padding: "14px 22px", borderRadius: radii.pill,
            background: p.primary, color: p.onPrimary, fontWeight: 700, textDecoration: "none",
          },
          ".kp-skip-link:focus": { top: 12 },
          ...(isContrast && {
            "a": { color: p.primary, textDecoration: "underline" },
            "img": { filter: "grayscale(0.2) contrast(1.1)" },
          }),
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": { animationDuration: "0.01ms !important", transitionDuration: "0.01ms !important", scrollBehavior: "auto !important" },
          },
        },
      },
      MuiButtonBase: { defaultProps: { disableRipple: false } },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radii.pill,
            minHeight: 48,
            paddingInline: 22,
            gap: 4,
            transition: "background-color .2s, box-shadow .2s, transform .2s, color .2s, border-color .2s",
            "&.Mui-focusVisible": focusRing,
          },
          sizeLarge: { minHeight: 56, paddingInline: 28, fontSize: "1.125rem" },
          sizeSmall: { minHeight: 44, paddingInline: 16, fontSize: "1rem" },
          containedPrimary: {
            "&:hover": { backgroundColor: p.primaryHover, boxShadow: isContrast ? "none" : `0 10px 28px ${alpha(p.primary, 0.35)}` },
          },
          outlined: {
            borderWidth: 2, borderColor: p.borderStrong, color: p.text,
            "&:hover": { borderWidth: 2, borderColor: p.text, backgroundColor: alpha(p.text, 0.04) },
          },
          text: { color: p.text, "&:hover": { backgroundColor: alpha(p.text, 0.06) } },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: { width: 48, height: 48, color: p.text, "&.Mui-focusVisible": focusRing },
          sizeLarge: { width: 56, height: 56 },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radii.lg,
            border: `1px solid ${p.border}`,
            boxShadow: sh.card,
            backgroundColor: p.surface,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: radii.pill, fontWeight: 600, fontSize: "0.9375rem", height: 36, paddingInline: 4 },
          outlined: { borderColor: p.borderStrong },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radii.md,
            backgroundColor: p.surface,
            fontSize: "1.125rem",
            minHeight: 56,
            "& .MuiOutlinedInput-notchedOutline": { borderWidth: 2, borderColor: p.borderStrong },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: p.text },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: p.focus, borderWidth: 3 },
          },
        },
      },
      MuiInputLabel: { styleOverrides: { root: { fontSize: "1.0625rem", color: p.textSecondary } } },
      MuiFormHelperText: { styleOverrides: { root: { fontSize: "0.9375rem", marginInline: 4 } } },
      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 52 },
          indicator: { height: 3, borderRadius: 3, backgroundColor: p.primary },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 52, fontSize: "1.0625rem", fontWeight: 600, textTransform: "none", color: p.textSecondary,
            "&.Mui-selected": { color: p.text },
            "&.Mui-focusVisible": focusRing,
          },
        },
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            minWidth: 48, height: 48, borderRadius: radii.pill, fontSize: "1.0625rem", fontWeight: 600,
            "&.Mui-selected": { backgroundColor: p.primary, color: p.onPrimary, "&:hover": { backgroundColor: p.primaryHover } },
            "&.Mui-focusVisible": focusRing,
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: { height: 8, paddingBlock: 18 },
          thumb: {
            width: 24, height: 24, backgroundColor: p.surface, border: `3px solid ${p.primary}`,
            "&.Mui-focusVisible, &:hover": { boxShadow: `0 0 0 8px ${p.focusHalo}` },
          },
          rail: { opacity: 1, backgroundColor: p.surfaceSunken },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: p.ink, color: p.onInk, fontSize: "0.9375rem", padding: "8px 12px", borderRadius: radii.xs },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: { borderRadius: radii.md, border: `1px solid ${p.border}`, boxShadow: sh.raised, marginTop: 8 },
        },
      },
      MuiMenuItem: { styleOverrides: { root: { minHeight: 48, fontSize: "1.0625rem", "&.Mui-focusVisible": { outline: `3px solid ${p.focus}`, outlineOffset: -3 } } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: radii.lg, border: isContrast ? `2px solid ${p.border}` : "none" } } },
      MuiDrawer: { styleOverrides: { paper: { backgroundColor: p.bg } } },
      MuiLink: { styleOverrides: { root: { textUnderlineOffset: "0.2em", "&.Mui-focusVisible": focusRing } } },
      MuiSkeleton: { styleOverrides: { root: { backgroundColor: p.surfaceSunken } } },
      MuiDivider: { styleOverrides: { root: { borderColor: p.border } } },
      MuiAlert: { styleOverrides: { root: { borderRadius: radii.md, fontSize: "1.0625rem" } } },
    },
  });
};
