import React from "react";
import { Tabs, Tab } from "@mui/material";
import T from "../lib/translator";

const OPTIONS = [
  { value: "new", label: "Последние" },
  { value: "popular", label: "Популярные" },
];

// Sort control rendered as accessible Tabs. Keeps the legacy
// {selectedFilter, setSelectedFilter} contract working.
const BooksViewParams = ({ value, onChange, selectedFilter, setSelectedFilter }) => {
  const current = value ?? selectedFilter ?? "new";
  const emit = onChange ?? setSelectedFilter ?? (() => {});

  return (
    <Tabs
      value={OPTIONS.some((o) => o.value === current) ? current : "new"}
      onChange={(_, v) => {
        if (v) emit(v);
      }}
      aria-label={T("Сортировка книг")}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      {OPTIONS.map((o) => (
        <Tab
          key={o.value}
          value={o.value}
          label={T(o.label)}
          id={`books-sort-${o.value}`}
          aria-controls="books-results"
        />
      ))}
    </Tabs>
  );
};

export default BooksViewParams;
