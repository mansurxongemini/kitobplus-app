import React from "react";
import { Alert, Box, Button, Typography, useTheme } from "@mui/material";
import SearchOffOutlined from "@mui/icons-material/SearchOffOutlined";
import useSWR from "swr";
import { getHost } from "../lib/api";
import { BookGrid } from "../ds/components/BookCard";
import BooksPagination from "./BooksPagination";
import Filter from "../parts/Filter";
import { announce } from "../lib/a11y";
import T, { tr } from "../lib/translator";

const PER_PAGE = 12;

const fetcher = (url) => fetch(url).then((res) => res.json());

const buildUrl = ({ table, persons_id, sort, page, filters }) =>
  getHost() +
  "/srv/books.php?" +
  (table === "authors" && persons_id ? "authors_id=" + persons_id + "&" : "") +
  (table === "dictors" && persons_id ? "dictors_id=" + persons_id + "&" : "") +
  (table === "genres" && persons_id ? "genres_id=" + persons_id + "&" : "") +
  "sort=" +
  sort +
  "&page=" +
  (page - 1) +
  "&per_page=" +
  PER_PAGE +
  (filters.length > 0 ? "&" + filters.join("&") : "");

// Results section: search (internal only when no external filter is given, so
// person/Person.jsx keeps working), grid of cards, pagination, empty and error
// states. Always grid — the old list/grid toggle is dropped.
const BooksSection = ({
  selectedGenres,
  sort = "new",
  table,
  persons_id,
  filter: externalFilter,
  onTotal,
  onResetFilters,
}) => {
  const { kp } = useTheme();
  const [internalFilter, setInternalFilter] = React.useState("");
  const filter = externalFilter !== undefined ? externalFilter : internalFilter;
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState([]);
  const genresKey = React.useMemo(
    () => [...(selectedGenres || [])].sort((a, b) => a - b).join(","),
    [selectedGenres]
  );
  const announcedRef = React.useRef("");

  React.useEffect(() => {
    const f = [];
    if (genresKey) {
      f.push("genres_id[]=" + genresKey.split(",").join(",genres_id[]="));
    }
    if (filter.trim() !== "") {
      f.push("filter=" + encodeURIComponent(filter.trim()));
    }
    setPage(1);
    setFilters(f);
  }, [filter, genresKey]);

  const { data, error, isLoading, mutate } = useSWR(
    buildUrl({ table, persons_id, sort, page, filters }),
    fetcher
  );

  React.useEffect(() => {
    setPage(1);
  }, [sort]);

  const total = data && typeof data.total !== "undefined" ? Number(data.total) : null;
  const books = data && data.data;
  const pagesCount = total === null ? 1 : Math.max(1, Math.ceil(total / PER_PAGE));

  React.useEffect(() => {
    if (!data || total === null) return;
    if (onTotal) onTotal(total);
    // Announce the result count after every load (search, sort, genre, page).
    const msg = `${tr("Найдено книг")}: ${total}`;
    const key = `${msg}|${sort}|${page}|${filter}|${genresKey}`;
    if (announcedRef.current !== key) {
      announcedRef.current = key;
      announce(msg);
    }
  }, [data, total, sort, page, filter, genresKey, onTotal]);

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      setInternalFilter("");
    }
  };

  return (
    <>
      {externalFilter === undefined && <Filter value={internalFilter} onChange={setInternalFilter} />}

      {error ? (
        <Alert
          role="alert"
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => mutate()}>
              {T("Обновить")}
            </Button>
          }
          sx={{ mt: 3 }}
        >
          {T("Не удалось загрузить список книг")}
        </Alert>
      ) : (
        <Box
          id="books-results"
          role="tabpanel"
          aria-labelledby={externalFilter !== undefined ? `books-sort-${sort}` : undefined}
          aria-busy={isLoading || !data ? "true" : undefined}
          aria-label={`${T("Найдено книг")}${total === null ? "" : `: ${total}`}`}
          sx={{ mt: { xs: 3, md: 4 }, scrollMarginTop: 90 }}
        >
          <BookGrid
            books={books}
            loading={isLoading || !data}
            count={PER_PAGE}
            columns={{ xs: 2, sm: 3, md: 4, lg: 4 }}
          />
          {!isLoading && data && (!books || books.length === 0) && (
            <Box
              sx={{
                textAlign: "center",
                py: { xs: 6, md: 9 },
                px: 3,
                borderRadius: 6,
                border: `1px solid ${kp.p.border}`,
                bgcolor: kp.p.surface,
                boxShadow: kp.shadows.card,
              }}
            >
              <SearchOffOutlined aria-hidden="true" sx={{ fontSize: 56, color: kp.p.textSecondary }} />
              <Typography variant="h3" component="p" sx={{ mt: 2 }}>
                {T("Ничего не найдено")}
              </Typography>
              <Typography sx={{ mt: 1, color: kp.p.textSecondary }}>
                {T("Попробуйте изменить запрос или сбросить фильтры")}
              </Typography>
              <Button variant="contained" size="large" onClick={handleReset} sx={{ mt: 3 }}>
                {T("Сбросить фильтры")}
              </Button>
            </Box>
          )}
        </Box>
      )}

      {!error && <BooksPagination pagesCount={pagesCount} page={page} setPage={setPage} />}
    </>
  );
};

export default BooksSection;
