import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { BookGrid } from "../ds/components/BookCard";
import { getHost, getToken } from "../lib/api";
import T from "../lib/translator.js";

const ShelfSection = () => {
  const [books, setBooks] = useState(null);
  useEffect(() => {
    const token = getToken();
    if (!token) { setBooks([]); return undefined; }
    let cancelled = false;
    fetch(`${getHost()}/srv/books.php?realm=bookshelf&token=${encodeURIComponent(token)}&page=0&per_page=12`)
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setBooks((json && json.data) || []); })
      .catch(() => { if (!cancelled) setBooks([]); });
    return () => { cancelled = true; };
  }, []);
  return (
    <Box component="section" aria-labelledby="profile-shelf-title" aria-busy={books === null ? "true" : undefined}>
      <Typography id="profile-shelf-title" variant="h3" component="h2" sx={{ mb: 3 }}>{T("Книжная полка")}</Typography>
      {books !== null && books.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>{T("Книжная полка пуста")}</Typography>
      ) : (
        <BookGrid books={books} loading={books === null} columns={{ xs: 2, sm: 3, md: 3, lg: 3 }} label={T("Книжная полка")} />
      )}
    </Box>
  );
};
export default ShelfSection;
