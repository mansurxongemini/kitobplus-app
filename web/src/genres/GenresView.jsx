import React, { useState } from "react";
import { Box, Typography, Skeleton, Alert, useTheme } from "@mui/material";
import AutoStoriesOutlined from "@mui/icons-material/AutoStoriesOutlined";
import { Link as RouterLink } from "react-router-dom";
import useSWR from "swr";
import Container from "../ds/components/Container";
import { getHost } from "../lib/api";
import T from "../lib/translator";

const fetchJson = (url) => fetch(url).then((r) => r.json());

const GenreTile = ({ genre }) => {
  const { kp } = useTheme();
  const [imgFailed, setImgFailed] = useState(false);
  const iconSrc = `${getHost()}/pics/genres.flat/${genre.id}.png`;

  return (
    <Box
      component={RouterLink}
      to={`/person/genres/${genre.id}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2.5,
        minHeight: 112,
        borderRadius: 4,
        textDecoration: "none",
        bgcolor: kp.p.surface,
        border: `1px solid ${kp.p.border}`,
        color: kp.p.text,
        boxShadow: kp.shadows.card,
        transition: "transform .25s, box-shadow .25s, border-color .25s",
        "&:hover": {
          transform: kp.isContrast ? "none" : "translateY(-3px)",
          boxShadow: kp.shadows.raised,
          borderColor: kp.p.primary,
        },
        "&:focus-visible": {
          outline: `3px solid ${kp.p.focus}`,
          outlineOffset: 3,
        },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 56,
          height: 56,
          borderRadius: 3,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          bgcolor: kp.isContrast ? "transparent" : kp.p.primarySoft,
          color: kp.p.onPrimarySoft,
          border: kp.isContrast ? `2px solid ${kp.p.border}` : "none",
          overflow: "hidden",
        }}
      >
        {!imgFailed ? (
          <Box
            component="img"
            src={iconSrc}
            alt=""
            onError={() => setImgFailed(true)}
            sx={{ width: 34, height: 34, objectFit: "contain", display: "block" }}
          />
        ) : (
          <AutoStoriesOutlined sx={{ fontSize: 28 }} />
        )}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontFamily: "'Manrope Variable', sans-serif",
            fontWeight: 700,
            fontSize: "1.125rem",
            lineHeight: 1.3,
            color: kp.p.text,
          }}
        >
          {genre.name}
        </Typography>
        {genre.books_count && (
          <Typography
            variant="body2"
            sx={{
              color: kp.p.textSecondary,
              mt: 0.5,
              fontSize: "0.9375rem",
            }}
          >
            {parseInt(genre.books_count, 10).toLocaleString("ru-RU")} {T("книг (число)")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const GenresView = () => {
  const { data, error, isLoading } = useSWR(`${getHost()}/srv/genres.php?sort=popular`, fetchJson);
  const genres = (data && data.data) || [];

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      {error && (
        <Alert severity="error" role="alert" sx={{ mb: 4 }}>
          {T("Ошибка")}
        </Alert>
      )}
      <Box
        component="ul"
        aria-label={T("Жанры")}
        aria-busy={isLoading ? "true" : undefined}
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <li key={i}>
                <Skeleton variant="rounded" height={112} sx={{ borderRadius: 4 }} />
              </li>
            ))
          : genres.map((genre) => (
              <li key={genre.id}>
                <GenreTile genre={genre} />
              </li>
            ))}
      </Box>
    </Container>
  );
};

export default GenresView;
