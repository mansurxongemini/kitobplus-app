import React from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";
import AutoStoriesOutlined from "@mui/icons-material/AutoStoriesOutlined";
import PageShell from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import GenresView from "./GenresView";
import useLibrary from "../LibraryContext";
import T from "../lib/translator";
import genresBannerBg from "../img/genres_banner_bg.webp";

const Genres = () => {
  useLibrary();
  const { kp } = useTheme();
  return (
    <PageShell title={T("Жанры")}>
      <Container sx={{ pt: { xs: 3, md: 5 } }}>
        <Box
          component="section"
          aria-labelledby="genres-page-title"
          sx={{
            position: "relative",
            borderRadius: { xs: 5, md: 6 },
            overflow: "hidden",
            bgcolor: kp.p.surface,
            backgroundImage: `linear-gradient(90deg, ${alpha(kp.p.surface, 0.96)} 0%, ${alpha(kp.p.surface, 0.88)} 45%, ${alpha(kp.p.surface, 0.2)} 75%, ${alpha(kp.p.surface, 0)} 100%), url(${genresBannerBg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: { xs: "75% center", sm: "right center" },
            border: `1px solid ${kp.p.border}`,
            boxShadow: kp.shadows.card,
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 4, sm: 5, md: 5.5 },
            minHeight: { xs: 180, md: 210 },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ maxWidth: { xs: "100%", sm: 520, md: 640 }, position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.75,
                py: 0.6,
                borderRadius: 999,
                bgcolor: alpha(kp.p.primary, 0.12),
                color: kp.p.primary,
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              <AutoStoriesOutlined sx={{ fontSize: 16 }} />
              <span>{T("КАТЕГОРИИ")}</span>
            </Box>

            <Typography
              id="genres-page-title"
              variant="h1"
              sx={{
                fontFamily: kp.fonts.heading,
                fontWeight: 850,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                letterSpacing: "-0.03em",
                color: kp.p.text,
                lineHeight: 1.1,
                m: 0,
              }}
            >
              {T("Жанры")}
            </Typography>

            <Typography
              sx={{
                color: kp.p.textSecondary,
                fontSize: { xs: "0.9375rem", md: "1.0625rem" },
                mt: 1.25,
                lineHeight: 1.5,
                maxWidth: 480,
              }}
            >
              {T("genres_banner_subtitle")}
            </Typography>
          </Box>
        </Box>
      </Container>
      <GenresView />
    </PageShell>
  );
};

export default Genres;
