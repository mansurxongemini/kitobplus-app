import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useSWR from "swr";
import { LazyShelf } from "../ds/components/Shelf";
import Container from "../ds/components/Container";
import { getHost, getToken } from "../lib/api";
import { announce } from "../lib/a11y";
import T, { tr } from "../lib/translator";

const fetchJson = (url) => fetch(url).then((r) => r.json());
const INITIAL = 4;
const BATCH = 3;

const booksUrl = (params) => `${getHost()}/srv/books.php?${params}`;

// Endless home feed: descriptors are shown in batches; a sentinel adds the
// next batch and the manual button does the same (and moves focus).
const Feed = ({ promos = {} }) => {
  const { kp } = useTheme();
  const token = getToken();
  const { data: genresData } = useSWR(`${getHost()}/srv/genres.php`, fetchJson);
  const { data: authorsData } = useSWR(`${getHost()}/srv/persons.php?table=authors`, fetchJson);
  const { data: dictorsData } = useSWR(`${getHost()}/srv/persons.php?table=dictors`, fetchJson);

  // Titles are built during render so T() reads the current language.
  const descriptors = React.useMemo(() => {
    const list = [];
    if (token) {
      list.push({ key: "continue", title: T("Продолжить прослушивание"), to: "/profile", variant: "progress", count: 10, url: booksUrl(`realm=listened&token=${encodeURIComponent(token)}&page=0&per_page=10`) });
    }
    list.push({ key: "new", title: T("Новые поступления"), to: "/books?sort=new", count: 10, url: booksUrl("sort=new&page=0&per_page=10") });
    list.push({ key: "top", title: T("Топ-10 недели"), to: "/books?sort=popular", variant: "ranked", count: 10, url: booksUrl("sort=popular&page=0&per_page=10") });
    // «О нас» (#about) — в первой порции ленты, чтобы ссылка /#about всегда находила блок.
    if (promos.about) list.push({ key: "promo-about", type: "promo", node: promos.about });
    if (promos.join) list.push({ key: "promo-join", type: "promo", node: promos.join });
    if (token) {
      list.push({ key: "bookshelf", title: T("Ваша книжная полка"), to: "/profile", count: 10, url: booksUrl(`realm=bookshelf&token=${encodeURIComponent(token)}&page=0&per_page=10`) });
    }
    const genres = [...((genresData && genresData.data) || [])]
      .filter((g) => Number(g.books_count) > 0)
      .sort((a, b) => Number(b.books_count) - Number(a.books_count));
    // Промо-блок «Доступность» — между жанрами (после четвёртого), как баннеры в ленте.
    genres.forEach((g, i) => {
      list.push({ key: `genre-${g.id}`, title: g.name, to: `/books/genres/${g.id}`, count: 10, url: booksUrl(`genres_id[]=${g.id}&sort=new&page=0&per_page=10`) });
      if (i === 3 && promos.access) list.push({ key: "promo-access", type: "promo", node: promos.access });
    });
    if (genres.length <= 3 && promos.access) list.push({ key: "promo-access", type: "promo", node: promos.access });
    const authorsLabel = T("произведения");
    ((authorsData && authorsData.data) || []).filter((a) => Number(a.books_count) >= 2).slice(0, 6).forEach((a) => {
      list.push({ key: `author-${a.id}`, title: `${a.name} ${authorsLabel}`, to: `/person/authors/${a.id}`, count: 10, url: booksUrl(`authors_id=${a.id}&sort=new&page=0&per_page=10`) });
    });
    const readsLabel = T("Читает");
    ((dictorsData && dictorsData.data) || []).filter((d) => Number(d.books_count) >= 2).slice(0, 6).forEach((d) => {
      list.push({ key: `dictor-${d.id}`, title: `${d.name} ${readsLabel.toLowerCase()}`, to: `/person/dictors/${d.id}`, count: 10, url: booksUrl(`dictors_id=${d.id}&sort=new&page=0&per_page=10`) });
    });
    if (promos.news) list.push({ key: "promo-news", type: "promo", node: promos.news });
    list.push({ key: "rand", title: T("Случайный выбор"), to: "/books?sort=rand", count: 10, url: booksUrl("sort=rand&page=0&per_page=10") });
    list.push({ key: "end", type: "end" });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, genresData, authorsData, dictorsData, promos.about, promos.join, promos.access, promos.news]);

  const [visible, setVisible] = React.useState(INITIAL);
  const sentinelRef = React.useRef(null);
  const focusFromRef = React.useRef(null);
  const visibleRef = React.useRef(INITIAL);
  visibleRef.current = visible;
  const total = descriptors.length;
  const hasMore = visible < total;

  const loadMore = React.useCallback((manual) => {
    const prev = visibleRef.current;
    if (prev >= total) return;
    const added = Math.min(BATCH, total - prev);
    if (manual) focusFromRef.current = prev;
    announce(`${added} ${tr("новых полок")}`);
    visibleRef.current = prev + added;
    setVisible(prev + added);
  }, [total]);

  // Sentinel: auto-append the next batch; focus never moves.
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
  }, [hasMore, loadMore, visible]);

  // After a manual load, focus the first new shelf heading.
  React.useEffect(() => {
    if (focusFromRef.current === null || focusFromRef.current === undefined) return;
    const from = focusFromRef.current;
    if (visible <= from) return;
    focusFromRef.current = null;
    const t = window.setTimeout(() => {
      const wrap = document.querySelector(`[data-feed-index="${from}"]`);
      const heading = wrap && wrap.querySelector("h2, h3");
      if (heading) {
        if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: false });
      } else if (wrap) {
        wrap.setAttribute("tabindex", "-1");
        wrap.focus({ preventScroll: false });
      }
    }, 50);
    return () => window.clearTimeout(t);
  }, [visible]);

  const shown = descriptors.slice(0, visible);

  return (
    <Box>
      {shown.map((d, i) => (
        <Box key={d.key} data-feed-index={i}>
          {d.type === "promo" ? d.node : d.type === "end" ? (
            <Container sx={{ py: { xs: 5, md: 7 }, textAlign: "center" }}>
              <Typography component="h2" tabIndex={-1} sx={{ fontFamily: kp.fonts.heading, fontWeight: 700, fontSize: "1.5rem", "&:focus": { outline: "none" } }}>
                {T("Вы посмотрели все полки")}
              </Typography>
              <Button component={RouterLink} to="/books" variant="contained" size="large" sx={{ mt: 3 }}>
                {T("Открыть каталог")}
              </Button>
            </Container>
          ) : (
            <Container><LazyShelf descriptor={d} /></Container>
          )}
        </Box>
      ))}
      {hasMore && <Box ref={sentinelRef} aria-hidden="true" sx={{ height: "1px" }} />}
      {hasMore && (
        <Container sx={{ py: 3, textAlign: "center" }}>
          <Button variant="outlined" size="large" onClick={() => loadMore(true)}>
            {T("Показать ещё")}
          </Button>
        </Container>
      )}
    </Box>
  );
};

export default Feed;
