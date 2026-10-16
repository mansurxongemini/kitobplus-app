import React from "react";
import { Box, Button, Skeleton, Typography, useTheme } from "@mui/material";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { getHost } from "../lib/api";
import { VisuallyHidden } from "../lib/a11y";
import T from "../lib/translator";

// Genre filter as toggle chips. Selection state is announced as pressed / not
// pressed, never by colour alone.
const GenresSelector = ({ selectedGenres, setSelectedGenres }) => {
  const { kp } = useTheme();
  const [genres, setGenres] = React.useState(null);

  React.useEffect(() => {
    fetch(getHost() + "/srv/genres.php")
      .then((result) => result.json())
      .then((json) => setGenres(json.data || []))
      .catch(() => setGenres([]));
  }, []);

  const toggle = (genreId) => {
    setSelectedGenres((prevSet) => {
      const next = new Set(prevSet);
      if (next.has(genreId)) {
        next.delete(genreId);
      } else {
        next.add(genreId);
      }
      return next;
    });
  };

  if (genres !== null && genres.length === 0) return null;

  return (
    <Box component="section" aria-labelledby="books-genres-title" sx={{ mt: { xs: 4, md: 5 } }}>
      <Typography id="books-genres-title" variant="h2" sx={{ fontSize: "1.375rem", mb: 2 }}>
        {T("Жанры")}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {!genres &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={120} height={48} sx={{ borderRadius: 999 }} />
          ))}
        {(genres || []).map((genre) => {
          const selected = !!selectedGenres && selectedGenres.has(genre.id);
          return (
            <Button
              key={genre.id}
              variant={selected ? "contained" : "outlined"}
              size="large"
              aria-pressed={selected}
              onClick={() => toggle(genre.id)}
              startIcon={selected ? <CheckRounded aria-hidden="true" /> : null}
              sx={{
                borderWidth: 2,
                ...(selected
                  ? {}
                  : {
                      borderColor: kp.p.borderStrong,
                      color: kp.p.text,
                      "&:hover": { borderWidth: 2, borderColor: kp.p.text },
                    }),
              }}
            >
              {genre.name}
              {genre.books_count ? (
                <VisuallyHidden>
                  {` — ${genre.books_count} ${T("книг (число)")}`}
                </VisuallyHidden>
              ) : null}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default GenresSelector;
