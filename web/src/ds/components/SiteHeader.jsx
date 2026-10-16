import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Drawer, Divider, Typography, Avatar, useMediaQuery, useTheme, alpha } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { DisplaySettingsMenu, DisplaySettingsPanel, LanguageMenu, LANGUAGES, useLanguage } from "./HeaderMenus";
import useLibrary from "../../LibraryContext";
import { Announcer } from "../../lib/a11y";
import T from "../../lib/translator";

export const useNavItems = () => [
  { label: T("Главная"), to: "/" },
  { label: T("Аудиокниги"), to: "/books" },
  { label: T("Жанры"), to: "/genres" },
  { label: T("Авторы"), to: "/persons/authors" },
  { label: T("Новости"), to: "/news" },
  { label: T("Контакты"), to: "/contacts" },
];

const isActive = (pathname, to) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/"));

const SiteHeader = () => {
  const theme = useTheme();
  const { kp } = theme;
  const { textScale } = useLibrary();
  // При крупном тексте полное меню не помещается — раньше переключаемся на кнопку «Меню».
  const scale = { normal: 1, large: 1.15, xlarge: 1.3 }[textScale] || 1;
  const isDesktop = useMediaQuery(`(min-width:${Math.round(1280 * scale)}px)`);
  const { pathname } = useLocation();
  const { user } = useLibrary();
  const items = useNavItems();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { current, select } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const userName = user && (user.name || user.first_name || user.phone || "");
  const authButtons = (stacked) =>
    user ? (
      <Button
        component={RouterLink} to="/profile" variant="outlined" fullWidth={stacked}
        startIcon={<Avatar aria-hidden="true" sx={{ width: 28, height: 28, fontSize: "0.9rem", bgcolor: kp.p.primary, color: kp.p.onPrimary }}>{String(userName || "K").slice(0, 1).toUpperCase()}</Avatar>}
      >
        {T("Профиль")}
      </Button>
    ) : (
      <>
        <Button component={RouterLink} to="/login" variant={stacked ? "outlined" : "text"} fullWidth={stacked}>{T("Вход")}</Button>
        <Button component={RouterLink} to="/login" variant="contained" fullWidth={stacked}>{T("Регистрация")}</Button>
      </>
    );

  return (
    <>
      <a className="kp-skip-link" href="#main_content">{T("Перейти к основному содержимому")}</a>
      <Announcer />
      <Box
        component="header"
        sx={{
          position: "sticky", top: 0, zIndex: 1100,
          bgcolor: kp.isContrast ? kp.p.bg : alpha(kp.p.bg, 0.86),
          backdropFilter: kp.isContrast ? "none" : "saturate(160%) blur(16px)",
          borderBottom: "1px solid", borderColor: scrolled || kp.isContrast ? kp.p.border : "transparent",
          transition: "border-color .2s",
        }}
      >
        <Box sx={{ maxWidth: kp.layout.maxWidth + 48, mx: "auto", px: { xs: 2, sm: 3 }, height: kp.layout.headerHeight, display: "flex", alignItems: "center", gap: 2 }}>
          <Logo />
          {isDesktop && (
            <Box component="nav" aria-label={T("Основное меню")} sx={{ ml: 2, flex: 1, minWidth: 0 }}>
              <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", gap: 0.5 }}>
                {items.filter((it) => it.to !== "/" && it.to !== "/contacts").map((it) => {
                  const active = isActive(pathname, it.to);
                  return (
                    <li key={it.to}>
                      <Box
                        component={RouterLink} to={it.to} aria-current={active ? "page" : undefined}
                        sx={{
                          display: "inline-flex", alignItems: "center", minHeight: 48, px: 1.5, borderRadius: 999, whiteSpace: "nowrap",
                          fontWeight: 600, fontSize: "1.0625rem", textDecoration: "none",
                          color: active ? kp.p.text : kp.p.textSecondary,
                          bgcolor: active ? (kp.isContrast ? "transparent" : kp.p.surfaceAlt) : "transparent",
                          outline: active && kp.isContrast ? `2px solid ${kp.p.border}` : "none",
                          "&:hover": { color: kp.p.text, bgcolor: kp.isContrast ? "transparent" : kp.p.surfaceAlt, textDecoration: kp.isContrast ? "underline" : "none" },
                        }}
                      >
                        {it.label}
                      </Box>
                    </li>
                  );
                })}
              </Box>
            </Box>
          )}
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton component={RouterLink} to="/books" aria-label={T("Поиск по книгам")}>
              <SearchIcon />
            </IconButton>
            {isDesktop ? (
              <>
                <DisplaySettingsMenu />
                <LanguageMenu />
                <Box sx={{ display: "flex", gap: 1, ml: 1, "& .MuiButton-root": { whiteSpace: "nowrap" } }}>{authButtons(false)}</Box>
              </>
            ) : (
              <Button
                variant="outlined" onClick={() => setOpen(true)} startIcon={<MenuIcon aria-hidden="true" />}
                aria-expanded={open} aria-controls="kp-mobile-menu"
              >
                {T("Меню")}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Drawer
        id="kp-mobile-menu" anchor="right" open={open} onClose={() => setOpen(false)}
        PaperProps={{ "aria-label": T("Меню"), sx: { width: { xs: "100%", sm: 420 } } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, height: kp.layout.headerHeight, borderBottom: 1, borderColor: "divider" }}>
          <Logo />
          <Button variant="outlined" onClick={() => setOpen(false)} startIcon={<CloseIcon aria-hidden="true" />}>{T("Закрыть")}</Button>
        </Box>
        <Box component="nav" aria-label={T("Основное меню")} sx={{ px: 1, py: 1 }}>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {items.map((it) => {
              const active = isActive(pathname, it.to);
              return (
                <li key={it.to}>
                  <Box
                    component={RouterLink} to={it.to} aria-current={active ? "page" : undefined}
                    sx={{
                      display: "flex", alignItems: "center", minHeight: 60, px: 2, borderRadius: 3, textDecoration: "none",
                      fontFamily: "'Manrope Variable', sans-serif", fontWeight: 700, fontSize: "1.375rem",
                      color: kp.p.text, bgcolor: active ? kp.p.surfaceAlt : "transparent",
                      borderLeft: active ? `4px solid ${kp.p.primary}` : "4px solid transparent",
                    }}
                  >
                    {it.label}
                  </Box>
                </li>
              );
            })}
          </Box>
        </Box>
        <Divider />
        <Box sx={{ px: 2, pt: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>{authButtons(true)}</Box>
        <Divider sx={{ mt: 2 }} />
        <Typography variant="h6" component="h2" sx={{ px: 2.5, pt: 2.5 }}>{T("Настройки отображения")}</Typography>
        <DisplaySettingsPanel />
        <Box sx={{ px: 2.5, pb: 4 }}>
          <Typography id="kp-mobile-lang" variant="subtitle2" component="p" sx={{ mb: 1 }}>{T("Язык сайта")}</Typography>
          <Box role="group" aria-labelledby="kp-mobile-lang" sx={{ display: "flex", gap: 1 }}>
            {LANGUAGES.map((l) => (
              <Button key={l.code} lang={l.lang} variant={current.code === l.code ? "contained" : "outlined"} aria-pressed={current.code === l.code} onClick={() => select(l.code)} sx={{ flex: 1 }}>
                {l.name}
              </Button>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SiteHeader;
