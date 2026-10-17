import React from "react";
import { Alert, Box, Button, IconButton, Typography, useTheme, alpha } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import useSWR from "swr";
import BookCard, { BookCardSkeleton } from "./BookCard";
import { prefersReducedMotion } from "../motion";
import { VisuallyHidden } from "../../lib/a11y";
import T from "../../lib/translator";
import { GenreCardItem } from "../../genres/GenresView";

import genreRoman from "../../img/genre_roman.png";
import genreHikoya from "../../img/genre_hikoya.png";
import genreJahonKlassikasi from "../../img/genre_jahon_klassikasi.png";
import genreBolalarAdabiyoti from "../../img/genre_bolalar_adabiyoti.png";
import genreDostonlar from "../../img/genre_dostonlar.png";
import genreFantastika from "../../img/genre_fantastika.png";
import genreTarixiy from "../../img/genre_tarixiy.png";
import genreDetektiv from "../../img/genre_detektiv.png";
import genreBiografiya from "../../img/genre_biografiya.png";
import genrePsixologiya from "../../img/genre_psixologiya.png";
import genreSheriyat from "../../img/genre_sheriyat.png";
import genreErtak from "../../img/genre_ertak.png";

const fetcher = (url) => fetch(url).then((r) => r.json());
const CARD_W = "clamp(150px, 16vw, 195px)";

export const CATEGORY_ITEMS = [
  { id: "1", title: "Roman", count: "14 ta kitob", img: genreRoman, to: "/books/genres/1" },
  { id: "2", title: "Hikoya", count: "10 ta kitob", img: genreHikoya, to: "/books/genres/2" },
  { id: "7", title: "Jahon klassikasi", count: "10 ta kitob", img: genreJahonKlassikasi, to: "/books/genres/7" },
  { id: "6", title: "Bolalar adabiyoti", count: "8 ta kitob", img: genreBolalarAdabiyoti, to: "/books/genres/6" },
  { id: "12", title: "Dostonlar", count: "6 ta kitob", img: genreDostonlar, to: "/books/genres/12" },
  { id: "10", title: "Fantastika", count: "6 ta kitob", img: genreFantastika, to: "/books/genres/10" },
  { id: "4", title: "Tarixiy", count: "6 ta kitob", img: genreTarixiy, to: "/books/genres/4" },
  { id: "9", title: "Detektiv", count: "4 ta kitob", img: genreDetektiv, to: "/books/genres/9" },
  { id: "11", title: "Biografiya", count: "3 ta kitob", img: genreBiografiya, to: "/books/genres/11" },
  { id: "8", title: "Psixologiya", count: "3 ta kitob", img: genrePsixologiya, to: "/books/genres/8" },
  { id: "5", title: "She'riyat", count: "2 ta kitob", img: genreSheriyat, to: "/books/genres/5" },
  { id: "3", title: "Ertak", count: "1 ta kitob", img: genreErtak, to: "/books/genres/3" },
];

const progressOf = (book) => {
  const seconds = Number(book && book.seconds) || 0;
  const pos = Number(book && book.pp_position) || 0;
  if (!seconds) return 0;
  return Math.min(1, Math.max(0, pos / (seconds * 1000)));
};

