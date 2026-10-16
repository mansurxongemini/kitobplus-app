import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import HomeRounded from "@mui/icons-material/HomeRounded";
import AutoStoriesOutlined from "@mui/icons-material/AutoStoriesOutlined";
import { Link as RouterLink } from "react-router-dom";
import PageShell from "./ds/components/PageShell";
import Container from "./ds/components/Container";
import hf404 from "./img/404.png";
import T from "./lib/translator";

const NotFound = () => {
  const { kp } = useTheme();

  return (
    <PageShell title={T("Страница не найдена")}>
      <Container
        sx={{
          py: { xs: 8, md: 12 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          src={hf404}
          alt=""
          aria-hidden="true"
          sx={{
            width: "100%",
            maxWidth: 360,
            height: "auto",
            mb: 4,
            filter: kp.isContrast ? "invert(1)" : "none",
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: "clamp(2rem, 1.5rem + 2vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            mb: 2,
          }}
        >
          {T("Страница не найдена")}
        </Typography>

        <Typography
          sx={{
            color: kp.p.textSecondary,
            fontSize: { xs: "1.0625rem", md: "1.1875rem" },
            maxWidth: 580,
            lineHeight: 1.6,
            mb: 5,
          }}
        >
          {T(
            "Приносим свои извинения, эта ссылка недействительна, но вы можете перейти к другим разделам сайта."
          )}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            startIcon={<HomeRounded aria-hidden="true" />}
          >
            {T("Главная")}
          </Button>

          <Button
            component={RouterLink}
            to="/books"
            variant="outlined"
            size="large"
            startIcon={<AutoStoriesOutlined aria-hidden="true" />}
          >
            {T("Каталог")}
          </Button>
        </Box>
      </Container>
    </PageShell>
  );
};

export default NotFound;
