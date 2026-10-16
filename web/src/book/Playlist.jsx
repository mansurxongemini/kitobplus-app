import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Bookmark from "@mui/icons-material/Bookmark";
import Delete from "@mui/icons-material/Delete";
import GraphicEqRounded from "@mui/icons-material/GraphicEqRounded";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import React from "react";
import Timer from "./timer";
import T from "../lib/translator";

// Chapters / bookmarks list. Every row is a real button; the currently playing
// chapter is marked with an icon AND the text "Hozir ijro etilmoqda", never by
// colour alone.
const Playlist = ({ data, isPlaying, currentTrackId, playTrack, type = "playlist", playlist, removeBookmark }) => {
  const { kp } = useTheme();

  const getTrackOffset = (trackId) => {
    if (!playlist) {
      return 0;
    }
    let trackOffset = 0;
    for (let i = 0; i < trackId; i++) {
      trackOffset += playlist[i].length;
    }
    return trackOffset;
  };

  const handleTrackClick = (index) => {
    if (type === "playlist") {
      playTrack(index);
    } else if (type === "bookmarks") {
      const bookmark = data[index];
      if (bookmark && playTrack) {
        playTrack(bookmark.track, bookmark.position / 1000);
      }
    }
  };

  const handleRemoveBookmark = (e, item, index) => {
    e.stopPropagation();
    if (removeBookmark && type === "bookmarks") {
      removeBookmark(item.track, item.position);
    }
  };

  const formatClock = (seconds) => {
    const s = Math.max(0, Math.round(Number(seconds) || 0));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCurrent = (index) => type === "playlist" && index === currentTrackId && isPlaying;

  const getItemLabel = (item, index) => {
    if (type === "bookmarks") {
      const absolutePosition = Math.round(getTrackOffset(item.track) + item.position / 1000);
      return `${T("Закладка")} ${index + 1}, ${T("Фрагмент")} ${item.track + 1}, ${formatClock(absolutePosition)}`;
    }
    return `${T("Фрагмент")} ${index + 1}${isCurrent(index) ? `, ${T("Сейчас играет")}` : ""}`;
  };

  const getItemTime = (item) => {
    if (type === "bookmarks") {
      return getTrackOffset(item.track) + item.position / 1000;
    }
    return item.length;
  };

  const labelId = React.useId();
  if (!data || data.length === 0) {
    return (
      <Typography sx={{ py: 3, px: 1, color: kp.p.textSecondary }}>
        {type === "bookmarks" ? T("Пока нет закладок") : T("Пока нет фрагментов")}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", maxHeight: 420, overflowY: "auto" }} role="group" aria-labelledby={labelId}>
      <Typography id={labelId} variant="caption" sx={{ display: "block", px: 1, pb: 1, color: kp.p.textSecondary }}>
        {type === "bookmarks"
          ? `${T("Закладки")}: ${data.length}`
          : `${T("Фрагмент")}: ${data.length}`}
      </Typography>
      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {data.map((item, index) => {
          const current = isCurrent(index);
          return (
            <ListItem key={index} disablePadding disableGutters>
              <ListItemButton
                onClick={() => handleTrackClick(index)}
                aria-label={getItemLabel(item, index)}
                aria-current={current ? "true" : undefined}
                sx={{
                  minHeight: 56,
                  borderRadius: 3,
                  px: 1.5,
                  bgcolor: current ? kp.p.primarySoft : "transparent",
                  border: current ? `2px solid ${kp.p.primary}` : "2px solid transparent",
                  "&:hover": { bgcolor: current ? kp.p.primarySoft : kp.p.surfaceAlt },
                }}
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  {type === "bookmarks" ? (
                    <Bookmark aria-hidden="true" sx={{ color: kp.p.primary }} />
                  ) : current ? (
                    <GraphicEqRounded aria-hidden="true" sx={{ color: kp.p.primary }} />
                  ) : (
                    <PlayArrow aria-hidden="true" sx={{ color: kp.p.textSecondary }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography component="span" sx={{ fontWeight: 700 }}>
                        {type === "bookmarks" ? `${T("Закладка")} ${index + 1}` : `${T("Фрагмент")} ${index + 1}`}
                      </Typography>
                      {current && (
                        <Typography
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: kp.p.onPrimarySoft,
                            bgcolor: kp.p.primary,
                            px: 1.25,
                            py: 0.25,
                            borderRadius: 999,
                          }}
                        >
                          <Pause aria-hidden="true" sx={{ fontSize: 16 }} />
                          {T("Сейчас играет")}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography component="span" variant="body2" sx={{ color: kp.p.textSecondary }}>
                      <Timer value={getItemTime(item)} ariaPrefix={T("Длительность")} />
                    </Typography>
                  }
                />
                {type === "bookmarks" && (
                  <IconButton
                    size="large"
                    edge="end"
                    onClick={(e) => handleRemoveBookmark(e, item, index)}
                    aria-label={`${T("Удалить закладку")} ${index + 1}`}
                    sx={{ width: 48, height: 48 }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Playlist;
