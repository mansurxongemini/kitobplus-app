import React from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import useSWR from "swr";
import BookCard, { BookCardSkeleton } from "./BookCard";
import { prefersReducedMotion } from "../motion";
import { VisuallyHidden } from "../../lib/a11y";
import T from "../../lib/translator";

const fetcher = (url) => fetch(url).then((r) => r.json());
const CARD_W = "clamp(140px, 16vw, 200px)";

const progressOf = (book) => {
  const seconds = Number(book && book.seconds) || 0;
  const pos = Number(book && book.pp_position) || 0;
  if (!seconds) return 0;
  // pp_position is in ms, seconds is in s.
  return Math.min(1, Math.max(0, pos / (seconds * 1000)));
};

const Shelf = ({ id, title, to, books, loading = false, variant = "default", count = 10 }) => {
  const { kp } = useTheme();
  const listRef = React.useRef(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);
  const autoId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const headingId = id || `shelf-${autoId}`;
  const listId = `${headingId}-list`;
  const list = books || [];

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
    // Ширина содержимого меняется и после рендера (появление карточек, шрифты, картинки) — следим за
    // размерами самих карточек, иначе кнопка «Следующие» могла остаться отключённой при переполнении.
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
    el.scrollBy({ left: dir * el.clientWidth, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const navBtn = { display: { xs: "none", md: "inline-flex" }, border: `1px solid ${kp.p.border}`, bgcolor: kp.p.surface, flexShrink: 0 };

  return (
    <Box component="section" aria-labelledby={headingId} sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography id={headingId} component="h2" tabIndex={-1} variant="h2" sx={{ fontSize: "clamp(1.5rem, 1.1rem + 1.8vw, 2.5rem)", flex: 1, minWidth: 0, "&:focus": { outline: "none" } }}>
          {title}
        </Typography>
        {to && (
          <Button component={RouterLink} to={to} aria-label={`${title}: ${T("Смотреть все").toLowerCase()}`} endIcon={<ArrowForwardRounded aria-hidden="true" />} sx={{ flexShrink: 0 }}>
            {T("Смотреть все")}
          </Button>
        )}
        <IconButton aria-label={T("Предыдущие книги")} aria-controls={listId} disabled={!canPrev} onClick={() => scrollByViewport(-1)} sx={navBtn}>
          <ChevronLeft aria-hidden="true" />
        </IconButton>
        <IconButton aria-label={T("Следующие книги")} aria-controls={listId} disabled={!canNext} onClick={() => scrollByViewport(1)} sx={navBtn}>
          <ChevronRight aria-hidden="true" />
        </IconButton>
      </Box>
      <Box
        ref={listRef}
        component="ul"
        id={listId}
        aria-busy={loading ? "true" : undefined}
        sx={{
          listStyle: "none", m: 0, p: 1, display: "flex", gap: 3, overflowX: "auto", overflowY: "hidden",
          scrollSnapType: "x mandatory", scrollbarWidth: "thin", maxWidth: "100%",
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": { background: kp.p.border, borderRadius: "3px" },
        }}
      >
        {loading
          ? Array.from({ length: count }).map((_, i) => (
              <Box component="li" key={i} sx={{ flex: `0 0 ${CARD_W}`, width: CARD_W, scrollSnapAlign: "start" }}><BookCardSkeleton /></Box>
            ))
          : list.slice(0, count).map((book, i) => (
              <Box component="li" key={book.id} sx={{ flex: `0 0 ${CARD_W}`, width: CARD_W, scrollSnapAlign: "start", display: "flex", gap: 1 }}>
                {variant === "ranked" && (
                  <Typography aria-hidden="true" sx={{ fontFamily: kp.fonts.heading, fontWeight: 800, fontSize: "clamp(2rem, 3vw, 3.5rem)", lineHeight: 1, color: kp.p.primary, minWidth: "0.7em", pt: 1 }}>
                    {i + 1}
                  </Typography>
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <BookCard
                    book={book}
                    eager={i < 4}
                    rank={variant === "ranked" ? i + 1 : null}
                    progress={variant === "progress" ? progressOf(book) : null}
                  />
                </Box>
              </Box>
            ))}
      </Box>
      {loading && <VisuallyHidden>{T("Загрузка…")}</VisuallyHidden>}
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
    if (typeof window === "undefined" || !("IntersectionObserver" in window) || !window.IntersectionObserver) { setNear(true); return undefined; }
    try {
      const io = new window.IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
      }, { rootMargin: "800px 0px 800px 0px" });
      io.observe(el);
      return () => io.disconnect();
    } catch (e) { setNear(true); return undefined; }
  }, []);

  const directBooks = descriptor && descriptor.books;
  const url = descriptor && (descriptor.url || descriptor.fetchUrl || descriptor.endpoint);
  const { data, isLoading } = useSWR(near && url && !directBooks ? url : null, fetcher);
  const raw = directBooks || (data && Array.isArray(data.data) ? data.data : null);
  const books = React.useMemo(() => {
    if (!raw) return raw;
    const excl = descriptor && descriptor.excludeId;
    return excl ? raw.filter((b) => String(b.id) !== String(excl)) : raw;
  }, [raw, descriptor]);

  React.useEffect(() => {
    if (books && books.length === 0 && onEmptyRef.current) onEmptyRef.current(descriptor);
  }, [books, descriptor]);

  if (!descriptor) return null;
  if (books && books.length === 0) return null;

  return (
    <Box ref={ref}>
      <Shelf
        id={descriptor.id}
        title={descriptor.title}
        to={descriptor.to}
        books={books || []}
        loading={!directBooks && (!near || isLoading || !data)}
        variant={descriptor.variant || "default"}
        count={descriptor.count || 10}
      />
    </Box>
  );
};

export default Shelf;
