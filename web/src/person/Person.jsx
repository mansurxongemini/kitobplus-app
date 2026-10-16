import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Pagination, Alert, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import PageShell from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import { BookGrid } from "../ds/components/BookCard";
import PersonBanner from "./PersonBanner";
import { get } from "../lib/person";
import { getHost } from "../lib/api";
import { getPaginationItemAriaLabel } from "../lib/a11y";
import T from "../lib/translator";

const PER_PAGE = 12;
const fetchJson = (url) => fetch(url).then((res) => res.json());

const buildBooksUrl = (table, id, sort, page) => {
  const param =
    table === "authors"
      ? "authors_id"
      : table === "dictors"
      ? "dictors_id"
      : "genres_id";
  return `${getHost()}/srv/books.php?${param}=${id}&sort=${sort}&page=${page - 1}&per_page=${PER_PAGE}`;
};

const Person = () => {
  const { table = "authors", id } = useParams();
  const { kp } = useTheme();

  const [personData, setPersonData] = useState(null);
  const [personLoading, setPersonLoading] = useState(true);
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    if (table && id) {
      setPersonLoading(true);
      get(table, id)
        .then((data) => {
          if (active) {
            setPersonData(data);
          }
        })
        .catch((err) => {
          console.error("Error fetching person:", err);
        })
        .finally(() => {
          if (active) setPersonLoading(false);
        });
    }
    return () => {
      active = false;
    };
  }, [table, id]);

  const { data: booksData, error: booksError, isLoading: booksLoading } = useSWR(
    table && id ? buildBooksUrl(table, id, sort, page) : null,
    fetchJson
  );

  const books = booksData && booksData.data;
  const total = booksData && booksData.total !== undefined ? Number(booksData.total) : null;
  const totalPages = total === null ? 1 : Math.max(1, Math.ceil(total / PER_PAGE));

  const pageTitle = (personData && (personData.name || personData.title)) || T("Аудиокниги");

  return (
    <PageShell title={pageTitle}>
      <PersonBanner
        userData={personData}
        table={table}
        id={id}
        loading={personLoading}
      />

      <Container sx={{ py: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h2" component="h2">
            {T("Книги")}
          </Typography>
          <Tabs
            value={sort}
            onChange={(_, v) => {
              setSort(v);
              setPage(1);
            }}
            aria-label={T("Подборка книг")}
          >
            <Tab label={T("Последние")} value="new" />
            <Tab label={T("Популярные")} value="popular" />
          </Tabs>
        </Box>

        {booksError && (
          <Alert severity="error" role="alert" sx={{ mb: 4 }}>
            {T("Ошибка")}
          </Alert>
        )}

        <Box
          role="region"
          aria-label={`${T("Книги")}${total !== null ? `: ${total}` : ""}`}
          aria-busy={booksLoading ? "true" : undefined}
        >
          <BookGrid
            books={books}
            loading={booksLoading}
            count={PER_PAGE}
            columns={{ xs: 2, sm: 3, md: 4, lg: 4 }}
          />
        </Box>

        {!booksLoading && books && books.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 6, md: 8 },
              px: 3,
              borderRadius: 5,
              border: `1px solid ${kp.p.border}`,
              bgcolor: kp.p.surface,
              boxShadow: kp.shadows.card,
            }}
          >
            <Typography variant="h3" component="p">
              {T("Пусто")}
            </Typography>
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 5, md: 7 } }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => {
                setPage(v);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              getItemAriaLabel={getPaginationItemAriaLabel(T)}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </PageShell>
  );
};

export default Person;
