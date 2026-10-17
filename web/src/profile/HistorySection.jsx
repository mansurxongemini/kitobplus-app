import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Shelf from "../ds/components/Shelf";
import { getHost, getToken } from "../lib/api";
import T from "../lib/translator.js";
import emptyShelfImg from "../img/empty_shelf.svg";

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
            {T("История прослушивания пуста")}
          </Typography>
        </Box>
      </Box>
    );
  }
  return (
    <Shelf id="profile-history-title" title={T("История прослушивания")} books={books || []} loading={books === null} variant="progress" count={12} />
  );
};
export default HistorySection;
