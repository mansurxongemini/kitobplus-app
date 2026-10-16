import React from "react";
import { Box, TextField, Typography, InputAdornment, useTheme } from "@mui/material";
import Search from "@mui/icons-material/Search";
import { useDebounce } from "use-debounce";
import T from "../lib/translator";

// Large labeled search field with debounced updates.
// Supports the new {value, onChange} contract and the legacy {filter, setFilter}
// contract used by persons/PersonsSection.jsx.
const Filter = ({ filter, setFilter, value, onChange }) => {
  const { kp } = useTheme();
  const controlled = value !== undefined ? value : filter;
  const emit = onChange ?? setFilter ?? (() => {});
  const [raw, setRaw] = React.useState(controlled ?? "");
  const [debounced] = useDebounce(raw, 500);
  const lastEmitted = React.useRef(controlled ?? "");
  const emitRef = React.useRef(emit);
  emitRef.current = emit;
  const fieldId = React.useId();

  React.useEffect(() => {
    if (debounced !== lastEmitted.current) {
      lastEmitted.current = debounced;
      emitRef.current(debounced);
    }
  }, [debounced]);

  // Follow external resets (e.g. the "reset filters" button).
  React.useEffect(() => {
    const next = controlled ?? "";
    if (next !== raw && next !== lastEmitted.current) {
      lastEmitted.current = next;
      setRaw(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled]);

  return (
    <Box
      component="form"
      role="search"
      aria-label={T("Поиск")}
      onSubmit={(e) => e.preventDefault()}
      sx={{ width: "100%" }}
    >
      <Typography
        component="label"
        htmlFor={fieldId}
        sx={{ display: "block", fontWeight: 600, mb: 1, fontSize: "1.0625rem" }}
      >
        {T("Найдите книгу, автора или диктора")}
      </Typography>
      <TextField
        id={fieldId}
        type="search"
        fullWidth
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={T("Например, «O‘tkan kunlar»")}
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search aria-hidden="true" sx={{ color: kp.p.textSecondary }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default Filter;
