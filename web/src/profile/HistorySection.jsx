import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { BookGrid } from "../ds/components/BookCard";
import { getHost } from "../lib/api";
import T from "../lib/translator.js";

// "Tinglash tarixi": books the user started listening to. Same books.php
// endpoint with the existing realm=listened parameter — no new API.
const HistorySection = () => {
  const [books, setBooks] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${getHost()}/srv/books.php?realm=listened&sort=new&page=0&per_page=12`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setBooks((json && json.data) || []);
      })
      .catch(() => {
        if (!cancelled) setBooks([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box
      component="section"
      aria-labelledby="profile-history-title"
      aria-busy={books === null ? "true" : undefined}
    >
      <Typography id="profile-history-title" variant="h3" component="h2" sx={{ mb: 3 }}>{T("История прослушивания")}</Typography>
      {books !== null && books.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>{T("История прослушивания пуста")}</Typography>
      ) : (
        <BookGrid
          books={books}
          loading={books === null}
          columns={{ xs: 2, sm: 3, md: 3, lg: 3 }}
          label={T("История прослушивания")}
        />
      )}
    </Box>
  );
};

export default HistorySection;
