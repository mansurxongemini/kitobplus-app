import NotBookmarkedIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkIcon from "@mui/icons-material/BookmarkAdd";
import EmptyBookmarkIcon from "@mui/icons-material/BookmarkAddOutlined";
import NotBookshelfedIcon from "@mui/icons-material/BookOutlined";
import BookshelfedIcon from "@mui/icons-material/Book";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Replay30Icon from "@mui/icons-material/Replay30"; // Placeholder for Replay15Icon
import Forward30Icon from "@mui/icons-material/Forward30"; // Placeholder for Forward15Icon
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, IconButton, Slider, Stack, Typography } from "@mui/material";
import React from "react";
import { getHost, registered, getUser } from '../lib/api';
import PlaylistPlayer from './playlistplayer';
import T from '../lib/translator';
import {Button} from "@mui/material";
import Timer from './timer';
import {add as addToBookshelf, remove as removeFromBookshelf} from '../lib/bookshelf.ts';
import LikeSection from "./Like.jsx";
import useLibrary from '../LibraryContext.js';
import BookBreadcrumbs from './BookBreadcrumbs.jsx';
import { announce, VisuallyHidden, formatDurationParts } from '../lib/a11y';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const formatAriaTime = (seconds, T_) => {
  const { m, s } = formatDurationParts(seconds);
  return m + ' ' + T_('минута') + ' ' + s + ' ' + T_('секунда');
};

// Mock data for the audio player
const audioData = {
  title: "Гарри Поттер: Узник Азкабана",
  currentTime: "02:15",
  totalTime: "01:02:15",
  progress: 24, // percentage of progress
};

