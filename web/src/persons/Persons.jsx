import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Skeleton,
  Alert,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "react-router-dom";
import PageShell, { PageHeader } from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import PersonCard from "./PersonCard";
import { getPersons } from "../lib/persons";
import { getPaginationItemAriaLabel } from "../lib/a11y";
import T, { tr } from "../lib/translator";

const PER_PAGE = 12;

const Persons = () => {
  const { table = "authors" } = useParams();
  const { kp } = useTheme();
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const title = table === "dictors" ? T("Дикторы") : T("Авторы");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setPage(1);
    getPersons(table, "popular")
      .then((res) => {
        if (active) {
          if (res && res.data) {
            setPersons(res.data);
          } else {
            setError(tr("Ошибка"));
          }
        }
      })
      .catch((err) => {
        if (active) setError(err.message || tr("Ошибка"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [table]);

  const filtered = useMemo(() => {
    if (!query.trim()) return persons;
    const q = query.toLowerCase().trim();
    return persons.filter((p) => {
      const n = (p.name || "").toLowerCase();
      const a = (p.annotation || "").toLowerCase();
      return n.includes(q) || a.includes(q);
    });
  }, [persons, query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const startIndex = (page - 1) * PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + PER_PAGE);

  return (
    <PageShell title={title}>
      <PageHeader title={title} crumbs={[{ label: title }]} />
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          component="form"
          role="search"
          aria-label={T("Поиск")}
          onSubmit={(e) => e.preventDefault()}
          sx={{ maxWidth: 600, mb: { xs: 4, md: 5 } }}
        >
          <Typography
            component="label"
            htmlFor="persons-search-input"
            sx={{ display: "block", fontWeight: 600, mb: 1, fontSize: "1.0625rem" }}
          >
            {T("Поиск")}
          </Typography>
          <TextField
            id="persons-search-input"
            type="search"
            fullWidth
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={title}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon aria-hidden="true" sx={{ color: kp.p.textSecondary }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" role="alert" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && filtered.length === 0 && (
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

        <Box
          component="ul"
          aria-label={title}
          aria-busy={loading ? "true" : undefined}
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <li key={i}>
                  <Skeleton variant="rounded" height={160} sx={{ borderRadius: 5 }} />
                </li>
              ))
            : pageItems.map((person) => (
                <li key={person.id}>
                  <PersonCard person={person} table={table} headingLevel="h2" />
                </li>
              ))}
        </Box>

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

export default Persons;
