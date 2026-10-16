import React from "react";
import { Box, Breadcrumbs, Typography, useTheme } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import Container from "./Container";
import { useRouteA11y } from "../../lib/a11y";
import { Reveal } from "../motion";
import T from "../../lib/translator";

// Каркас любой страницы: ссылка «к основному содержимому», шапка, <main>, подвал.
// title — заголовок вкладки браузера; при смене страницы фокус переходит в <main>.
const PageShell = ({ title, children }) => {
  useRouteA11y(title);
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <SiteHeader />
      <Box component="main" id="main_content" tabIndex={-1} sx={{ flex: 1, "&:focus, &:focus-visible": { outline: "none", boxShadow: "none" } }}>
        {children}
      </Box>
      <SiteFooter />
    </Box>
  );
};

// Шапка внутренней страницы: хлебные крошки, крупный H1 (можно с <Accent>), подзаголовок, действия справа.
export const PageHeader = ({ title, subtitle, crumbs = [], actions, eyebrow }) => {
  const { kp } = useTheme();
  return (
    <Box sx={{ borderBottom: `1px solid ${kp.p.border}` }}>
      <Container sx={{ pt: { xs: 5, md: 9 }, pb: { xs: 5, md: 7 } }}>
        {crumbs.length > 0 && (
          <Breadcrumbs aria-label={T("Вы находитесь здесь")} separator={<NavigateNextIcon fontSize="small" aria-hidden="true" />} sx={{ mb: 3, "& a, & span": { fontSize: "1rem" } }}>
            <Box component={RouterLink} to="/" sx={{ color: kp.p.textSecondary }}>{T("Главная")}</Box>
            {crumbs.map((c, i) =>
              c.to
                ? <Box key={i} component={RouterLink} to={c.to} sx={{ color: kp.p.textSecondary }}>{c.label}</Box>
                : <Box key={i} component="span" aria-current="page" sx={{ color: kp.p.text, fontWeight: 600 }}>{c.label}</Box>
            )}
          </Breadcrumbs>
        )}
        <Reveal y={18}>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 3 }}>
            <Box sx={{ maxWidth: 900 }}>
              {eyebrow && <Typography variant="overline" component="p" sx={{ color: kp.p.textSecondary, mb: 1.5 }}>{eyebrow}</Typography>}
              <Typography variant="h1">{title}</Typography>
              {subtitle && <Typography variant="subtitle1" component="p" sx={{ mt: 2, color: kp.p.textSecondary, maxWidth: 640 }}>{subtitle}</Typography>}
            </Box>
            {actions && <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>{actions}</Box>}
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
};

// Заголовок секции (можно с <Accent>) и текстовая ссылка «Все …».
export const SectionHeader = ({ title, id, subtitle, linkTo, linkLabel, level = "h2" }) => {
  const { kp } = useTheme();
  return (
    <Reveal y={20}>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: { xs: 4, md: 6 }, flexWrap: "wrap" }}>
        <Box sx={{ maxWidth: 820 }}>
          <Typography id={id} variant="h2" component={level}>{title}</Typography>
          {subtitle && <Typography sx={{ mt: 1.5, color: kp.p.textSecondary, maxWidth: 620 }}>{subtitle}</Typography>}
        </Box>
        {linkTo && (
          <Box
            component={RouterLink} to={linkTo}
            sx={{
              display: "inline-flex", alignItems: "center", gap: 0.5, minHeight: 48, color: kp.p.text, fontWeight: 600, fontSize: "1.0625rem",
              textDecoration: "underline", textDecorationThickness: "1.5px", textUnderlineOffset: "6px",
              "& svg": { transition: "transform .3s" }, "&:hover svg": { transform: "translateX(4px)" },
            }}
          >
            {linkLabel} <NavigateNextIcon aria-hidden="true" />
          </Box>
        )}
      </Box>
    </Reveal>
  );
};

export default PageShell;
