import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Skeleton, Alert, useTheme } from "@mui/material";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useParams, Link as RouterLink } from "react-router-dom";
import PageShell from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import NewsSection from "./NewsSection";
import NewsModalGP from "./NewsModalGP";
import useLibrary from "../LibraryContext";
import { get } from "../lib/news";
import { getHost } from "../lib/api";
import T, { tr } from "../lib/translator";

const NewsView = () => {
  const { id } = useParams();
  const { kp } = useTheme();
  const { isAdmin } = useLibrary();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    get(Number(id), true)
      .then((res) => {
        if (res && res.data) {
          setNews(res.data);
        } else {
          setError(tr("Ошибка"));
        }
      })
      .catch((err) => {
        setError(err.message || tr("Ошибка"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const pageTitle = (news && news.subject) || T("Новости");

  return (
    <PageShell title={pageTitle}>
      <Container sx={{ py: { xs: 4, md: 7 } }}>
        {/* Back Link "Barcha yangiliklar" */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Box
            component={RouterLink}
            to="/news"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: kp.p.primary,
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              borderRadius: 2,
              "&:hover": { textDecoration: "underline" },
              "&:focus-visible": { outline: `3px solid ${kp.p.focus}`, outlineOffset: 4 },
            }}
          >
            <ArrowBackRounded aria-hidden="true" sx={{ fontSize: 20 }} />
            {T("Все новости")}
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ maxWidth: 720, mx: "auto" }}>
            <Skeleton width="40%" height={24} sx={{ mb: 2 }} />
            <Skeleton width="90%" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: 5, mb: 4 }} />
            <Skeleton width="100%" height={24} sx={{ mb: 1 }} />
            <Skeleton width="100%" height={24} sx={{ mb: 1 }} />
            <Skeleton width="80%" height={24} />
          </Box>
        ) : error ? (
          <Alert severity="error" role="alert" sx={{ maxWidth: 720, mx: "auto" }}>
            {error}
          </Alert>
        ) : news ? (
          <Box component="article">
            {/* Header column max-width 720px */}
            <Box sx={{ maxWidth: 720, mx: "auto" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: "clamp(2rem, 1.5rem + 2vw, 3rem)",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  m: 0,
                }}
              >
                {news.subject}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  color: kp.p.textSecondary,
                  fontSize: "0.9375rem",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                    <ScheduleOutlined aria-hidden="true" sx={{ fontSize: 18 }} />
                    <time dateTime={String(news.datetime || "").replace(" ", "T")}>
                      {news.datetime_str || news.datetime}
                    </time>
                  </Box>
                  {news.views !== undefined && news.views !== null && (
                    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                      <VisibilityOutlined aria-hidden="true" sx={{ fontSize: 18 }} />
                      <span>{news.views}</span>
                    </Box>
                  )}
                </Box>

                {isAdmin && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditNoteIcon />}
                    onClick={() => setEditOpen(true)}
                  >
                    {T("Редактировать новость")}
                  </Button>
                )}
              </Box>

              {news.pics_ext && (
                <Box
                  sx={{
                    mt: 4,
                    borderRadius: 5,
                    overflow: "hidden",
                    bgcolor: kp.p.surfaceSunken,
                    border: kp.isContrast ? `2px solid ${kp.p.border}` : `1px solid ${kp.p.border}`,
                  }}
                >
                  <Box
                    component="img"
                    src={`${getHost()}/pics/news/${news.id}.${news.pics_ext}`}
                    alt=""
                    sx={{ width: "100%", maxHeight: 460, objectFit: "cover", display: "block" }}
                  />
                </Box>
              )}

              {/* Readable body text column max-width 720px */}
              <Typography
                sx={{
                  mt: 4,
                  fontSize: { xs: "1.0625rem", md: "1.1875rem" },
                  lineHeight: 1.75,
                  color: kp.p.text,
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                }}
              >
                {news.body}
              </Typography>
            </Box>

            {/* Other news section */}
            <Box sx={{ mt: { xs: 8, md: 12 }, pt: { xs: 6, md: 8 }, borderTop: `1px solid ${kp.p.border}` }}>
              <NewsSection
                title={T("Другие новости")}
                per_page={3}
                exclude={Number(id)}
              />
            </Box>
          </Box>
        ) : null}
      </Container>

      {isAdmin && news && (
        <NewsModalGP
          newsId={news.id}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSaveSuccess={() => {
            setEditOpen(false);
            load();
          }}
        />
      )}
    </PageShell>
  );
};

export default NewsView;