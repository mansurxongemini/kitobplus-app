import React from "react";
import { Box } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import PageShell, { PageHeader } from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import Filter from "../parts/Filter";
import BooksViewParams from "./BooksViewParams";
import GenresSelector from "./GenresSelector";
import BooksSection from "./BooksSeciton";
import T from "../lib/translator";

// Catalog: /books and /books/:table/:id. The home hero links here with ?q=...,
// so the search field reads its initial value from the URL and keeps it there.
const Books = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = React.useState(() => searchParams.get("q") || "");
  const [sort, setSort] = React.useState(() => { const v = searchParams.get("sort"); return ["new", "popular", "rand"].includes(v) ? v : "new"; });
  const [selectedGenres, setSelectedGenres] = React.useState(
    () => (params.table === "genres" && params.id ? new Set([Number(params.id)]) : new Set())
  );
  const [total, setTotal] = React.useState(null);

  const handleQueryChange = (next) => {
    setQuery(next);
    const sp = new URLSearchParams(searchParams);
    if (next.trim()) {
      sp.set("q", next.trim());
    } else {
      sp.delete("q");
    }
    setSearchParams(sp, { replace: true });
  };

  const resetAll = () => {
    handleQueryChange("");
    setSort("new");
    setSelectedGenres(new Set());
  };

  return (
    <PageShell title={T("Аудиокниги")}>
      <PageHeader
        title={T("Аудиокниги")}
        subtitle={total === null ? undefined : `${T("Найдено книг")}: ${total}`}
        crumbs={[{ label: T("Аудиокниги") }]}
      />
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Filter value={query} onChange={handleQueryChange} />
        <Box sx={{ mt: 3 }}>
          <BooksViewParams value={sort} onChange={setSort} />
        </Box>
        <GenresSelector selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
        <BooksSection
          selectedGenres={selectedGenres}
          sort={sort}
          filter={query}
          table={params.table !== "genres" ? params.table : undefined}
          persons_id={params.table !== "genres" ? params.id : undefined}
          onTotal={setTotal}
          onResetFilters={resetAll}
        />
      </Container>
    </PageShell>
  );
};

export default Books;
