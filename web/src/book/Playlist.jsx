import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Bookmark from "@mui/icons-material/Bookmark";
import Delete from "@mui/icons-material/Delete";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import React from "react";
import Timer from "./timer";
import DarkTimer from "./dark_timer";
import T from "../lib/translator";
import useLibrary from "../LibraryContext";

const Playlist = ({data, isPlaying, currentTrackId, playTrack, type = "playlist", playlist, removeBookmark}) => {
  const theme = useTheme();
  const {darkMode} = useLibrary();

  const getTrackOffset = (trackId) => {
    if (!playlist) {return 0;}
    let trackOffset = 0;
    for (let i = 0; i < trackId; i++) {
      trackOffset += playlist[i].length;
    }
    console.log("getTrackOffset(" + trackId + ") => " + trackOffset);
    return trackOffset;
  };
    
  const handleTrackClick = (index) => {
    if (type === "playlist") {
      playTrack(index);
      console.log(`Track ${index + 1} clicked`);
    } else if (type === "bookmarks") {
      // Для закладок - переходим к позиции в треке
      const bookmark = data[index];
      if (bookmark && playTrack) {
        playTrack(bookmark.track, bookmark.position / 1000);
      }
      console.log(`Bookmark ${index + 1} clicked`);
    }
  };

  const handleRemoveBookmark = (e, item, index) => {
    e.stopPropagation(); // Предотвращаем срабатывание клика по элементу списка
    if (removeBookmark && type === "bookmarks") {
      removeBookmark(item.track, item.position);
      console.log(`Removing bookmark ${index + 1}, track: ${item.track}, position: ${item.position}`);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getItemLabel = (item, index) => {
    if (type === "bookmarks") {
      const absolutePosition = Math.round(getTrackOffset(item.track) + (item.position / 1000));
      return `${T('Закладка')} ${index + 1}, ${T('Фрагмент')} ${item.track + 1}, ${formatTime(Math.round(absolutePosition))}`;
    }
    return `${T('Фрагмент')} ${index + 1}, ${item.duration || ''}`;
  };

  const getItemTitle = (item, index) => {
    if (type === "bookmarks") {
      return `${T('Закладка')} ${index + 1}`;
    }
    return `${T('Фрагмент')} ${index + 1}`;
  };

  const getItemTime = (item) => {
    let value = 0;
    if (type === "bookmarks") {
      // Для закладок используем DarkTimer с абсолютной позицией
      value = getTrackOffset(item.track) + (item.position / 1000);
    } else {
      value = item.length;
    }

    return darkMode ? <Timer value={value} /> : <DarkTimer value={value} />;
  };

  const getIcon = (item, index) => {
    if (type === "bookmarks") {
      return (
        <Bookmark sx={{ 
          color: theme.palette.lightwhite.main, 
          width: 32, 
          height: 32, 
          backgroundColor: theme.palette.icon.main, 
          borderRadius: '50%',
          padding: '4px'
        }} />
      );
    }
    
    return (index == currentTrackId && isPlaying) ? (
      <Pause sx={{ 
        color: theme.palette.lightwhite.main, 
        width: 32, 
        height: 32, 
        backgroundColor: theme.palette.icon.main, 
        borderRadius: '50%',
        padding: '4px'
      }} />
    ) : (
      <PlayArrow sx={{ 
        color: theme.palette.lightwhite.main, 
        width: 32, 
        height: 32, 
        backgroundColor: theme.palette.icon.main, 
        borderRadius: '50%',
        padding: '4px'
      }} />
    );
  };

  return (
    <Box sx={{ 
      width: 377, 
      bgcolor: theme.palette.lightfirst.main,
      maxHeight: 400,
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        p: 0.5,
        maxHeight: 400,
        overflowY: 'auto'
      }}>
        <List disablePadding>
          {data && data.map((item, index) => (
            <ListItem
              tabIndex={0}
              key={index}
              component={Paper}
              elevation={0}
              onClick={() => handleTrackClick(index)}
              role="listitem"
              aria-label={getItemLabel(item, index)}
              label={getItemLabel(item, index)}
              onKeyDown={(e) => {if (e.key === 'Enter') handleTrackClick(index)}}
              sx={{
                height: 50,
                mb: 0.5,
                p: 0,
                borderRadius: 0.5,
                overflow: "hidden",
                bgcolor: (type === "playlist" && index == currentTrackId && isPlaying)
                  ? theme.palette.action.hover
                  : "transparent",
                "&:hover": {
                  bgcolor: darkMode ? "#646464" : theme.palette.background.paper,
                  cursor: "pointer",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  px: 2,
                }}
              >
                <ListItemIcon sx={{}}>
                  {getIcon(item, index)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                        fontSize: 16,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 226,
                        fontFamily: theme.typography.fontFamily,
                      }}
                    >
                      {getItemTitle(item, index)}
                    </Typography>
                  }
                  sx={{ margin: 0, ml: 0 }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "nowrap",
                    textAlign: "right",
                    ml: "auto",
                  }}
                  style={{textAlign: 'right' }}
                >
                  {getItemTime(item)}
                </Typography>
                {type === "bookmarks" && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleRemoveBookmark(e, item, index)}
                    sx={{
                      ml: 1,
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        color: theme.palette.error.main,
                        backgroundColor: theme.palette.error.light + "20",
                      },
                    }}
                    aria-label={`${T('Удалить закладку')} ${index + 1}`}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Playlist;
