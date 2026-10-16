import BookmarkIcon from "@mui/icons-material/BookmarkAdd";
import EmptyBookmarkIcon from "@mui/icons-material/BookmarkAddOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Replay30Icon from "@mui/icons-material/Replay30";
import Forward30Icon from "@mui/icons-material/Forward30";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, Button, Card, Slider, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { getHost } from '../lib/api';
import PlaylistPlayer from './playlistplayer';
import T, { tr } from '../lib/translator';
import Timer from './timer';
import useLibrary from '../LibraryContext.js';
import { announce, VisuallyHidden, formatDurationParts } from '../lib/a11y';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const formatAriaTime = (seconds, T_) => {
  const { m, s } = formatDurationParts(seconds);
  return m + ' ' + T_('минута') + ' ' + s + ' ' + T_('секунда');
};

// Цифры таймера: старый index.css красит span.timerNum белым — возвращаем цвет и шрифт темы.
const timerSx = {
  minWidth: "fit-content", fontVariantNumeric: "tabular-nums",
  "& span.timerNum, & span.timerSep": { color: "inherit", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit" },
};

const AudioPlayerSection = React.forwardRef(({book, playlist, bookmarks, setBookmarks, addBookmark, removeBookmark, setPlaylist, isPlaying, setIsPlaying, currentTrackId, setCurrentTrackId}, ref) => {
  const { kp } = useTheme();
  const playerRef = React.useRef(null);
  const [currentPosition, setCurrentPosition] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState(0);
  const [rate, setRate] = React.useState(1);
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

      setBookmarks(book?.bookmarks ? book.bookmarks : []);
  }, [book, user, setPlaylist, setBookmarks]);

  const getTrackOffset = (trackId) => {
      if (!playlist) return 0;
      let trackOffset = 0;
      for (let i = 0; i < trackId; i++) {
          trackOffset += playlist[i].length;
      }
      return trackOffset;
  };
  const onProgress = (playing, trackId, trackPosition) => {
      setIsPlaying(playing);
      setCurrentTrackId(trackId);
      setCurrentTrackPosition(trackPosition);

      let trackOffset = getTrackOffset(trackId);
      setCurrentPosition(trackOffset + trackPosition);
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
      announce(tr('Скорость') + ': ' + r + 'x');
  };

  const cycleRate = () => {
      const r = playerRef.current ? playerRef.current.switchRate(rate) : rate;
      setRate(r);
      announce(tr('Скорость') + ': ' + r + 'x');
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
      announce(tr('Фрагмент изменён'));
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

  const playLabel = isPlaying ? T('Пауза') : T('Воспроизведение');

  return (
    <Card
      role="region"
      aria-label={book && book.title ? `${T('Слушать')}: ${book.title}` : T('Аудиоплеер')}
      aria-describedby="player-shortcuts-hint"
      sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 6, boxShadow: kp.shadows.raised }}
    >
      <PlaylistPlayer book={book} track={book?.track} position={book?.position} rate={book?.rate} ref={playerRef} playlist={playlist} onProgress={onProgress}/>
      <VisuallyHidden id="player-shortcuts-hint">
        {T('Сочетания клавиш плеера') + '. ' + T('Пробел — воспроизведение или пауза. Стрелки влево и вправо — назад или вперёд на 30 секунд. Стрелки вверх и вниз с Shift, а также клавиши < и > — скорость.')}
      </VisuallyHidden>

      {/* Main transport: every control pairs its icon with a visible text label. */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        sx={{ gap: { xs: 1, md: 2 } }}
      >
        <Button
          variant="outlined"
          size="large"
          startIcon={<Replay30Icon aria-hidden="true" />}
          onClick={() => playerRef.current?.stepBackward()}
          aria-label={T('Назад на 30 секунд')}
          title={T('Назад на 30 секунд')}
          sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
        >
          {T('Назад на 30 секунд')}
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<SkipPreviousIcon aria-hidden="true" />}
          onClick={() => playerRef.current?.previosTrack()}
          aria-label={T('Предыдущий фрагмент')}
          sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
        >
          {T('Предыдущий фрагмент')}
        </Button>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: { xs: 1, md: 2 } }}>
          <Button
            variant="contained"
            onClick={() => playerRef.current?.playPause()}
            aria-label={playLabel}
            sx={{
              width: 80,
              height: 80,
              minWidth: 80,
              borderRadius: "50%",
              p: 0,
              "& .MuiButton-startIcon": { m: 0 },
            }}
            startIcon={isPlaying
              ? <PauseIcon aria-hidden="true" sx={{ fontSize: 44 }} />
              : <PlayArrowIcon aria-hidden="true" sx={{ fontSize: 44 }} />}
          >
            <VisuallyHidden>{playLabel}</VisuallyHidden>
          </Button>
          <Typography aria-hidden="true" sx={{ mt: 1, fontWeight: 700 }}>
            {playLabel}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="large"
          startIcon={<SkipNextIcon aria-hidden="true" />}
          onClick={() => playerRef.current?.nextTrack()}
          aria-label={T('Следующий фрагмент')}
          sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
        >
          {T('Следующий фрагмент')}
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<Forward30Icon aria-hidden="true" />}
          onClick={() => playerRef.current?.stepForward()}
          aria-label={T('Вперёд на 30 секунд')}
          title={T('Вперёд на 30 секунд')}
          sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
        >
          {T('Вперёд на 30 секунд')}
        </Button>
      </Stack>

      {/* Progress with big thumb (themed) and time text on both sides. */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Typography component="div" variant="body2" fontWeight="bold" sx={timerSx}>
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
        />
        <Typography component="div" variant="body2" fontWeight="bold" sx={timerSx}>
          <Timer value={totalTime} ariaPrefix={T('Общее время')}/>
        </Typography>
      </Stack>

      {/* Speed, chapter bookmark, volume — each with a visible text label. */}
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        sx={{ mt: 2, gap: { xs: 1.5, md: 3 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography component="span" id="player-speed-label" sx={{ fontWeight: 600 }}>
            {T('Скорость')}
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={cycleRate}
            aria-labelledby="player-speed-label player-speed-value"
            title={T('Скорость')}
            sx={{ borderWidth: 2, minWidth: 88, "&:hover": { borderWidth: 2 } }}
          >
            <span id="player-speed-value">{rate}x</span>
          </Button>
        </Box>
        <Button
          variant="outlined"
          size="large"
          startIcon={bookmarks?.length > 0
            ? <BookmarkIcon aria-hidden="true" />
            : <EmptyBookmarkIcon aria-hidden="true" />}
          onClick={() => { addBookmark(currentTrackId, Math.round(currentTrackPosition * 1000)); announce(tr('Закладка добавлена')); }}
          aria-label={T('Добавить закладку')}
          title={T('Добавить закладку')}
          sx={{ borderWidth: 2, "&:hover": { borderWidth: 2 } }}
        >
          {T('Добавить закладку')}
        </Button>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 1,
            flex: 1,
            minWidth: 200,
          }}
        >
          <VolumeUpIcon aria-hidden="true" sx={{ color: kp.p.textSecondary }} />
          <Typography component="label" htmlFor="player-volume" sx={{ fontWeight: 600 }}>
            {T('Громкость')}
          </Typography>
          <Slider
            id="player-volume"
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
            sx={{ maxWidth: 160 }}
          />
          <Typography aria-hidden="true" sx={{ fontVariantNumeric: "tabular-nums", color: kp.p.textSecondary }}>
            {volume} %
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
});

export default AudioPlayerSection;
