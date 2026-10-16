import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Shelf from "../ds/components/Shelf";
import { getHost, getToken } from "../lib/api";
import T from "../lib/translator.js";

const HistorySection = () => {
  const [books, setBooks] = useState(null);
  useEffect(() => {
    const token = getToken();
    if (!token) { setBooks([]); return undefined; }
    let cancelled = false;
    fetch(`${getHost()}/srv/books.php?realm=listened&token=${encodeURIComponent(token)}&page=0&per_page=12`)
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setBooks((json && json.data) || []); })
      .catch(() => { if (!cancelled) setBooks([]); });
    return () => { cancelled = true; };
  }, []);
  if (books !== null && books.length === 0) {
    return (
      <Box component="section" aria-labelledby="profile-history-title">
        <Typography id="profile-history-title" variant="h3" component="h2" sx={{ mb: 3 }}>{T("История прослушивания")}</Typography>
        <Typography sx={{ color: "text.secondary" }}>{T("История прослушивания пуста")}</Typography>
      </Box>
    );
  }
  return (
    <Shelf id="profile-history-title" title={T("История прослушивания")} books={books || []} loading={books === null} variant="progress" count={12} />
  );
};
export default HistorySection;