const Shelf = ({
  id,
  title,
  eyebrow,
  subtitle,
  to,
  actionLabel,
  books,
  loading = false,
  variant = "default",
  count = 10,
}) => {
  const { kp } = useTheme();
  const listRef = React.useRef(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);
  const autoId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const headingId = id || `shelf-${autoId}`;
  const listId = `${headingId}-list`;
  const isCategories = variant === "categories";
  const isRanked = variant === "ranked";
  const list = isCategories ? CATEGORY_ITEMS : (books || []);

  const updateNav = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    updateNav();
    const el = listRef.current;
    if (!el) return undefined;
    const raf = requestAnimationFrame(updateNav);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateNav) : null;
    if (ro) { ro.observe(el); Array.from(el.children).forEach((c) => ro.observe(c)); }
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [updateNav, list.length, loading]);

  if (!loading && list.length === 0) return null;

  const scrollByViewport = (dir) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const navBtn = {
    display: { xs: "none", md: "inline-flex" },
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: `1px solid ${kp.p.border}`,
    bgcolor: kp.p.surface,
    color: kp.p.text,
    boxShadow: kp.shadows.card,
    flexShrink: 0,
    "&:hover": { bgcolor: kp.p.surfaceAlt },
    "&.Mui-disabled": { opacity: 0.35 },
  };

  const content = (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {eyebrow && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.75 }}>
              <Typography
                sx={{
                  color: kp.p.primary,
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {eyebrow}
              </Typography>
              <Box sx={{ width: 36, height: 2, bgcolor: kp.p.primary, borderRadius: 1 }} />
            </Box>
          )}
          <Typography
            id={headingId}
            component="h2"
            tabIndex={-1}
            variant="h2"
            sx={{
              fontFamily: kp.fonts.heading,
              fontWeight: 850,
              fontSize: "clamp(1.5rem, 1.1rem + 1.8vw, 2.375rem)",
              letterSpacing: "-0.03em",
              color: kp.p.text,
              m: 0,
              "&:focus": { outline: "none" },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: kp.p.textSecondary, fontSize: "0.9375rem", mt: 0.75, maxWidth: 640 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          {to && (
            <Button
              component={RouterLink}
              to={to}
              variant="outlined"
              aria-label={`${title}: ${(actionLabel || T("Смотреть все")).toLowerCase()}`}
              endIcon={<ArrowForwardRounded aria-hidden="true" sx={{ fontSize: "1.1rem !important" }} />}
              sx={{
                borderRadius: 999,
                borderColor: kp.p.border,
                color: kp.p.primary,
                fontWeight: 700,
                textTransform: "none",
                px: 2,
                py: 0.7,
                fontSize: "0.875rem",
                "&:hover": {
                  borderColor: kp.p.primary,
                  bgcolor: alpha(kp.p.primary, 0.08),
                },
              }}
            >
              {actionLabel || T("Смотреть все")}
            </Button>
          )}
          <IconButton aria-label={T("Предыдущие книги")} aria-controls={listId} disabled={!canPrev} onClick={() => scrollByViewport(-1)} sx={navBtn}>
            <ChevronLeft aria-hidden="true" />
          </IconButton>
          <IconButton aria-label={T("Следующие книги")} aria-controls={listId} disabled={!canNext} onClick={() => scrollByViewport(1)} sx={navBtn}>
            <ChevronRight aria-hidden="true" />
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={listRef}
        component="ul"
        id={listId}
        aria-busy={loading ? "true" : undefined}
        sx={{
          listStyle: "none",
          m: 0,
          p: 0.5,
          display: "flex",
          gap: { xs: 2, md: 2.5 },
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          maxWidth: "100%",
        }}
      >
        {loading ? (
          Array.from({ length: count }).map((_, i) => (
            <Box component="li" key={i} sx={{ flex: `0 0 ${CARD_W}`, width: CARD_W, scrollSnapAlign: "start" }}>
              <BookCardSkeleton />
            </Box>
          ))
        ) : isCategories ? (
          list.map((cat) => (
            <Box
              component="li"
              key={cat.id}
              sx={{
                flex: { xs: "0 0 230px", sm: "0 0 250px", md: "0 0 270px" },
                width: { xs: 230, sm: 250, md: 270 },
                scrollSnapAlign: "start",
              }}
            >
              <GenreCardItem
                id={cat.id}
                name={cat.title}
                count={cat.count}
                img={cat.img}
                to={cat.to}
              />
            </Box>
          ))
        ) : (
          list.slice(0, count).map((book, i) => (
            <Box
              component="li"
              key={book.id}
              sx={{
                flex: `0 0 ${CARD_W}`,
                width: CARD_W,
                scrollSnapAlign: "start",
                display: "flex",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <BookCard
                  book={book}
                  eager={i < 4}
                  rank={isRanked ? i + 1 : null}
                  progress={variant === "progress" ? progressOf(book) : null}
                />
              </Box>
            </Box>
          ))
        )}
      </Box>
      {loading && <VisuallyHidden>{T("Загрузка…")}</VisuallyHidden>}
    </>
  );

  if (isRanked) {
    return (
      <Box
        component="section"
        aria-labelledby={headingId}
        sx={{
          bgcolor: kp.p.surface,
          borderRadius: { xs: 6, md: 8 },
          p: { xs: 2.5, sm: 3, md: 4 },
          border: `1px solid ${kp.p.border}`,
          boxShadow: kp.shadows.card,
          my: { xs: 3, md: 5 },
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box component="section" aria-labelledby={headingId} sx={{ py: { xs: 4, md: 6 } }}>
      {content}
    </Box>
  );
};

export { Shelf };

export const LazyShelf = ({ descriptor, onEmpty }) => {
  const ref = React.useRef(null);
  const [near, setNear] = React.useState(false);
  const onEmptyRef = React.useRef(onEmpty);
  onEmptyRef.current = onEmpty;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof window === "undefined" || !("IntersectionObserver" in window) || !window.IntersectionObserver) {
      setNear(true);
      return undefined;
    }
    const fallbackTimer = setTimeout(() => setNear(true), 600);
    try {
      const io = new window.IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          clearTimeout(fallbackTimer);
          setNear(true);
          io.disconnect();
        }
      }, { rootMargin: "1200px 0px 1200px 0px" });
      io.observe(el);
      return () => {
        clearTimeout(fallbackTimer);
        io.disconnect();
      };
    } catch (e) {
      clearTimeout(fallbackTimer);
      setNear(true);
      return undefined;
    }
  }, []);

  const directBooks = descriptor && descriptor.books;
  const url = descriptor && (descriptor.url || descriptor.fetchUrl || descriptor.endpoint);
  const { data, error, isLoading, mutate } = useSWR(near && url && !directBooks ? url : null, fetcher);
  const books = React.useMemo(() => {
    const raw = directBooks || (data && Array.isArray(data.data) ? data.data : null);
    if (!raw) return raw;
    const excl = descriptor && descriptor.excludeId;
    return excl ? raw.filter((b) => String(b.id) !== String(excl)) : raw;
  }, [directBooks, data, descriptor]);

  React.useEffect(() => {
    if (books && books.length === 0 && onEmptyRef.current) onEmptyRef.current(descriptor);
  }, [books, descriptor]);

  if (!descriptor) return null;
  if (error && !directBooks) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert
          severity="error"
          role="alert"
          action={
            <Button color="inherit" size="small" onClick={() => mutate()}>
              {T("Обновить")}
            </Button>
          }
        >
          {descriptor.title ? `${descriptor.title}: ` : ""}{T("Не удалось загрузить данные")}
        </Alert>
      </Box>
    );
  }
  if (books && books.length === 0) return null;

  const isCategories = descriptor && descriptor.variant === "categories";
  return (
    <Box ref={ref}>
      <Shelf
        id={descriptor.id}
        title={descriptor.title}
        eyebrow={descriptor.eyebrow}
        subtitle={descriptor.subtitle}
        actionLabel={descriptor.actionLabel}
        to={descriptor.to}
        books={isCategories ? CATEGORY_ITEMS : (books || [])}
        loading={!isCategories && !directBooks && !error && (!near || isLoading || !data)}
        variant={descriptor.variant || "default"}
        count={descriptor.count || 10}
      />
    </Box>
  );
};

export default Shelf;
