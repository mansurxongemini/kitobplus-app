import React from "react";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
import MailOutline from "@mui/icons-material/MailOutline";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import { Link as RouterLink } from "react-router-dom";
import Logo from "./Logo";
import Container from "./Container";
import T from "../../lib/translator";

const FooterLink = ({ to, href, children, ...rest }) => {
  const { kp } = useTheme();
  const sx = {
    display: "inline-flex", alignItems: "center", gap: 1, minHeight: 44, color: kp.p.onInk, textDecoration: "none",
    fontSize: "1.0625rem", "&:hover": { textDecoration: "underline", color: kp.p.cyan },
  };
  return to
    ? <Box component={RouterLink} to={to} sx={sx} {...rest}>{children}</Box>
    : <Box component="a" href={href} sx={sx} {...rest}>{children}</Box>;
};

const Column = ({ title, id, children }) => {
  const { kp } = useTheme();
  return (
    <Box component="nav" aria-labelledby={id}>
      <Typography id={id} component="h2" variant="overline" sx={{ color: kp.p.onInkSecondary, display: "block", mb: 1.5 }}>{title}</Typography>
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 0.25 }}>{children}</Box>
    </Box>
  );
};

const SiteFooter = () => {
  const { kp } = useTheme();
  const year = new Date().getFullYear();
  const storeBtn = { justifyContent: "flex-start", color: kp.p.onInk, borderColor: kp.p.onInkSecondary, "&:hover": { borderColor: kp.p.onInk, bgcolor: "rgba(255,255,255,.06)" } };
  return (
    <Box component="footer" sx={{ bgcolor: kp.p.ink, color: kp.p.onInk, mt: 0, borderTop: kp.isContrast ? `2px solid ${kp.p.border}` : "none" }}>
      <Container sx={{ py: { xs: 6, md: 9 } }}>
        <Grid container spacing={{ xs: 5, md: 6 }}>
          <Grid item xs={12} md={4}>
            <Logo inverted />
            <Typography sx={{ mt: 2.5, color: kp.p.onInkSecondary, maxWidth: 360 }}>
              {T("Онлайн-аудиобиблиотека для людей с нарушениями зрения и всех, кто любит слушать книги.")}
            </Typography>
            <Box sx={{ mt: 3, display: "grid", gap: 1.25, maxWidth: 280 }}>
              <Button variant="outlined" href="https://apps.apple.com/us/app/kitobplus/id6470842246" startIcon={<AppleIcon aria-hidden="true" />} sx={storeBtn}>
                {T("Приложение для iOS")}
              </Button>
              <Button variant="outlined" href="https://play.google.com/store/apps/details?id=uz.kitobplus.app" startIcon={<AndroidIcon aria-hidden="true" />} sx={storeBtn}>
                {T("Приложение для Android")}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2.5}>
            <Column title={T("Библиотека")} id="kp-f-lib">
              <li><FooterLink to="/books">{T("Все книги")}</FooterLink></li>
              <li><FooterLink to="/genres">{T("Жанры")}</FooterLink></li>
              <li><FooterLink to="/persons/authors">{T("Авторы")}</FooterLink></li>
              <li><FooterLink to="/persons/dictors">{T("Дикторы")}</FooterLink></li>
            </Column>
          </Grid>
          <Grid item xs={6} sm={4} md={2.5}>
            <Column title={T("О проекте")} id="kp-f-about">
              <li><FooterLink to="/#about">{T("О нас")}</FooterLink></li>
              <li><FooterLink to="/news">{T("Новости")}</FooterLink></li>
              <li><FooterLink to="/profile">{T("Профиль")}</FooterLink></li>
              <li><FooterLink to="/contacts">{T("Контакты")}</FooterLink></li>
            </Column>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Column title={T("Связаться с нами")} id="kp-f-contact">
              <li><FooterLink href="mailto:info@kitobplus.uz"><MailOutline aria-hidden="true" />info@kitobplus.uz</FooterLink></li>
              <li><FooterLink href="tel:+998908087331"><PhoneOutlined aria-hidden="true" />+998 90 808 73 31</FooterLink></li>
              <li><FooterLink href="https://t.me/kitobplus_uz"><TelegramIcon aria-hidden="true" />{T("Телеграм")}</FooterLink></li>
            </Column>
          </Grid>
        </Grid>
        <Box sx={{ mt: { xs: 6, md: 8 }, pt: 3, borderTop: `1px solid ${kp.isContrast ? kp.p.border : "rgba(255,255,255,.14)"}`, display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "space-between", color: kp.p.onInkSecondary }}>
          <Typography variant="body2">© {year} KitobPlus · {T("Все права защищены")}</Typography>
          <Typography variant="body2">
            {T("Проект")}{" "}
            <Box component="a" href="https://sharoitplus.uz/" sx={{ color: kp.p.onInk, textUnderlineOffset: "0.2em" }}>{T("ОО инвалидов «ШароитПлюс»")}</Box>
          </Typography>
          <Typography variant="body2" sx={{ width: { xs: "100%", lg: "auto" } }}>
            {T("Если вы видите ошибку на сайте, выделите ее и нажмите CTRL + ENTER (⌘ + ENTER)")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SiteFooter;
