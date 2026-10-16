import AccessibilityIcon from "@mui/icons-material/Accessibility";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import hf404 from "./img/404.png"
import { ThemeProvider404 } from "./ThemeProvider404";
import { useNavigate } from "react-router-dom";
import Navigation from "./parts/Navigation.jsx";
import FooterSection from "./parts/FooterSection.jsx";
import T from "./lib/translator.js";

const Element = () => {
  const navigate = useNavigate()

  // Navigation menu items
  const navItems = [
    { title: "Главная", path: "/" },
    { title: "О нас", path: "/about" },
    { title: "Аудиокниги", path: "/audiobooks" },
    { title: "Гостевая книга", path: "/guestbook" },
    { title: "Контакты", path: "/contacts" },
  ];

  // Top bar items
  const topBarItems = [
    { title: "Русский", path: "/language", align: "left" },
    { title: "Книжная полка", path: "/bookshelf", align: "right" },
    { title: "Вход / Регистрация", path: "/login", align: "right" },
  ];

  return (
    <>
      <Navigation/>    
      <ThemeProvider404>
      <Box
        sx={{
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.default",
            position: "relative",
            width: "100%",
            maxWidth: 1440,
          }}
        >
          {/* 404 Content */}
          <Container
            sx={{
              pt: 2,
              pb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ position: "relative", width: 622, height: 346, mb: 4 }}>
              {/* 404 with headphones image */}
              <Box
                component="img"
                src={hf404}
                alt="404 Error"
                sx={{ width: "100%", height: "100%" }}
              />
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontFamily: "'PT_Root_UI-Bold', Helvetica",
                fontWeight: 700,
                color: "text.primary",
                textAlign: "center",
                mb: 2,
              }}
            >
              {T('Страница не найдена')}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontFamily: "'PT_Root_UI-Medium', Helvetica",
                color: "text.secondary",
                textAlign: "center",
                maxWidth: 582,
                mb: 6,
              }}
            >
              {T('Приносим свои извинения, эта ссылка недействительна, но вы можете перейти к другим разделам сайта.')}
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              sx={{
                bgcolor: "lightBlue.main",
                color: "primary.main",
                width: 277,
                height: 56,
              }}
              onClick={() => navigate('/')}
            >
              {T('Вернуться на главную')}
            </Button>
          </Container>
        </Box>
      </Box>
      </ThemeProvider404>
      <FooterSection/>
    </>
  );
};

export default Element;
