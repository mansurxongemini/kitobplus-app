import React from "react";
import { Box, Pagination } from "@mui/material";
import { getPaginationItemAriaLabel } from "../lib/a11y";
import T from "../lib/translator";

const BooksPagination = ({ page, setPage, pagesCount }) => {
  const itemAriaLabel = getPaginationItemAriaLabel(T);

  if (!pagesCount || pagesCount <= 1) return null;

  const handlePageChange = (_, next) => {
    setPage(next);
    // Bring keyboard and screen-reader users back to the top of the results.
    requestAnimationFrame(() => {
      document.getElementById("books-results")?.scrollIntoView({ block: "start" });
    });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: { xs: 4, md: 5 } }}>
      <Pagination
        count={pagesCount}
        page={page}
        onChange={handlePageChange}
        size="large"
        showFirstButton
        showLastButton
        getItemAriaLabel={itemAriaLabel}
      />
    </Box>
  );
};

export default BooksPagination;
