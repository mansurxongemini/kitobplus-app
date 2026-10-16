import React from "react";
import { Alert, Box, Button, Typography, useTheme } from "@mui/material";
import SearchOffOutlined from "@mui/icons-material/SearchOffOutlined";
import useSWRInfinite from "swr/infinite";
import { getHost } from "../lib/api";
import { BookGrid, BookCardSkeleton } from "../ds/components/BookCard";
import Filter from "../parts/Filter";
import { announce } from "../lib/a11y";
import T, { tr } from "../lib/translator";

export const PER_PAGE = 24;

const fetcher = (url) => fetch(url).then((res) => res.json());

const buildUrl = ({ table, persons_id, sort, page, filters }) =>
  getHost() +
  "/srv/books.php?" +
  (table === "authors" && persons_id ? "authors_id=" + persons_id + "&" : "") +
  (table === "dictors" && persons_id ? "dictors_id=" + persons_id + "&" : "") +
  (table === "genres" && persons_id ? "genres_id=" + persons_id + "&" : "") +
  "sort=" + sort + "&page=" + page + "&per_page=" + PER_PAGE +
  (filters.length > 0 ? "&" + filters.join("&") : "");

// Catalog results with infinite loading: sentinel auto-loads, the
// "Загрузить ещё" button always works and moves focus to the first new card.
const BooksSection = ({ selectedGenres, sort = "new", table, persons_id, filter: externalFilter, onTotal, onResetFilters }) => {
  const { kp } = useTheme();
  const [internalFilter, setInternalFilter] = React.useState("");
  const filter = externalFilter !== undefined ? externalFilter : internalFilter;
  const resultsRef = React.useRef(null);
  const sentinelRef = React.useRef(null);
  const focusFromRef = React.useRef(null);
  const announcedRef = React.useRef("");
  const loadedAnnouncedRef = React.useRef("");

  const filters = React.useMemo(() => {
    const f = [];
    const ids = [...(selectedGenres || [])].sort((a, b) => a - b);
    if (ids.length) f.push("genres_id[]=" + ids.join("&genres_id[]="));
    if (filter && filter.trim() !== "") f.push("filter=" + encodeURIComponent(filter.trim()));
    return f;
  }, [selectedGenres, filter]);

  const queryKey = `${table || ""}|${persons_id || ""}|${sort}|${filters.join("&")}`;

  const getKey = React.useCallback((pageIndex, previousPageData) => {
    if (previousPageData && Array.isArray(previousPageData.data)) {
      const loaded = pageIndex * PER_PAGE;
      const totalPrev = Number(previousPageData.total);
      if (!Number.isNaN(totalPrev)) { if (loaded >= totalPrev) return null; }
      else if (previousPageData.data.length < PER_PAGE) return null;
    }
    return buildUrl({ table, persons_id, sort, page: pageIndex, filters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const { data: pages, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite(getKey, fetcher);

  const books = React.useMemo(() => {
    const seen = new Set();
    const out = [];
    (pages || []).forEach((pg) => {
      ((pg && pg.data) || []).forEach((b) => { if (!seen.has(b.id)) { seen.add(b.id); out.push(b); } });
    });
    return out;
  }, [pages]);

  const total = pages && pages[0] && typeof pages[0].total !== "undefined" ? Number(pages[0].total) : null;
  const hasMore = total !== null ? books.length < total : (pages ? (pages[pages.length - 1]?.data?.length === PER_PAGE) : false);
  const loadingMore = isLoading || (isValidating && size > 1) || (pages && pages[size - 1] === undefined && hasMore);

  React.useEffect(() => {
    if (total === null) return;
    if (onTotal) onTotal(total);
    const msg = `${tr("Найдено книг")}: ${total}`;
    const key = `${msg}|${queryKey}`;
    if (announcedRef.current !== key) { announcedRef.current = key; announce(msg); }
  }, [total, queryKey, onTotal]);

  // Announce cumulative loaded count after each page (not the first render only).
  React.useEffect(() => {
    if (!pages || total === null || books.length === 0) return;
    const msg = `${tr("Загружено")} ${books.length} / ${total}`;
    if (loadedAnnouncedRef.current !== msg && pages.length > 0) {
      // Only announce load-more progress, not replace the initial count announcement repeatedly.
      if (loadedAnnouncedRef.current !== "") announce(msg);
      loadedAnnouncedRef.current = msg;
    }
  }, [books.length, total, pages]);

  const loadMore = React.useCallback((manual) => {
    if (!hasMore) return;
    if (manual) focusFromRef.current = books.length;
    setSize((s) => s + 1);
  }, [hasMore, books.length, setSize]);

  // Focus first new card after a manual load.
  React.useEffect(() => {
    if (focusFromRef.current === null) return;
    if (books.length <= focusFromRef.current) return;
    const from = focusFromRef.current;
    focusFromRef.current = null;
    const t = window.setTimeout(() => {
      const links = resultsRef.current ? resultsRef.current.querySelectorAll('a[href^="/books/"]') : [];
      if (links && links[from]) links[from].focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [books.length]);

  // Sentinel auto-load (focus never moves).
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return undefined;
    if (typeof window === "undefined" || !("IntersectionObserver" in window) || !window.IntersectionObserver) return undefined;
    try {
      const io = new window.IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore(false);
      }, { rootMargin: "600px 0px 600px 0px" });
      io.observe(el);
      return () => io.disconnect();
    } catch (e) { return undefined; }
  }, [hasMore, loadMore]);

  const handleReset = () => { if (onResetFilters) onResetFilters(); else setInternalFilter(""); };

  return (
    <>
      {externalFilter === undefined && <Filter value={internalFilter} onChange={setInternalFilter} />}
      {error && books.length === 0 ? (
        <Alert role="alert" severity="error" action={<Button color="inherit" size="small" onClick={() => mutate()}>{T("Обновить")}</Button>} sx={{ mt: 3 }}>
          {T("Не удалось загрузить список книг")}
        </Alert>
      ) : (
        <Box
          ref={resultsRef}
          id="books-results"
          role="tabpanel"
          aria-labelledby={externalFilter !== undefined ? `books-sort-${sort}` : undefined}
          aria-busy={isLoading ? "true" : undefined}
          aria-label={`${T("Найдено книг")}${total === null ? "" : `: ${total}`}`}
          sx={{ mt: { xs: 3, md: 4 }, scrollMarginTop: 90 }}
        >
          <BookGrid books={books} loading={false} count={PER_PAGE} columns={{ xs: 2, sm: 3, md: 4, lg: 4 }} />
          {isLoading && books.length === 0 && (
            <Box component="ul" aria-hidden="true" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: "32px 16px", md: "48px 28px" }, gridTemplateColumns: { xs: "repeat(2, minmax(0,1fr))", sm: "repeat(3, minmax(0,1fr))", md: "repeat(4, minmax(0,1fr))" } }}>
              {Array.from({ length: PER_PAGE }).map((_, i) => <li key={i}><BookCardSkeleton /></li>)}
            </Box>
          )}
          {loadingMore && books.length > 0 && (
            <Box component="ul" aria-hidden="true" sx={{ listStyle: "none", m: 0, mt: 4, p: 0, display: "grid", gap: { xs: "32px 16px", md: "48px 28px" }, gridTemplateColumns: { xs: "repeat(2, minmax(0,1fr))", sm: "repeat(3, minmax(0,1fr))", md: "repeat(4, minmax(0,1fr))" } }}>
              {Array.from({ length: Math.min(PER_PAGE, Math.max(1, (total || PER_PAGE) - books.length)) }).map((_, i) => <li key={i}><BookCardSkeleton /></li>)}
            </Box>
          )}
          {!isLoading && pages && books.length === 0 && (
            <Box sx={{ textAlign: "center", py: { xs: 6, md: 9 }, px: 3, borderRadius: 6, border: `1px solid ${kp.p.border}`, bgcolor: kp.p.surface, boxShadow: kp.shadows.card }}>
              <SearchOffOutlined aria-hidden="true" sx={{ fontSize: 56, color: kp.p.textSecondary }} />
              <Typography variant="h3" component="p" sx={{ mt: 2 }}>{T("Ничего не найдено")}</Typography>
              <Typography sx={{ mt: 1, color: kp.p.textSecondary }}>{T("Попробуйте изменить запрос или сбросить фильтры")}</Typography>
              <Button variant="contained" size="large" onClick={handleReset} sx={{ mt: 3 }}>{T("Сбросить фильтры")}</Button>
            </Box>
          )}
        </Box>
      )}
      {!error && hasMore && <Box ref={sentinelRef} aria-hidden="true" sx={{ height: "1px" }} />}
      {!error && hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", my: { xs: 4, md: 5 } }}>
          <Button variant="outlined" size="large" onClick={() => loadMore(true)} disabled={!!loadingMore}>
            {T("Загрузить ещё")}
          </Button>
        </Box>
      )}
    </>
  );
};

export default BooksSection;
