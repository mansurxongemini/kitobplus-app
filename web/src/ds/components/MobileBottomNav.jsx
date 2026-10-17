import React from "react";
import { Box, ButtonBase, Typography, useTheme, alpha } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Link as RouterLink, useLocation } from "react-router-dom";
import T from "../../lib/translator";

const NAV_ITEMS = [
  { labelKey: "Главная", to: "/", icon: HomeRoundedIcon },
  { labelKey: "Аудиокниги", to: "/books", icon: SearchRoundedIcon },
  { labelKey: "Жанры", to: "/genres", icon: CategoryRoundedIcon },
  { labelKey: "Профиль", to: "/profile", icon: PersonRoundedIcon },
];

const isItemActive = (pathname, to) => {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
};

const MobileBottomNav = () => {
  const theme = useTheme();
  const { kp } = theme;
  const { pathname } = useLocation();

  return (
    <Box
      component="nav"
      aria-label={T("Мобильная навигация")}
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        zIndex: 1250,
        height: "calc(64px + env(safe-area-inset-bottom, 0px))",
        pb: "env(safe-area-inset-bottom, 0px)",
        alignItems: "center",
        justifyContent: "space-around",
        bgcolor: kp.isContrast ? kp.p.bg : alpha(kp.p.bg, 0.94),
        backdropFilter: kp.isContrast ? "none" : "blur(20px) saturate(180%)",
        borderTop: `1px solid ${kp.p.border}`,
        boxShadow: kp.p.mode === "dark" 
          ? "0 -4px 20px rgba(0, 0, 0, 0.4)" 
          : "0 -4px 20px rgba(10, 20, 40, 0.06)",
        transition: "background-color .3s, border-color .3s",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isItemActive(pathname, item.to);
        const IconComponent = item.icon;
        const label = T(item.labelKey);

        return (
          <ButtonBase
            key={item.to}
            component={RouterLink}
            to={item.to}
            aria-current={active ? "page" : undefined}
            aria-label={label}
            sx={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.35,
              py: 0.5,
              px: 1,
              color: active ? kp.p.primary : kp.p.textSecondary,
              transition: "all .2s ease",
              WebkitTapHighlightColor: "transparent",
              "&:active": {
                transform: "scale(0.92)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 28,
                borderRadius: 999,
                bgcolor: active
                  ? kp.isContrast
                    ? "transparent"
                    : alpha(kp.p.primary, kp.p.mode === "dark" ? 0.2 : 0.1)
                  : "transparent",
                border: kp.isContrast && active ? `2px solid ${kp.p.primary}` : "2px solid transparent",
                transition: "all .25s ease",
              }}
            >
              <IconComponent
                sx={{
                  fontSize: "1.45rem",
                  color: active ? kp.p.primary : kp.p.textSecondary,
                  transition: "transform .2s ease, color .2s ease",
                  transform: active ? "scale(1.1)" : "scale(1)",
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.72rem",
                fontWeight: active ? 700 : 500,
                letterSpacing: active ? "-0.01em" : "0",
                color: active ? kp.p.primary : kp.p.textSecondary,
                lineHeight: 1,
                transition: "color .2s ease",
              }}
            >
              {label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default MobileBottomNav;
