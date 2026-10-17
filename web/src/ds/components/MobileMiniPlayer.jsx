import React from "react";
import { Box, Typography, IconButton, useTheme, alpha } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import { Link as RouterLink } from "react-router-dom";
import useLibrary from "../../LibraryContext";
import T from "../../lib/translator";

const MobileMiniPlayer = () => {
  const theme = useTheme();
  const { kp } = theme;
  const { activeAudio, setActiveAudio } = useLibrary();

  if (!activeAudio || !activeAudio.title) {
    return null;
  }

  const isPlaying = Boolean(activeAudio.isPlaying);
  const progressPercent = Math.min(100, Math.max(0, Number(activeAudio.progress || 0)));

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (activeAudio.onTogglePlay) {
      activeAudio.onTogglePlay();
    } else {
      setActiveAudio((prev) => (prev ? { ...prev, isPlaying: !prev.isPlaying } : null));
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (activeAudio.onClose) {
      activeAudio.onClose();
    }
    setActiveAudio(null);
  };

  return (
    <Box
      role="region"
      aria-label={T("Мини-плеер")}
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
        left: { xs: 10, sm: 16 },
        right: { xs: 10, sm: 16 },
        zIndex: 1240,
        borderRadius: "16px",
        overflow: "hidden",
        bgcolor: kp.isContrast ? kp.p.bg : alpha(kp.p.surface, 0.94),
        backdropFilter: kp.isContrast ? "none" : "blur(24px) saturate(180%)",
        border: `1px solid ${kp.p.borderStrong}`,
        boxShadow:
          kp.p.mode === "dark"
            ? "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            : "0 10px 30px rgba(15, 25, 45, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)",
        transition: "all .3s cubic-bezier(0.16, 1, 0.3, 1)",
        animation: "kpMiniPlayerSlideUp .35s ease-out",
        "@keyframes kpMiniPlayerSlideUp": {
          from: { transform: "translateY(20px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      }}
    >
      {/* Slim progress bar along top edge */}
      <Box sx={{ width: "100%", height: 3, bgcolor: alpha(kp.p.border, 0.6), position: "relative" }}>
        <Box
          sx={{
            height: "100%",
            width: `${progressPercent}%`,
            bgcolor: kp.p.primary,
            transition: "width .2s linear",
          }}
        />
      </Box>

      {/* Main player bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          gap: 1.25,
        }}
      >
        {/* Clickable link to book details page */}
        <Box
          component={RouterLink}
          to={activeAudio.id ? `/books/${activeAudio.id}` : "/books"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            flex: 1,
            minWidth: 0,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          {/* Cover image or placeholder */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "10px",
              overflow: "hidden",
              flexShrink: 0,
              bgcolor: kp.p.surfaceAlt,
              border: `1px solid ${kp.p.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {activeAudio.cover ? (
              <Box
                component="img"
                src={activeAudio.cover}
                alt={activeAudio.title}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <GraphicEqRoundedIcon sx={{ color: kp.p.primary, fontSize: "1.5rem" }} />
            )}
          </Box>

          {/* Title & Author */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: kp.p.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              {activeAudio.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.75rem",
                color: kp.p.textSecondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                mt: 0.25,
              }}
            >
              {activeAudio.author || T("KitobPlus Audio")}
            </Typography>
          </Box>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          <IconButton
            onClick={handleTogglePlay}
            aria-label={isPlaying ? T("Пауза") : T("Слушать")}
            sx={{
              width: 38,
              height: 38,
              bgcolor: kp.p.primary,
              color: kp.p.onPrimary,
              "&:hover": {
                bgcolor: kp.p.primary,
                transform: "scale(1.06)",
              },
              "&:active": {
                transform: "scale(0.92)",
              },
              transition: "transform .15s ease",
            }}
          >
            {isPlaying ? (
              <PauseRoundedIcon sx={{ fontSize: "1.35rem" }} />
            ) : (
              <PlayArrowRoundedIcon sx={{ fontSize: "1.35rem" }} />
            )}
          </IconButton>

          <IconButton
            onClick={handleClose}
            aria-label={T("Закрыть")}
            size="small"
            sx={{
              width: 32,
              height: 32,
              color: kp.p.textSecondary,
              "&:hover": { color: kp.p.text, bgcolor: alpha(kp.p.text, 0.08) },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileMiniPlayer;
