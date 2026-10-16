import React, { useState, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";
import { BookGrid } from "../ds/components/BookCard";
import { SectionHeader } from "../ds/components/PageShell";
import { getHost } from "../lib/api.js";
import T from "../lib/translator.js";

const Recommendations = ({ book }) => {
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    if (!book) {
      setRecommendations([]);
      return;
    }
    let cancelled = false;
    setRecommendations(null);
    fetch(getHost() + `/srv/books.php?recommendations=${book}`)
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setRecommendations(data && data.success && Array.isArray(data.data) ? data.data.slice(0, 6) : []);
        }
      })
      .catch(() => {
        if (!cancelled) setRecommendations([]);
      });
    return () => {
      cancelled = true;
    };
  }, [book]);

  if (recommendations !== null && recommendations.length === 0) return null;

  return (
    <Box component="section" aria-labelledby="book-similar-title" aria-busy={recommendations === null ? "true" : undefined} sx={{ mt: { xs: 6, md: 9 } }}>
      <SectionHeader
        id="book-similar-title"
        title={T("Похожие книги")}
        linkTo="/books"
        linkLabel={T("Все книги")}
      />
      {recommendations === null ? (
        <Box aria-hidden="true" sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(6, 1fr)" } }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={280} sx={{ borderRadius: 4 }} />
          ))}
        </Box>
      ) : (
        <BookGrid books={recommendations} columns={{ xs: 2, sm: 3, md: 4, lg: 6 }} label={T("Похожие книги")} />
      )}
    </Box>
  );
};

export default Recommendations;
