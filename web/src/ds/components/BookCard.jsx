import React, { useRef } from "react";
import { Box, Typography, Skeleton, useTheme } from "@mui/material";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import MicNoneOutlined from "@mui/icons-material/MicNoneOutlined";
import HeadphonesRounded from "@mui/icons-material/HeadphonesRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import BookCover from "./BookCover";
import { useFormatDuration } from "../format";
import { Reveal, navigateWithTransition } from "../motion";
import T from "../../lib/translator";

const srOnly = { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

const RANK_BADGE_COLORS = {
  1: { bg: "#FEF3C7", text: "#D97706" }, // 1st: amber/gold
  2: { bg: "#DBEAFE", text: "#2563EB" }, // 2nd: blue
  3: { bg: "#DCFCE7", text: "#16A34A" }, // 3rd: green
};

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

  const rankStyle = rank ? (RANK_BADGE_COLORS[rank] || { bg: "#F1F5F9", text: "#475569" }) : null;

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        height: "100%",
        width: width || undefined,
        "& .kp-cover": { transition: "transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .45s" },
        "&:hover .kp-cover, &:focus-within .kp-cover": kp.isContrast ? {} : { transform: "translateY(-8px)", boxShadow: "0 24px 48px -18px rgba(11,25,44,.35)" },
        "&:hover .kp-play-overlay, &:focus-within .kp-play-overlay": { opacity: 1 },
        "&:focus-within": { outline: `3px solid ${kp.p.focus}`, outlineOffset: 8, borderRadius: "18px" },
      }}
    >
      <Box sx={{ position: "relative", width: "100%", borderRadius: "14px", overflow: "hidden" }}>
        <BookCover ref={coverRef} book={book} eager={eager} rounded={14} className="kp-cover" />
        {rank !== null && rank !== undefined && (
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 3,
              width: 30,
              height: 30,
              borderRadius: "8px",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: "0.875rem",
              bgcolor: rankStyle.bg,
              color: rankStyle.text,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            {rank}
          </Box>
        )}
        <Box
          className="kp-play-overlay"
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(11, 25, 44, 0.22)",
            opacity: 0,
            transition: "opacity .25s ease",
            borderRadius: "inherit",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: kp.p.primary,
              color: kp.p.onPrimary,
              display: "grid",
              placeItems: "center",
              boxShadow: "0 4px 14px rgba(24, 90, 219, 0.4)",
            }}
          >
            <PlayArrowRounded sx={{ fontSize: 24, ml: 0.25 }} />
          </Box>
        </Box>
      </Box>

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
        <Typography component={headingLevel} sx={{ fontFamily: kp.fonts.heading, fontWeight: 750, fontSize: "1.0625rem", lineHeight: 1.3, letterSpacing: "-0.02em", m: 0 }}>
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
          <Typography variant="body2" sx={{ color: kp.p.textSecondary, fontSize: "0.84rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {book.authors_name}
          </Typography>
        )}

        {(duration || book.dictors_name || book.listened) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 0.5, color: kp.p.textSecondary, fontSize: "0.8125rem", flexWrap: "wrap" }}>
            {duration && (
              <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                <ScheduleOutlined aria-hidden="true" sx={{ fontSize: 14 }} />
                <span>{duration}</span>
              </Box>
            )}
            {book.listened && (
              <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                <HeadphonesRounded aria-hidden="true" sx={{ fontSize: 14 }} />
                <span>{Math.round(book.listened / 1000)} {T("ming")}</span>
              </Box>
            )}
            {!duration && !book.listened && book.dictors_name && (
              <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, minWidth: 0, maxWidth: "100%" }}>
                <MicNoneOutlined aria-hidden="true" sx={{ fontSize: 14, flexShrink: 0 }} />
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
    <Skeleton width="80%" height={26} sx={{ mt: 1.5, borderRadius: "6px" }} />
    <Skeleton width="55%" height={20} sx={{ mt: 0.5, borderRadius: "6px" }} />
  </Box>
);

// Адаптивная сетка карточек: 2 колонки на телефоне, до 5 на широком экране. Карточки появляются по очереди.
export const BookGrid = ({ books, loading, count = 5, columns = { xs: 2, sm: 3, md: 4, lg: 5 }, headingLevel = "h3", label }) => (
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
      : (books || []).map((b, i) => (
          <Reveal as="li" key={b.id} delay={(i % 6) * 0.07}>
            <BookCard book={b} headingLevel={headingLevel} eager={i < 6} />
          </Reveal>
        ))}
  </Box>
);

export default BookCard;
