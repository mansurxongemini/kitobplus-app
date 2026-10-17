import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Drawer, Divider, Typography, Avatar, useMediaQuery, useTheme, alpha } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { DisplaySettingsPanel, LanguageMenu, LANGUAGES, useLanguage } from "./HeaderMenus";
import useLibrary from "../../LibraryContext";
import { Announcer } from "../../lib/a11y";
import T from "../../lib/translator";

export const useNavItems = () => [
  { label: T("Главная"), to: "/" },
  { label: T("Аудиокниги"), to: "/books" },
  { label: T("Жанры"), to: "/genres" },
  { label: T("Авторы"), to: "/persons/authors" },
  { label: T("Новости"), to: "/news" },
  { label: T("О нас"), to: "/contacts" },
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
        component={RouterLink}
        to="/profile"
        variant="outlined"
        fullWidth={stacked}
        sx={{
          borderRadius: 999,
          borderColor: kp.isContrast ? kp.p.border : kp.p.borderStrong,
          color: kp.p.text,
          fontWeight: 700,
          textTransform: "none",
          px: 1.75,
          height: 38,
          "&:hover": {
            borderColor: kp.p.primary,
            bgcolor: kp.p.surfaceAlt,
          },
        }}
        startIcon={
          <Avatar
            aria-hidden="true"
            sx={{
              width: 26,
              height: 26,
              fontSize: "0.85rem",
              fontWeight: 700,
              bgcolor: kp.p.primary,
              color: kp.p.onPrimary,
            }}
          >
            {String(userName || "M").slice(0, 1).toUpperCase()}
          </Avatar>
        }
        endIcon={<KeyboardArrowDownRounded sx={{ fontSize: "1.1rem !important", color: kp.p.textSecondary, ml: -0.5 }} />}
      >
        {T("Профиль")}
      </Button>
    ) : (
      stacked ? (
        <>
          <Button component={RouterLink} to="/login" variant="outlined" fullWidth>{T("Вход")}</Button>
          <Button component={RouterLink} to="/login" variant="contained" fullWidth>{T("Регистрация")}</Button>
        </>
      ) : (
        <>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            sx={{
              borderRadius: 999,
              borderColor: kp.isContrast ? kp.p.border : kp.p.borderStrong,
              color: kp.p.text,
              fontWeight: 700,
              textTransform: "none",
              px: 2,
              height: 38,
              "&:hover": {
                borderColor: kp.p.primary,
                bgcolor: kp.p.surfaceAlt,
              },
            }}
          >
            {T("Вход")}
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            sx={{
              borderRadius: 999,
              fontWeight: 700,
              textTransform: "none",
              px: 2,
              height: 38,
              bgcolor: kp.p.action,
              color: kp.p.onAction,
              "&:hover": {
                bgcolor: kp.p.actionHover,
              },
            }}
          >
            {T("Регистрация")}
          </Button>
        </>
      )
    );

  return (
    <>
      <a className="kp-skip-link" href="#main_content">{T("Перейти к основному содержимому")}</a>
      <Announcer />
      <Box
        component="header"
        sx={{
          position: "sticky", top: 0, zIndex: 1100,
          bgcolor: kp.isContrast ? kp.p.bg : scrolled ? alpha(kp.p.bg, 0.82) : "transparent",
          backdropFilter: kp.isContrast || !scrolled ? "none" : "saturate(160%) blur(16px)",
          borderBottom: "1px solid", borderColor: scrolled || kp.isContrast ? kp.p.border : "transparent",
          transition: "border-color .2s, background-color .3s",
        }}
      >
        <Box sx={{ maxWidth: kp.layout.maxWidth + 48, mx: "auto", px: { xs: 1.5, sm: 3 }, height: kp.layout.headerHeight, display: "flex", alignItems: "center", justifyContent: "space-between", gap: { xs: 1, md: 3 } }}>
          <Box sx={{ flexShrink: 0 }}>
            <Logo />
          </Box>
          {isDesktop && (
            <Box component="nav" aria-label={T("Основное меню")} sx={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
              <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", gap: 0.5 }}>
                {items.filter((it) => it.to !== "/").map((it) => {
                  const active = isActive(pathname, it.to);
                  return (
                    <li key={it.to}>
                      <Box
                        component={RouterLink} to={it.to} aria-current={active ? "page" : undefined}
                        sx={{
                          display: "inline-flex", alignItems: "center", minHeight: 40, px: 2, borderRadius: 999, whiteSpace: "nowrap",
                          fontWeight: active ? 700 : 500, fontSize: "0.9375rem", textDecoration: "none",
                          color: active ? kp.p.primary : kp.p.textSecondary,
                          bgcolor: active ? (kp.isContrast ? "transparent" : alpha(kp.p.primary, kp.p.mode === "dark" ? 0.16 : 0.08)) : "transparent",
                          border: kp.isContrast && active ? `2px solid ${kp.p.primary}` : "2px solid transparent",
                          transition: "all .2s ease",
                          "&:hover": {
                            color: active ? kp.p.primary : kp.p.text,
                            bgcolor: active
                              ? (kp.isContrast ? "transparent" : alpha(kp.p.primary, kp.p.mode === "dark" ? 0.24 : 0.12))
                              : (kp.isContrast ? "transparent" : alpha(kp.p.text, 0.05)),
                          },
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
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1.25, flexShrink: 0 }}>
            {isDesktop ? (
              <>
                <Box
                  component={RouterLink}
                  to="/books"
                  aria-label={T("Поиск по книгам")}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.25,
                    height: 40,
                    width: { md: 200, lg: 260 },
                    px: 2,
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: kp.isContrast ? kp.p.border : kp.p.borderStrong,
                    bgcolor: kp.p.surface,
                    color: kp.p.textSecondary,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "all .2s ease",
                    "&:hover": {
                      borderColor: kp.p.primary,
                      color: kp.p.text,
                      bgcolor: kp.p.surfaceAlt,
                      "& .kp-search-icon": {
                        color: kp.p.primary,
                      },
                    },
                  }}
                >
                  <SearchIcon className="kp-search-icon" sx={{ fontSize: "1.15rem", color: kp.p.textSecondary, flexShrink: 0, transition: "color .2s ease" }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {T("Kitob, muallif yoki mavzu...")}
                  </span>
                </Box>
                <LanguageMenu pill />
                <Box sx={{ display: "flex", gap: 1, ml: 0.5, "& .MuiButton-root": { whiteSpace: "nowrap" } }}>
                  {authButtons(false)}
                </Box>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <LanguageMenu compact />
                <IconButton
                  component={RouterLink}
                  to="/books"
                  aria-label={T("Поиск по книгам")}
                  sx={{
                    color: kp.p.text,
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    border: `1px solid ${kp.p.border}`,
                    bgcolor: alpha(kp.p.surface, 0.6),
                  }}
                >
                  <SearchIcon sx={{ fontSize: "1.2rem" }} />
                </IconButton>
                <IconButton
                  onClick={() => setOpen(true)}
                  aria-expanded={open}
                  aria-controls="kp-mobile-menu"
                  aria-label={T("Меню")}
                  sx={{
                    color: kp.p.text,
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    border: `1px solid ${kp.p.border}`,
                    bgcolor: alpha(kp.p.surface, 0.6),
                  }}
                >
                  <MenuIcon sx={{ fontSize: "1.25rem" }} />
                </IconButton>
              </Box>
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
                      fontFamily: kp.fonts.heading, fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.03em",
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