const AudioPlayerSection = React.forwardRef(({book, playlist, bookmarks, setBookmarks, addBookmark, removeBookmark, setPlaylist, isPlaying, setIsPlaying, currentTrackId, setCurrentTrackId}, ref) => {
  const playerRef = React.useRef(null);
  const [currentPosition, setCurrentPosition] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState(0);
  const [rate, setRate] = React.useState(1);
  const [bookshelfed, setBookshelfed] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentTrackPosition, setCurrentTrackPosition] = React.useState(0);
  const [volume, setVolume] = React.useState(70);
  const lastPositionStateRef = React.useRef({ position: -1, duration: -1, rate: -1 });
  const prevTrackRef = React.useRef(null);

  const { user } = useLibrary();
  
  React.useImperativeHandle(ref, () => ({
    playTrack: (trackId, position = 0) => playerRef?.current.playTrack(trackId, position)
  }));

  // Keyboard shortcuts (incl. Escape) are handled by the player shortcuts effect below.

  React.useEffect(() => {
      if (!book || !book?.files) return;

      // Проверяем статус пользователя из контекста, а не только из localStorage
      const isUserRegistered = user && user.state === 2;
      
      const files = isUserRegistered ? 
              book.files.split(',').map((_, i) => {return {'url': getHost() + '/drm/xstream.php?books_id=' + book.id + '&tracks_id=' + (i + 1), 'length': parseFloat(_)};})
          :
              [{url: getHost() + '/books/' + book.id.toString().padStart(5, '0') + '.mp3', length: 180}]
      ;
      
      if (book?.rate) {
          setRate(Number(book.rate));
      }

      setPlaylist(files);
      setTotalTime(files.reduce((sum, item) => sum + item.length, 0));

      console.log("Bookshelf");
      console.log(book.bookshelf_dt);

      setBookshelfed(book?.bookshelf_dt !== null && book?.bookshelf_dt !== undefined);
      setBookmarks(book?.bookmarks ? book.bookmarks : []);
  }, [book, user, setPlaylist]);

  const getTrackOffset = (trackId) => {
      if (!playlist) return 0;
      let trackOffset = 0;
      for (let i = 0; i < trackId; i++) {
          trackOffset += playlist[i].length;
      }
      //console.log("getTrackOffset(" + trackId + ") => " + trackOffset);
      return trackOffset;
  }
  const onProgress = (playing, trackId, trackPosition) => {
      setIsPlaying(playing);
      setCurrentTrackId(trackId);
      setCurrentTrackPosition(trackPosition);

      let trackOffset = getTrackOffset(trackId);
      setCurrentPosition(trackOffset + trackPosition);
  };

  const saveBookshelfed = (_) => {
      const func = (_ ? addToBookshelf : removeFromBookshelf);
      setBookshelfed(_);
      func(book.id).catch(e => {setBookshelfed(!_); alert(e);});
  };

  const seekToPosition = (seconds) => {
      if (!playlist || !playlist.length || !totalTime) return;
      const target = Math.min(Math.max(0, seconds), totalTime);
      let acc = 0;
      for (let i = 0; i < playlist.length; i++) {
          const len = playlist[i].length;
          if (target < acc + len || i === playlist.length - 1) {
              playerRef.current?.playTrack(i, Math.max(0, target - acc));
              return;
          }
          acc += len;
      }
  };

  const changeRate = (dir) => {
      const idx = SPEEDS.reduce((best, v, i) => Math.abs(v - rate) < Math.abs(SPEEDS[best] - rate) ? i : best, 0);
      const next = SPEEDS[Math.min(SPEEDS.length - 1, Math.max(0, idx + dir))];
      const r = playerRef.current?.setRateValue ? playerRef.current.setRateValue(next) : next;
      setRate(r);
      announce(T('Скорость') + ': ' + r + 'x');
  };

  const cycleRate = () => {
      const r = playerRef.current ? playerRef.current.switchRate(rate) : rate;
      setRate(r);
      announce(T('Скорость') + ': ' + r + 'x');
  };

  // Global player shortcuts when focus is not in a text field.
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const tag = target && target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (target && target.isContentEditable)) return;
      if (event.key === 'Escape') {
        if (isPlaying) playerRef.current?.playPause();
        return;
      }
      const onSlider = target && target.closest && target.closest('[role="slider"]');
      const onInteractive = target && target.closest && target.closest('button, a, [role="button"]');
      if (event.key === ' ') {
        if (onInteractive) return; // let the control activate natively
        event.preventDefault();
        playerRef.current?.playPause();
      } else if (event.key === 'ArrowLeft' && !onSlider) {
        event.preventDefault();
        playerRef.current?.stepBackward();
      } else if (event.key === 'ArrowRight' && !onSlider) {
        event.preventDefault();
        playerRef.current?.stepForward();
      } else if ((event.shiftKey && event.key === 'ArrowUp') || event.key === '>') {
        event.preventDefault();
        stepRateRef.current(1);
      } else if ((event.shiftKey && event.key === 'ArrowDown') || event.key === '<') {
        event.preventDefault();
        stepRateRef.current(-1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, rate, playlist, totalTime]);

  const stepRateRef = React.useRef(changeRate);
  stepRateRef.current = changeRate;

  // Announce track changes.
  React.useEffect(() => {
    if (prevTrackRef.current !== null && prevTrackRef.current !== currentTrackId) {
      announce(T('Фрагмент изменён'));
    }
    prevTrackRef.current = currentTrackId;
  }, [currentTrackId]);

  // Media Session API: lock-screen / headphone control for blind users.
  React.useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      const cover = getHost() + '/pics/' + (book && book.pics_ext ? 'books/' + book.id + '.' + book.pics_ext : 'book.png');
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: (book && book.title) || 'KitobPlus',
        artist: (book && (book.authors_name || book.dictors_name)) || '',
        album: 'KitobPlus',
        artwork: [{ src: cover, sizes: '512x512', type: 'image/png' }],
      });
      navigator.mediaSession.setActionHandler('play', () => playerRef.current?.playPause());
      navigator.mediaSession.setActionHandler('pause', () => playerRef.current?.playPause());
      navigator.mediaSession.setActionHandler('seekbackward', () => playerRef.current?.stepBackward());
      navigator.mediaSession.setActionHandler('seekforward', () => playerRef.current?.stepForward());
      navigator.mediaSession.setActionHandler('previoustrack', () => playerRef.current?.previosTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => playerRef.current?.nextTrack());
    } catch (e) { /* Media Session not supported — ignore */ }
  }, [book]);

  // Keep Media Session position state fresh (rounded to whole seconds).
  React.useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    if (!totalTime) return;
    try {
      const pos = Math.round(currentPosition);
      const last = lastPositionStateRef.current;
      if (last.position === pos && last.duration === Math.round(totalTime) && last.rate === rate) return;
      lastPositionStateRef.current = { position: pos, duration: Math.round(totalTime), rate };
      if (navigator.mediaSession.setPositionState) {
        navigator.mediaSession.setPositionState({ duration: Math.round(totalTime), playbackRate: rate, position: Math.min(pos, Math.round(totalTime)) });
      }
    } catch (e) { /* ignore */ }
  }, [currentPosition, totalTime, rate]);


  return (
    <Box
      sx={{
        height: { xs: "auto", md: 340 },
        minHeight: { xs: 400, sm: 500, md: 340 },
        width: "100%",
        position: "relative",
        backgroundImage: "url(" + getHost() + '/pics/' + (book.pics_ext ? 'books/' + book.id + '.' + book.pics_ext : 'book.png') + ")",
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
      }}
    >
      <PlaylistPlayer book={book} track={book?.track} position={book?.position} rate={book?.rate} ref={playerRef} playlist={playlist} onProgress={onProgress}/>
      <VisuallyHidden id="player-shortcuts-hint">
        {T('Сочетания клавиш плеера') + '. ' + T('Пробел — воспроизведение или пауза. Стрелки влево и вправо — назад или вперёд на 30 секунд. Стрелки вверх и вниз с Shift, а также клавиши < и > — скорость.')}
      </VisuallyHidden>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: "rgba(2, 73, 89, 0.75)",
        backdropFilter: "blur(6px)",
      }} />
      {/* Navigation breadcrumbs */}
      <BookBreadcrumbs book={book} />

      <Box sx={{
        display: "flex",
        flexDirection: "column",
        p: { xs: 2, sm: 3 },
        pl: { xs: 2, sm: 3, md: 50 },
        pr: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 10, md: 3 }
      }} style={{position: 'absolute', width: '100%', top: 30, left: 0, zIndex: 1, boxSizing: 'border-box'}}>
        {/* Book cover image */}

        <Box sx={{ flex: 1 }}>
          {/* Title */}
          <Typography
            variant="h2"
            component="h1"
            tabIndex={-1}
            fontWeight="bold"
            color="white"
            sx={{
              mb: { xs: 2, md: 3 },
              fontSize: { xs: "24px", sm: "28px", md: "30px" },
              lineHeight: { xs: "1.3", md: "39px" }
            }}
          >
            {book.title}
          </Typography>

          {/* Audio player controls container */}
          <Box
            role="region"
            aria-label={book.title}
            aria-describedby="player-shortcuts-hint"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              p: { xs: 1.5, md: 2 },
              borderRadius: 1,
              width: "100%",
              maxWidth: "100%"
            }}
          >
            {/* Top row with speed, rewind, play, forward, download controls */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1, gap: { xs: 0.5, sm: 1 } }}
            >
              {/* Left controls */}
              <Stack direction="row" spacing={{ xs: 0.5, sm: 1, md: 2 }}>
                <Box
                  sx={{
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    bgcolor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      minWidth: 0,
                      fontSize: { xs: "12px", md: "14px" },
                      p: 0.5
                    }}
                    aria-label={T('Скорость')}
                    title={T('Скорость')}
                    onClick={cycleRate}
                  >
                    {rate}X
                  </Button>
                </Box>

                <IconButton
                  sx={{
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    bgcolor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 1,
                    p: { xs: 0.5, md: 1 }
                  }}
                  onClick={() => playerRef.current.stepBackward()}
                  aria-label={T('Назад на 30 секунд')}
                  title={T('Назад на 30 секунд')}
                >
                  <Replay30Icon sx={{ color: "white", fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
              </Stack>

              {/* Center play controls */}
              <Stack direction="row" spacing={{ xs: 0.5, sm: 1, md: 2 }} alignItems="center">
                <IconButton
                  onClick={() => playerRef.current.previosTrack()}
                  aria-label={T('Предыдущий фрагмент')}
                  color="inherit"
                  sx={{
                    color: "white",
                    display: { xs: "none", sm: "flex" },
                    p: { xs: 0.5, md: 1 }
                  }}
                >
                  <SkipPreviousIcon sx={{ fontSize: { sm: 24, md: 28 } }} />
                </IconButton>
                <IconButton
                  sx={{
                    width: { xs: 48, md: 60 },
                    height: { xs: 48, md: 60 },
                    border: "2px solid white",
                    borderRadius: "50%",
                    color: "white",
                  }}
                  onClick={() => playerRef.current.playPause()}
                  aria-label={isPlaying ? T('Пауза') : T('Воспроизведение')}
                >
                  {isPlaying ? (
                    <PauseIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
                  ) : (
                    <PlayArrowIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
                  )}
                </IconButton>
                <IconButton
                  onClick={() => playerRef.current.nextTrack()}
                  aria-label={T('Следующий фрагмент')}
                  color="inherit"
                  sx={{
                    color: "white",
                    display: { xs: "none", sm: "flex" },
                    p: { xs: 0.5, md: 1 }
                  }}
                >
                  <SkipNextIcon sx={{ fontSize: { sm: 24, md: 28 } }} />
                </IconButton>
              </Stack>

              {/* Right controls */}
              <Stack direction="row" spacing={{ xs: 0.5, sm: 1, md: 2 }}>
                <IconButton
                  sx={{
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    bgcolor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 1,
                    p: { xs: 0.5, md: 1 }
                  }}
                  onClick={() => playerRef.current.stepForward()}
                  aria-label={T('Вперёд на 30 секунд')}
                  title={T('Вперёд на 30 секунд')}
                >
                  <Forward30Icon sx={{ color: "white", fontSize: { xs: 20, md: 24 } }} />
                </IconButton>
                <IconButton
                  sx={{
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    bgcolor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 1,
                    p: { xs: 0.5, md: 1 }
                  }}
                  aria-label={T('Добавить закладку')}
                  title={T('Добавить закладку')}
                  onClick={() => { addBookmark(currentTrackId, Math.round(currentTrackPosition * 1000)); announce(T('Закладка добавлена')); }}
                >
                  {bookmarks?.length > 0 ? (
                    <BookmarkIcon sx={{ color: "white", fontSize: { xs: 20, md: 24 } }} />
                  ) : (
                    <EmptyBookmarkIcon sx={{ color: "white", fontSize: { xs: 20, md: 24 } }} />
                  )}
                </IconButton>
              </Stack>
            </Stack>

            {/* Progress bar and time */}
            <Box sx={{ mt: 0}}>
              <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
                <Typography
                  variant="body2"
                  color="white"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "12px", md: "14px" }, minWidth: "fit-content" }}
                >
                  <Timer value={currentPosition} ariaPrefix={T('Позиция')}/>
                </Typography>
                <Slider
                  aria-label={T('Позиция воспроизведения')}
                  min={0}
                  max={Math.max(1, Math.round(totalTime))}
                  step={5}
                  value={Math.min(Math.round(currentPosition), Math.max(1, Math.round(totalTime)))}
                  onChange={(_, v) => seekToPosition(Array.isArray(v) ? v[0] : v)}
                  onKeyDown={(e) => {
                    if (e.key === 'PageUp') { e.preventDefault(); seekToPosition(currentPosition + 30); }
                    if (e.key === 'PageDown') { e.preventDefault(); seekToPosition(currentPosition - 30); }
                  }}
                  getAriaValueText={() => formatAriaTime(currentPosition, T) + ' / ' + formatAriaTime(totalTime, T)}
                  sx={{
                    color: "#0288d1",
                    "& .MuiSlider-thumb": {
                      width: { xs: 16, md: 22 },
                      height: { xs: 16, md: 22 },
                      border: "2px solid white",
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  color="white"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "12px", md: "14px" }, minWidth: "fit-content" }}
                >
                  <Timer value={totalTime} ariaPrefix={T('Общее время')}/>
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                marginTop: '8px',
                alignItems: 'center',
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}
            >
              <LikeSection book={book}/>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent={{ xs: "center", sm: "flex-end" }}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                {/* Volume control - hidden on mobile */}
                <VolumeUpIcon aria-hidden="true" sx={{ color: "white", fontSize: { sm: 20, md: 24 } }} />
                <Slider
                  aria-label={T('Громкость')}
                  size="small"
                  min={0}
                  max={100}
                  step={5}
                  value={volume}
                  onChange={(_, v) => {
                    const nv = Array.isArray(v) ? v[0] : v;
                    setVolume(nv);
                    playerRef.current?.setVolume?.(nv / 100);
                  }}
                  getAriaValueText={(v) => v + ' %'}
                  sx={{
                    width: { sm: 80, md: 100 },
                    color: "white",
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Bookmark button - hidden on xs, visible on sm+ */}
        <IconButton
          sx={{
            width: 44,
            height: 44,
            bgcolor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            ml: 2,
            display: { xs: "none", sm: "flex" },
          }}
          aria-label={bookshelfed ? T('Снять с книжной полки') : T('Поставить на книжную полку')}
          title={bookshelfed ? T('Снять с книжной полки') : T('Поставить на книжную полку')}
          onClick={() => saveBookshelfed(!bookshelfed)}
        >
          {bookshelfed ? <BookshelfedIcon /> : <NotBookshelfedIcon />}
        </IconButton>
      </Box>
    </Box>
  );
});

export default AudioPlayerSection;
