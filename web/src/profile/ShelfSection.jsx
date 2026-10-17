import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { BookGrid } from "../ds/components/BookCard";
import { getHost, getToken } from "../lib/api";
import T from "../lib/translator.js";
import emptyShelfImg from "../img/empty_shelf.svg";

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
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 6, md: 8 },
            px: 3,
            borderRadius: 5,
            border: (theme) => `1px dashed ${theme.palette.divider}`,
            bgcolor: (theme) => theme.palette.background.paper,
          }}
        >
          <Box
            component="img"
            src={emptyShelfImg}
            alt=""
            aria-hidden="true"
            sx={{ width: { xs: 140, md: 180 }, height: "auto", mx: "auto", mb: 2, display: "block" }}
          />
          <Typography variant="h4" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
            {T("Книжная полка пуста")}
          </Typography>
        </Box>
      ) : (
        <BookGrid books={books} loading={books === null} columns={{ xs: 2, sm: 3, md: 3, lg: 3 }} label={T("Книжная полка")} />
      )}
    </Box>
  );
};
export default ShelfSection;
