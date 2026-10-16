import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography, ToggleButton, ToggleButtonGroup, Popover, useTheme } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import TuneIcon from "@mui/icons-material/Tune";
import CheckIcon from "@mui/icons-material/Check";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import ContrastIcon from "@mui/icons-material/Contrast";
import useLibrary from "../../LibraryContext";
import { setCountryCode as saveCountryCode } from "../../lib/api";
import { announce } from "../../lib/a11y";
import T from "../../lib/translator";

export const LANGUAGES = [
  { code: "UZ", name: "Oʻzbekcha", short: "UZ", lang: "uz" },
  { code: "RU", name: "Русский", short: "RU", lang: "ru" },
  { code: "US", name: "English", short: "EN", lang: "en" },
];

export const useLanguage = () => {
  const { countryCode, setCountryCode } = useLibrary();
  const select = (code) => {
    setCountryCode(code);
    saveCountryCode(code);
  };
  return { current: LANGUAGES.find((l) => l.code === countryCode) || LANGUAGES[0], select };
};

export const LanguageMenu = ({ compact = false }) => {
  const [anchor, setAnchor] = useState(null);
  const { current, select } = useLanguage();
  return (
    <>
      <Button
        variant="text"
        onClick={(e) => setAnchor(e.currentTarget)}
        startIcon={<LanguageIcon aria-hidden="true" />}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        aria-label={T("Язык сайта") + ": " + current.name}
        sx={{ px: compact ? 1.5 : 2, fontWeight: 700 }}
      >
        {current.short}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {LANGUAGES.map((l) => (
          <MenuItem
            key={l.code}
            lang={l.lang}
            selected={l.code === current.code}
            aria-current={l.code === current.code ? "true" : undefined}
            onClick={() => { select(l.code); setAnchor(null); }}
          >
            <ListItemIcon>{l.code === current.code && <CheckIcon aria-hidden="true" />}</ListItemIcon>
            <ListItemText>{l.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// Панель «Ko'rinish»: тема и размер текста. Используется в меню шапки и в мобильном меню.
export const DisplaySettingsPanel = () => {
  const { themeMode, setThemeMode, textScale, setTextScale } = useLibrary();
  const { kp } = useTheme();
  const themes = [
    { value: "light", label: T("Светлая"), icon: <LightModeOutlined aria-hidden="true" /> },
    { value: "dark", label: T("Тёмная"), icon: <DarkModeOutlined aria-hidden="true" /> },
    { value: "contrast", label: T("Контрастная"), icon: <ContrastIcon aria-hidden="true" /> },
  ];
  const sizes = [
    { value: "normal", label: "A", fs: "1rem", name: T("Обычный") },
    { value: "large", label: "A", fs: "1.25rem", name: T("Крупный") },
    { value: "xlarge", label: "A", fs: "1.5rem", name: T("Очень крупный") },
  ];
  const group = { display: "flex", width: "100%", "& .MuiToggleButton-root": { flex: 1, minHeight: 56, gap: 0.75, fontWeight: 600, fontSize: "0.9375rem", textTransform: "none", borderColor: kp.p.borderStrong, color: kp.p.text, flexDirection: "column", lineHeight: 1.2 }, "& .Mui-selected": { bgcolor: `${kp.p.primary} !important`, color: `${kp.p.onPrimary} !important` } };
  return (
    <Box sx={{ p: 2.5, width: { xs: "100%", sm: 360 } }}>
      <Typography id="kp-theme-label" variant="subtitle2" component="p" sx={{ mb: 1 }}>{T("Тема оформления")}</Typography>
      <ToggleButtonGroup
        exclusive value={themeMode} aria-labelledby="kp-theme-label" sx={group}
        onChange={(e, v) => { if (v) { setThemeMode(v); announce(T("Тема оформления") + ": " + themes.find((t) => t.value === v).label); } }}
      >
        {themes.map((t) => <ToggleButton key={t.value} value={t.value}>{t.icon}{t.label}</ToggleButton>)}
      </ToggleButtonGroup>
      <Typography id="kp-size-label" variant="subtitle2" component="p" sx={{ mt: 2.5, mb: 1 }}>{T("Размер текста")}</Typography>
      <ToggleButtonGroup
        exclusive value={textScale} aria-labelledby="kp-size-label" sx={group}
        onChange={(e, v) => { if (v) { setTextScale(v); announce(T("Размер текста") + ": " + sizes.find((s) => s.value === v).name); } }}
      >
        {sizes.map((s) => (
          <ToggleButton key={s.value} value={s.value} aria-label={s.name}>
            <Box component="span" aria-hidden="true" sx={{ fontSize: s.fs, fontWeight: 800, lineHeight: 1 }}>{s.label}</Box>
            <Box component="span" aria-hidden="true" sx={{ fontSize: "0.8125rem" }}>{s.name}</Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export const DisplaySettingsMenu = () => {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <Button
        variant="text"
        onClick={(e) => setAnchor(e.currentTarget)}
        startIcon={<TuneIcon aria-hidden="true" />}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
        sx={{ px: 2 }}
      >
        {T("Вид")}
      </Button>
      <Popover
        anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { role: "dialog", "aria-labelledby": "kp-display-title", sx: { mt: 1, borderRadius: 4, border: 1, borderColor: "divider" } } }}
      >
        <Typography id="kp-display-title" variant="h6" component="h2" sx={{ px: 2.5, pt: 2.5 }}>{T("Настройки отображения")}</Typography>
        <DisplaySettingsPanel />
        <Divider />
        <Box sx={{ p: 1.5, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={() => setAnchor(null)}>{T("Готово")}</Button>
        </Box>
      </Popover>
    </>
  );
};
