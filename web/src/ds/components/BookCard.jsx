import React, { useRef } from "react";
import { Box, Typography, Skeleton, useTheme } from "@mui/material";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import MicNoneOutlined from "@mui/icons-material/MicNoneOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import BookCover from "./BookCover";
import { useFormatDuration } from "../format";
import { Reveal, navigateWithTransition } from "../motion";
import T from "../../lib/translator";

const srOnly = { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

// Карточка книги. Ссылка — на названии; через ::after она растянута на всю карточку,
// поэтому экранная читалка слышит одну ссылку с названием, а остальное — обычным текстом.
// Клик открывает книгу с переходом «обложка летит на страницу книги».
const BookCard = ({ book, headingLevel = "h3", eager = false, rank = null, progress = null, width }) => {
  const { kp } = useTheme();
  const fmt = useFormatDuration();
  const navigate = useNavigate();
  const coverRef = useRef(null);
  const duration = fmt(book.seconds);
  const to = `/books/${book.id}`;

  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigateWithTransition(navigate, to, coverRef.current, book.id, { book });
  };

  return (
    <Box
      component="article"
      sx={{
        position: "relative", display: "flex", flexDirection: "column", gap: 1.75, height: "100%", width: width || undefined,
        "& .kp-cover": { transition: "transform .55s cubic-bezier(.2,.8,.2,1), box-shadow .55s" },
        "&:hover .kp-cover, &:focus-within .kp-cover": kp.isContrast ? {} : { transform: "translateY(-10px)", boxShadow: "0 30px 60px -24px rgba(14,26,43,.45)" },
        "&:focus-within": { outline: `3px solid ${kp.p.focus}`, outlineOffset: 8, borderRadius: "18px" },
      }}
    >
      <BookCover ref={coverRef} book={book} eager={eager} rounded={14} className="kp-cover" />
      {progress !== null && progress !== undefined && (
        <Box sx={{ mt: -0.5 }}>
          <Box aria-hidden="true" sx={{ height: "6px", borderRadius: "3px", bgcolor: kp.p.surfaceSunken, overflow: "hidden" }}>
            <Box sx={{ height: "100%", width: `${Math.min(100, Math.max(0, Math.round(progress * 100)))}%`, bgcolor: kp.p.primary }} />
          </Box>
          <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: kp.p.textSecondary }}>
            {T("Прослушано")} {Math.min(100, Math.max(0, Math.round(progress * 100)))}%
          </Typography>
        </Box>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, minWidth: 0 }}>
        <Typography component={headingLevel} sx={{ fontFamily: kp.fonts.heading, fontWeight: 650, fontSize: "1.125rem", lineHeight: 1.3, letterSpacing: "-0.02em", m: 0 }}>
          <Box
            component={RouterLink} to={to} onClick={onClick}
            sx={{
              color: kp.p.text, textDecoration: "none",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              "&::after": { content: '""', position: "absolute", inset: 0, zIndex: 1 },
              "&:focus-visible": { outline: "none", boxShadow: "none" },
              "&:hover": { textDecoration: kp.isContrast ? "underline" : "none" },
            }}
          >
            {rank !== null && rank !== undefined && <Box component="span" sx={srOnly}>{rank}-{T("место")} </Box>}
            {book.title}
          </Box>
        </Typography>
        {book.authors_name && (
          <Typography variant="body2" sx={{ color: kp.p.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {book.authors_name}
          </Typography>
        )}
        {(duration || book.dictors_name) && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.25, mt: 0.75, color: kp.p.textSecondary, fontSize: "0.9375rem" }}>
            {duration && (
              <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                <ScheduleOutlined aria-hidden="true" sx={{ fontSize: 17 }} />
                <span>{duration}</span>
              </Box>
            )}
            {book.dictors_name && (
              <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, minWidth: 0, maxWidth: "100%" }}>
                <MicNoneOutlined aria-hidden="true" sx={{ fontSize: 17, flexShrink: 0 }} />
                <Box component="span" sx={srOnly}>{T("Читает")}: </Box>
                <Box component="span" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.dictors_name}</Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const BookCardSkeleton = () => (
  <Box aria-hidden="true">
    <Skeleton variant="rounded" sx={{ width: "100%", height: "auto", aspectRatio: "2 / 3", borderRadius: "14px" }} />
    <Skeleton width="80%" height={28} sx={{ mt: 1.5 }} />
    <Skeleton width="55%" height={22} />
  </Box>
);

// Адаптивная сетка карточек: 2 колонки на телефоне, до 5 на широком экране. Карточки появляются по очереди.
export const BookGrid = ({ books, loading, count = 5, columns = { xs: 2, sm: 3, md: 4, lg: 5 }, headingLevel = "h3", label }) => (
  <Box
    component="ul" aria-label={label} aria-busy={loading ? "true" : undefined}
    sx={{
      listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: "32px 16px", md: "48px 28px" },
      gridTemplateColumns: {
        xs: `repeat(${columns.xs}, minmax(0, 1fr))`, sm: `repeat(${columns.sm}, minmax(0, 1fr))`,
        md: `repeat(${columns.md}, minmax(0, 1fr))`, lg: `repeat(${columns.lg}, minmax(0, 1fr))`,
      },
    }}
  >
    {loading
      ? Array.from({ length: count }).map((_, i) => <li key={i}><BookCardSkeleton /></li>)
      : (books || []).map((b, i) => (
          <Reveal as="li" key={b.id} delay={(i % 6) * 0.07}>
            <BookCard book={b} headingLevel={headingLevel} eager={i < 6} />
          </Reveal>
        ))}
  </Box>
);

export default BookCard;
