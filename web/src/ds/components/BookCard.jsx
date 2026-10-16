import React from "react";
import { Box, Typography, Skeleton, useTheme, alpha } from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import MicNoneOutlined from "@mui/icons-material/MicNoneOutlined";
import { Link as RouterLink } from "react-router-dom";
import BookCover from "./BookCover";
import { useFormatDuration } from "../format";
import T from "../../lib/translator";

// Карточка книги. Ссылка — на названии; через ::after она растянута на всю карточку,
// поэтому экранная читалка слышит одну ссылку с названием, а остальное — обычным текстом.
const BookCard = ({ book, headingLevel = "h3", eager = false }) => {
  const { kp } = useTheme();
  const fmt = useFormatDuration();
  const duration = fmt(book.seconds);
  return (
    <Box
      component="article"
      sx={{
        position: "relative", display: "flex", flexDirection: "column", gap: 1.5, height: "100%",
        "&:hover .kp-cover, &:focus-within .kp-cover": { transform: kp.isContrast ? "none" : "translateY(-6px)" },
        "&:hover .kp-play, &:focus-within .kp-play": { opacity: 1, transform: "scale(1)" },
        "&:focus-within": { outline: `3px solid ${kp.p.focus}`, outlineOffset: 6, borderRadius: "18px" },
      }}
    >
      <Box className="kp-cover" sx={{ position: "relative", transition: "transform .35s cubic-bezier(.2,.8,.2,1)" }}>
        <BookCover book={book} eager={eager} />
        <Box
          className="kp-play" aria-hidden="true"
          sx={{
            position: "absolute", right: { xs: 8, md: 12 }, bottom: { xs: 8, md: 12 }, width: { xs: 44, md: 52 }, height: { xs: 44, md: 52 }, borderRadius: "50%",
            display: "grid", placeItems: "center", bgcolor: kp.p.primary, color: kp.p.onPrimary,
            boxShadow: kp.isContrast ? "none" : `0 10px 24px ${alpha("#000", 0.3)}`,
            opacity: { xs: 1, md: 0 }, transform: { xs: "scale(1)", md: "scale(.85)" }, transition: "opacity .25s, transform .25s",
          }}
        >
          <PlayArrowRounded sx={{ fontSize: 32 }} />
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
        <Typography
          component={headingLevel}
          sx={{ fontFamily: "'Manrope Variable', sans-serif", fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.3, letterSpacing: "-0.01em", m: 0 }}
        >
          <Box
            component={RouterLink} to={`/books/${book.id}`}
            sx={{
              color: kp.p.text, textDecoration: "none",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              "&::after": { content: '""', position: "absolute", inset: 0, zIndex: 1 },
              "&:focus-visible": { outline: "none", boxShadow: "none" },
              "&:hover": { textDecoration: kp.isContrast ? "underline" : "none" },
            }}
          >
            {book.title}
          </Box>
        </Typography>
        {book.authors_name && (
          <Typography variant="body2" sx={{ color: kp.p.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {book.authors_name}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5, mt: 0.5, color: kp.p.textSecondary, fontSize: "0.9375rem" }}>
          {duration && (
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
              <ScheduleOutlined aria-hidden="true" sx={{ fontSize: 18 }} />
              <span>{duration}</span>
            </Box>
          )}
          {book.dictors_name && (
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, minWidth: 0, maxWidth: "100%" }}>
              <MicNoneOutlined aria-hidden="true" sx={{ fontSize: 18, flexShrink: 0 }} />
              <Box component="span" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{T("Читает")}: </Box>
              <Box component="span" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.dictors_name}</Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const BookCardSkeleton = () => (
  <Box aria-hidden="true">
    <Skeleton variant="rounded" sx={{ width: "100%", height: "auto", aspectRatio: "2 / 3", borderRadius: "16px" }} />
    <Skeleton width="80%" height={28} sx={{ mt: 1.5 }} />
    <Skeleton width="55%" height={22} />
  </Box>
);

// Адаптивная сетка карточек: 2 колонки на телефоне, до 6 на широком экране.
export const BookGrid = ({ books, loading, count = 6, columns = { xs: 2, sm: 3, md: 4, lg: 6 }, headingLevel = "h3", label }) => (
  <Box
    component="ul" aria-label={label} aria-busy={loading ? "true" : undefined}
    sx={{
      listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: "28px 16px", md: "40px 24px" },
      gridTemplateColumns: {
        xs: `repeat(${columns.xs}, minmax(0, 1fr))`, sm: `repeat(${columns.sm}, minmax(0, 1fr))`,
        md: `repeat(${columns.md}, minmax(0, 1fr))`, lg: `repeat(${columns.lg}, minmax(0, 1fr))`,
      },
    }}
  >
    {loading
      ? Array.from({ length: count }).map((_, i) => <li key={i}><BookCardSkeleton /></li>)
      : (books || []).map((b, i) => <li key={b.id}><BookCard book={b} headingLevel={headingLevel} eager={i < 6} /></li>)}
  </Box>
);

export default BookCard;
