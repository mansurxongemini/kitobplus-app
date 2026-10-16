import React, { useState } from "react";
import { Box, Typography, Avatar, Skeleton, useTheme } from "@mui/material";
import AutoStoriesOutlined from "@mui/icons-material/AutoStoriesOutlined";
import Container from "../ds/components/Container";
import BreadcrumbsSection from "./BreadcrumbsSection";
import { getHost } from "../lib/api";
import { getInitials } from "../persons/PersonCard";
import T from "../lib/translator";

export const GenreHeaderIcon = ({ id }) => {
  const { kp } = useTheme();
  const [failed, setFailed] = useState(false);
  const src = `${getHost()}/pics/genres.flat/${id}.png`;

  return (
    <Box
      aria-hidden="true"
      sx={{
        width: { xs: 72, md: 88 },
        height: { xs: 72, md: 88 },
        borderRadius: 4,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        bgcolor: kp.isContrast ? "transparent" : kp.p.primarySoft,
        color: kp.isContrast ? kp.p.primary : kp.p.onPrimarySoft,
        border: kp.isContrast ? `2px solid ${kp.p.border}` : "none",
        overflow: "hidden",
      }}
    >
      {!failed ? (
        <Box
          component="img"
          src={src}
          alt=""
          onError={() => setFailed(true)}
          sx={{ width: 44, height: 44, objectFit: "contain", display: "block" }}
        />
      ) : (
        <AutoStoriesOutlined sx={{ fontSize: 40 }} />
      )}
    </Box>
  );
};

export const PersonHeaderAvatar = ({ name, picsExt, table, id }) => {
  const { kp } = useTheme();
  const [failed, setFailed] = useState(false);
  const initials = getInitials(name);
  const avatarUrl = picsExt ? `${getHost()}/pics/${table}/${id}.${picsExt}` : null;

  if (avatarUrl && !failed) {
    return (
      <Avatar
        src={avatarUrl}
        alt=""
        onError={() => setFailed(true)}
        sx={{
          width: { xs: 72, md: 88 },
          height: { xs: 72, md: 88 },
          border: kp.isContrast ? `2px solid ${kp.p.border}` : `1px solid ${kp.p.border}`,
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <Box
      aria-hidden="true"
      sx={{
        width: { xs: 72, md: 88 },
        height: { xs: 72, md: 88 },
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: kp.isContrast ? "transparent" : kp.p.primarySoft,
        color: kp.isContrast ? kp.p.primary : kp.p.onPrimarySoft,
        border: kp.isContrast ? `2px solid ${kp.p.border}` : `1px solid ${kp.p.border}`,
        fontFamily: "'Manrope Variable', sans-serif",
        fontWeight: 800,
        fontSize: { xs: "1.75rem", md: "2.25rem" },
        letterSpacing: "0.02em",
        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  );
};

const PersonBanner = ({ userData, table, id, loading }) => {
  const { kp } = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: kp.isContrast ? kp.p.bg : kp.p.surfaceAlt,
          borderBottom: `1px solid ${kp.p.border}`,
          py: { xs: 4, md: 6 },
        }}
      >
        <Container>
          <Skeleton width={200} height={24} sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Skeleton variant="circular" width={88} height={88} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="50%" height={48} />
              <Skeleton width="30%" height={24} sx={{ mt: 1 }} />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  const name = (userData && (userData.name || userData.title)) || "";
  const booksCount = userData && userData.books_count;
  const rawAnnotation = (userData && userData.annotation) || "";
  const annotation = rawAnnotation ? String(rawAnnotation).replace(/<[^>]+>/g, " ").trim() : "";

  return (
    <Box
      sx={{
        bgcolor: kp.isContrast ? kp.p.bg : kp.p.surfaceAlt,
        borderBottom: `1px solid ${kp.p.border}`,
        py: { xs: 4, md: 6 },
      }}
    >
      <Container>
        <BreadcrumbsSection table={table} name={name} />

        <Box
          sx={{
            display: "flex",
            gap: { xs: 2.5, md: 4 },
            alignItems: "flex-start",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {table === "genres" ? (
            <GenreHeaderIcon id={id} />
          ) : (
            <PersonHeaderAvatar name={name} picsExt={userData?.pics_ext} table={table} id={id} />
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: "clamp(2rem, 1.5rem + 2.2vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                m: 0,
              }}
            >
              {name}
            </Typography>

            {booksCount !== undefined && booksCount !== null && (
              <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1.75,
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: kp.isContrast ? "transparent" : kp.p.primarySoft,
                    color: kp.isContrast ? kp.p.primary : kp.p.onPrimarySoft,
                    border: kp.isContrast ? `2px solid ${kp.p.border}` : "none",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                  }}
                >
                  {parseInt(booksCount, 10).toLocaleString("ru-RU")} {T("книг (число)")}
                </Box>
              </Box>
            )}

            {annotation && (
              <Typography
                sx={{
                  mt: 2,
                  color: kp.p.textSecondary,
                  maxWidth: 760,
                  fontSize: { xs: "1rem", md: "1.0625rem" },
                  lineHeight: 1.6,
                }}
              >
                {annotation}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PersonBanner;
