import React, { useState, useEffect } from "react";
import { Box, Typography, Skeleton, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { list } from "../lib/news";
import { getHost } from "../lib/api";
import T from "../lib/translator";

export const NewsCard = ({ item, headingLevel = "h3" }) => {
  const { kp } = useTheme();

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3.5,
        borderRadius: 5,
        bgcolor: kp.p.surface,
        border: `1px solid ${kp.p.border}`,
        boxShadow: kp.shadows.card,
        transition: "box-shadow .25s, transform .25s, border-color .25s",
        "&:hover": {
          boxShadow: kp.shadows.raised,
          transform: kp.isContrast ? "none" : "translateY(-3px)",
          borderColor: kp.p.primary,
        },
        "&:focus-within": {
          outline: `3px solid ${kp.p.focus}`,
          outlineOffset: 3,
        },
      }}
    >
      {item.pics_ext && (
        <Box
          sx={{
            mb: 2.5,
            borderRadius: 3,
            overflow: "hidden",
            height: 180,
            bgcolor: kp.p.surfaceSunken,
            border: kp.isContrast ? `1px solid ${kp.p.border}` : "none",
          }}
        >
          <Box
            component="img"
            src={`${getHost()}/pics/news/${item.id}.${item.pics_ext}`}
            alt=""
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => {
              e.currentTarget.parentElement.style.display = "none";
            }}
          />
        </Box>
      )}

      <Typography component="p" variant="body2" sx={{ color: kp.p.textSecondary, mb: 1.25 }}>
        <time dateTime={String(item.datetime || "").replace(" ", "T")}>
          {item.datetime_str || item.datetime}
        </time>
      </Typography>

      <Typography
        component={headingLevel}
        sx={{
          fontFamily: "'Manrope Variable', sans-serif",
          fontWeight: 700,
          fontSize: "1.25rem",
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
          m: 0,
        }}
      >
        <Box
          component={RouterLink}
          to={`/news/${item.id}`}
          sx={{
            color: kp.p.text,
            textDecoration: "none",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            "&::after": { content: '""', position: "absolute", inset: 0, zIndex: 1 },
            "&:focus-visible": { outline: "none", boxShadow: "none" },
            "&:hover": { textDecoration: kp.isContrast ? "underline" : "none" },
          }}
        >
          {item.subject}
        </Box>
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 1.5,
          color: kp.p.textSecondary,
          lineHeight: 1.6,
          fontSize: "0.9375rem",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {String(item.body || "").replace(/<[^>]+>/g, " ")}
      </Typography>
    </Box>
  );
};

const NewsSection = ({ title, exclude = 0, per_page = 0, hideHeader = false, onReloadRef }) => {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    list(0, per_page, exclude)
      .then((res) => {
        if (res && res.news) {
          setItems(res.news);
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [per_page, exclude]);

  if (onReloadRef) {
    onReloadRef.current = load;
  }

  if (!loading && items && items.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: "100%" }}>
      {!hideHeader && title && (
        <Typography variant="h2" component="h2" sx={{ mb: 4 }}>
          {title}
        </Typography>
      )}

      <Box
        component="ul"
        aria-label={title || T("Новости")}
        aria-busy={loading ? "true" : undefined}
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {loading
          ? Array.from({ length: per_page || 6 }).map((_, i) => (
              <li key={i}>
                <Skeleton variant="rounded" height={260} sx={{ borderRadius: 5 }} />
              </li>
            ))
          : (items || []).map((item) => (
              <li key={item.id}>
                <NewsCard item={item} />
              </li>
            ))}
      </Box>
    </Box>
  );
};

export default NewsSection;
