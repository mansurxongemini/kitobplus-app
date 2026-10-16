import React, { useState } from "react";
import { Box, Typography, Avatar, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getHost } from "../lib/api";
import T from "../lib/translator";

export const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const PersonAvatar = ({ person, table, size = 64 }) => {
  const { kp } = useTheme();
  const [imgFailed, setImgFailed] = useState(false);
  const initials = getInitials(person && person.name);
  const avatarUrl = person && person.pics_ext
    ? `${getHost()}/pics/${table}/${person.id}.${person.pics_ext}`
    : null;

  if (avatarUrl && !imgFailed) {
    return (
      <Avatar
        src={avatarUrl}
        alt=""
        onError={() => setImgFailed(true)}
        sx={{
          width: size,
          height: size,
          border: kp.isContrast ? `2px solid ${kp.p.border}` : `1px solid ${kp.p.border}`,
        }}
      />
    );
  }

  return (
    <Box
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: kp.isContrast ? "transparent" : kp.p.primarySoft,
        color: kp.isContrast ? kp.p.primary : kp.p.onPrimarySoft,
        border: kp.isContrast ? `2px solid ${kp.p.border}` : `1px solid ${kp.p.border}`,
        fontFamily: "'Manrope Variable', sans-serif",
        fontWeight: 800,
        fontSize: size >= 80 ? "1.75rem" : "1.25rem",
        letterSpacing: "0.02em",
        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  );
};

const PersonCard = ({ person, table, headingLevel = "h2" }) => {
  const { kp } = useTheme();

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 3,
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <PersonAvatar person={person} table={table} size={64} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            component={headingLevel}
            sx={{
              fontFamily: "'Manrope Variable', sans-serif",
              fontWeight: 700,
              fontSize: "1.125rem",
              lineHeight: 1.3,
              m: 0,
            }}
          >
            <Box
              component={RouterLink}
              to={`/person/${table}/${person.id}`}
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
              {person.name}
            </Box>
          </Typography>
          {person.books_count && (
            <Typography variant="body2" sx={{ color: kp.p.textSecondary, mt: 0.5, fontSize: "0.9375rem" }}>
              {parseInt(person.books_count, 10).toLocaleString("ru-RU")} {T("книг (число)")}
            </Typography>
          )}
        </Box>
      </Box>

      {person.annotation && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: kp.p.textSecondary,
            lineHeight: 1.5,
            fontSize: "0.9375rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {String(person.annotation).replace(/<[^>]+>/g, " ").trim()}
        </Typography>
      )}
    </Box>
  );
};

export default PersonCard;
