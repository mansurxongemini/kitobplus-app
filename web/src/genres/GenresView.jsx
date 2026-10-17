import React from "react";
import { Box, Skeleton, Alert, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useSWR from "swr";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import NightlightRounded from "@mui/icons-material/NightlightRounded";
import AccountBalanceRounded from "@mui/icons-material/AccountBalanceRounded";
import ChildCareRounded from "@mui/icons-material/ChildCareRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import AutoFixHighRounded from "@mui/icons-material/AutoFixHighRounded";
import HourglassEmptyRounded from "@mui/icons-material/HourglassEmptyRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import PsychologyRounded from "@mui/icons-material/PsychologyRounded";
import SpaRounded from "@mui/icons-material/SpaRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";

import Container from "../ds/components/Container";
import { getHost } from "../lib/api";
import { VisuallyHidden } from "../lib/a11y";
import T from "../lib/translator";

import genreRoman from "../img/genre_roman.webp";
import genreHikoya from "../img/genre_hikoya.webp";
import genreJahonKlassikasi from "../img/genre_jahon_klassikasi.webp";
import genreBolalarAdabiyoti from "../img/genre_bolalar_adabiyoti.webp";
import genreDostonlar from "../img/genre_dostonlar.webp";
import genreFantastika from "../img/genre_fantastika.webp";
import genreTarixiy from "../img/genre_tarixiy.webp";
import genreDetektiv from "../img/genre_detektiv.webp";
import genreBiografiya from "../img/genre_biografiya.webp";
import genrePsixologiya from "../img/genre_psixologiya.webp";
import genreSheriyat from "../img/genre_sheriyat.webp";
import genreErtak from "../img/genre_ertak.webp";

const fetchJson = (url) => fetch(url).then((r) => r.json());

export const GENRE_ITEMS_DEFAULT = [
  { id: "1", name: "Roman", count: "14 ta kitob", img: genreRoman },
  { id: "2", name: "Hikoya", count: "10 ta kitob", img: genreHikoya },
  { id: "7", name: "Jahon klassikasi", count: "10 ta kitob", img: genreJahonKlassikasi },
  { id: "6", name: "Bolalar adabiyoti", count: "8 ta kitob", img: genreBolalarAdabiyoti },
  { id: "12", name: "Dostonlar", count: "6 ta kitob", img: genreDostonlar },
  { id: "10", name: "Fantastika", count: "6 ta kitob", img: genreFantastika },
  { id: "4", name: "Tarixiy", count: "6 ta kitob", img: genreTarixiy },
  { id: "9", name: "Detektiv", count: "4 ta kitob", img: genreDetektiv },
  { id: "11", name: "Biografiya", count: "3 ta kitob", img: genreBiografiya },
  { id: "8", name: "Psixologiya", count: "3 ta kitob", img: genrePsixologiya },
  { id: "5", name: "She'riyat", count: "2 ta kitob", img: genreSheriyat },
  { id: "3", name: "Ertak", count: "1 ta kitob", img: genreErtak },
];

export const GENRE_IMG_MAP = {
  "1": genreRoman,
  "2": genreHikoya,
  "7": genreJahonKlassikasi,
  "6": genreBolalarAdabiyoti,
  "12": genreDostonlar,
  "10": genreFantastika,
  "4": genreTarixiy,
  "9": genreDetektiv,
  "11": genreBiografiya,
  "8": genrePsixologiya,
  "5": genreSheriyat,
  "3": genreErtak,
};

export const GENRE_STYLE_MAP = {
  "1": { color: "#73482F", Icon: AutoStoriesRounded },     // Roman: Warm leather brown, open book
  "2": { color: "#1D4ED8", Icon: NightlightRounded },      // Hikoya: Deep royal blue, crescent moon
  "7": { color: "#9A6B2F", Icon: AccountBalanceRounded },  // Jahon klassikasi: Antique bronze, classical pillar
  "6": { color: "#D9536B", Icon: ChildCareRounded },       // Bolalar adabiyoti: Soft rose, child
  "12": { color: "#A75A38", Icon: GroupsRounded },         // Dostonlar: Terracotta, epic company
  "10": { color: "#6D28D9", Icon: AutoFixHighRounded },    // Fantastika: Magic violet, sparkles/wand
  "4": { color: "#E58B3F", Icon: HourglassEmptyRounded },  // Tarixiy: Amber sand, hourglass
  "9": { color: "#4B5563", Icon: SearchRounded },          // Detektiv: Charcoal slate, magnifying glass
  "11": { color: "#2D7A47", Icon: PersonRounded },         // Biografiya: Forest green, person
  "8": { color: "#2563EB", Icon: PsychologyRounded },      // Psixologiya: Electric blue, mind/brain
  "5": { color: "#9333EA", Icon: SpaRounded },             // She'riyat: Lotus purple, poetry flower
  "3": { color: "#4B5563", Icon: AutoAwesomeRounded },     // Ertak: Dark slate/earth, fairy wonder
};

export const formatGenreCount = (rawCount) => {
  if (!rawCount && rawCount !== 0) return "";
  const str = String(rawCount).trim();
  const match = str.match(/\d+/);
  if (match) {
    return `${match[0]} ${T("ta kitob")}`;
  }
  return str;
};

export const GenreCardItem = ({ id, name, count, img, to }) => {
  const cardImg = img || GENRE_IMG_MAP[String(id)] || genreRoman;
  const targetTo = to || `/books/genres/${id}`;
  const style = GENRE_STYLE_MAP[String(id)] || { color: "#73482F", Icon: AutoStoriesRounded };
  const { color: badgeColor, Icon: BadgeIcon } = style;

  const displayName = T(name);
  const formattedCount = formatGenreCount(count);
  const label = formattedCount ? `${displayName}: ${formattedCount}` : displayName;
  const theme = useTheme();
  const { kp } = theme;

  return (
    <Box
      component={RouterLink}
      to={targetTo}
      aria-label={label}
      sx={{
        display: "block",
        position: "relative",
        width: "100%",
        borderRadius: "18px",
        overflow: "hidden",
        textDecoration: "none",
        boxShadow: kp.shadows.card,
        border: kp.isContrast ? "2px solid #FFFFFF" : `1px solid ${kp.p.border}`,
        transition: "transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.28s ease, border-color 0.28s ease",
        bgcolor: "#0E1524",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: kp.shadows.raised,
          borderColor: kp.isContrast ? "#FFFFFF" : kp.p.primary,
          "& .genre-card-art": {
            transform: "scale(1.04)",
          },
          "& .genre-card-arrow": {
            transform: "translateX(2px)",
            bgcolor: "rgba(255, 255, 255, 0.28)",
          },
        },
        "&:focus-visible": {
          outline: `3px solid ${kp.p.primary}`,
          outlineOffset: 3,
        },
      }}
    >
      {/* 3D Illustration */}
      <Box
        component="img"
        className="genre-card-art"
        src={cardImg}
        alt=""
        sx={{
          width: "100%",
          height: "auto",
          aspectRatio: "250 / 100",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      />

      {/* Dark gradient overlay for WCAG AAA text contrast */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(12, 18, 28, 0.05) 0%, rgba(12, 18, 28, 0.38) 42%, rgba(12, 18, 28, 0.90) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Foreground Content: Badge + Name + Count + Arrow */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 1.25, sm: 1.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.25,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {/* Left: Icon Badge + Text Stack */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.25 }, minWidth: 0 }}>
          <Box
            sx={{
              width: { xs: 34, sm: 38 },
              height: { xs: 34, sm: 38 },
              borderRadius: "10px",
              bgcolor: badgeColor,
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.35)",
            }}
          >
            <BadgeIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <Typography
              component="span"
              sx={{
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: { xs: "0.875rem", sm: "0.98rem" },
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.7)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayName}
            </Typography>
            {formattedCount && (
              <Typography
                component="span"
                sx={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontWeight: 500,
                  fontSize: { xs: "0.72rem", sm: "0.78rem" },
                  lineHeight: 1.3,
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {formattedCount}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right: Frosted Glass Arrow Button */}
        <Box
          className="genre-card-arrow"
          sx={{
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            borderRadius: "50%",
            bgcolor: "rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
            transition: "transform 0.25s ease, background-color 0.25s ease",
          }}
        >
          <ChevronRightRounded sx={{ fontSize: { xs: 16, sm: 18 } }} />
        </Box>
      </Box>

      {/* VisuallyHidden accessibility announcement */}
      <VisuallyHidden>{label}</VisuallyHidden>
    </Box>
  );
};

const GenresView = () => {
  const { data, error, isLoading } = useSWR(`${getHost()}/srv/genres.php?sort=popular`, fetchJson);
  const serverGenres = (data && data.data) || [];

  const displayGenres = serverGenres.length > 0
    ? serverGenres.map((g) => ({
        id: String(g.id),
        name: g.name,
        count: g.books_count ? `${g.books_count} ta kitob` : "",
        img: GENRE_IMG_MAP[String(g.id)],
      }))
    : GENRE_ITEMS_DEFAULT;

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      {error && (
        <Alert severity="error" role="alert" sx={{ mb: 4 }}>
          {T("Ошибка")}
        </Alert>
      )}
      <Box
        component="ul"
        aria-label={T("Жанры")}
        aria-busy={isLoading ? "true" : undefined}
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "grid",
          gap: { xs: 2, md: 2.5 },
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {isLoading && serverGenres.length === 0
          ? Array.from({ length: 12 }).map((_, i) => (
              <li key={i}>
                <Skeleton
                  variant="rounded"
                  sx={{
                    width: "100%",
                    aspectRatio: "250 / 100",
                    borderRadius: "16px",
                  }}
                />
              </li>
            ))
          : displayGenres.map((genre) => (
              <li key={genre.id}>
                <GenreCardItem
                  id={genre.id}
                  name={genre.name}
                  count={genre.count}
                  img={genre.img}
                />
              </li>
            ))}
      </Box>
    </Container>
  );
};

export default GenresView;
