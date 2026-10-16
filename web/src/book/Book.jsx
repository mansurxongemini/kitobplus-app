import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import LibraryAddCheckOutlined from "@mui/icons-material/LibraryAddCheckOutlined";
import LibraryAddOutlined from "@mui/icons-material/LibraryAddOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Button, Tab, Tabs, Typography, useTheme, alpha } from "@mui/material";
import React from "react";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import AudioPlayerSection from "./AudioPlayerSection.js";
import AddCommentSection from "./AddCommentSection.jsx";
import Comment from "../books/Comment.jsx";
import { get as getBookmarks, add as addCloudBookmark, remove as removeCloudBookmark } from "../lib/bookmarks.ts";
import { request } from "../lib/api.js";
import { get as getComments } from "../lib/comments.ts";
import { add as addToBookshelf, remove as removeFromBookshelf } from "../lib/bookshelf.ts";
import Playlist from "./Playlist.jsx";
import LikeSection from "./Like.jsx";
import Recommendations from "./Recommendations.jsx";
import PageShell from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import BookCover from "../ds/components/BookCover";
import { coverUrl, useFormatDuration } from "../ds/format";
import { coverGradients } from "../ds/tokens";
import { coverTransitionName } from "../ds/motion";
import { getHost } from "../lib/api";
import { useRouteA11y } from "../lib/a11y";
import T, { tr } from "../lib/translator.js";

const Book = () => {
  const { kp } = useTheme();
  const fmt = useFormatDuration();

  const [book, setBook] = React.useState({});
  const params = useParams();
  const [ready, setReady] = React.useState(false);
  const audioPlayerRef = React.useRef();
  const [playlist, setPlaylist] = React.useState([]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrackId, setCurrentTrackId] = React.useState(0);
  const [comments, setComments] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [bookmarks, setBookmarks] = React.useState([]);
  const [bookshelfed, setBookshelfed] = React.useState(false);

  const addBookmark = (tracks_id, pos) => bookmarkFunc(addCloudBookmark, tracks_id, pos);
  const removeBookmark = (tracks_id, pos) => bookmarkFunc(removeCloudBookmark, tracks_id, pos);
  useRouteA11y(book && book.title ? book.title : T("Аудиокниги"));

  const bookmarkFunc = async (func, tracks_id, pos) => {
    try {
      const result = await func(book.id, tracks_id, pos);
      setBookmarks(result);
    } catch (e) {
      alert(tr("Ошибка во время работы с закладками"));
    }
  };

  const saveBookshelfed = (_) => {
    const func = (_ ? addToBookshelf : removeFromBookshelf);
    setBookshelfed(_);
    func(book.id).catch((e) => {
      setBookshelfed(!_);
      alert(e);
    });
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (params?.id) {
      const fetchBookAndComments = async () => {
        try {
          const bookDataResponse = await request("books/get", { id: params.id });
          const currentBook = bookDataResponse.data;
          setBook(currentBook);
          setBookshelfed(
            currentBook?.bookshelf_dt !== null && currentBook?.bookshelf_dt !== undefined
          );
          if (currentBook && currentBook.id) {
            try {
              const fetchedComments = await getComments(currentBook.id);
              setComments(fetchedComments || []);
            } catch (commentsError) {
              setComments([]);
            }
            try {
              const fetchedBookmarks = await getBookmarks(currentBook.id);
              setBookmarks(fetchedBookmarks || []);
            } catch (bookmarksError) {
              setBookmarks([]);
            }
          }
        } catch (bookError) {
          // keep the page usable even when the book fails to load
        } finally {
          setReady(true);
        }
      };
      fetchBookAndComments();
    }
  }, [params]);

  const refetchComments = async () => {
    if (book && book.id) {
      try {
        const fetchedComments = await getComments(book.id);
        setComments(fetchedComments || []);
      } catch (error) {
        // keep existing comments on refresh failure
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Пока книга грузится, шапку рисуем по данным карточки из каталога (state перехода) —
  // так обложка «прилетает» на своё место сразу, без пустого кадра.
  const location = useLocation();
  const preview = location.state && location.state.book;
  const sameId = (b) => b && b.id !== undefined && String(b.id) === String(params.id);
  const hero = sameId(book) ? book : sameId(preview) ? preview : book;
  const heroCover = coverUrl(getHost(), hero);
  const heroTint = coverGradients[Math.abs(Number(params.id) || 0) % coverGradients.length][0];

  const rating = Number(book?.rating) || 0;
  const duration = fmt(hero?.seconds);
  const shelfLabel = bookshelfed ? T("Снять с книжной полки") : T("Поставить на книжную полку");

  return (
    <PageShell title={hero && hero.title ? hero.title : T("Аудиокниги")}>
      {/* Шапка книги: фон мягко «светится» цветом обложки (размытая обложка или её палитра). */}
      <Box
        component="section"
        aria-labelledby="book-title"
        sx={{ position: "relative", overflow: "hidden", isolation: "isolate", bgcolor: kp.p.bg }}
      >
        {!kp.isContrast && (
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute", inset: "-15% -10% -25%", zIndex: -1, pointerEvents: "none",
              background: `radial-gradient(60% 70% at 18% 30%, ${alpha(heroTint, kp.p.mode === "dark" ? 0.38 : 0.26)}, transparent 70%), radial-gradient(50% 60% at 90% 0%, ${alpha(kp.p.primary, kp.p.mode === "dark" ? 0.16 : 0.1)}, transparent 70%)`,
              animation: "kpAmbient 18s ease-in-out infinite alternate",
              "@keyframes kpAmbient": { to: { transform: "translate3d(4%, 3%, 0) scale(1.08)" } },
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              "&::before": heroCover ? {
                content: '""', position: "absolute", left: "-5%", top: "-10%", width: "55%", height: "120%",
                backgroundImage: `url("${heroCover}")`, backgroundSize: "cover", backgroundPosition: "center",
                filter: "blur(90px) saturate(1.5)", opacity: kp.p.mode === "dark" ? 0.4 : 0.32,
              } : undefined,
              "&::after": {
                content: '""', position: "absolute", inset: 0,
                background: `linear-gradient(180deg, transparent 55%, ${kp.p.bg} 92%)`,
              },
            }}
          />
        )}
        <Container sx={{ py: { xs: 4, md: 7 } }}>
          <Breadcrumbs
            aria-label={T("Вы находитесь здесь")}
            separator={<NavigateNextIcon fontSize="small" aria-hidden="true" />}
            sx={{ mb: 3, "& a, & span": { fontSize: "1rem" } }}
          >
            <Box component={RouterLink} to="/" sx={{ color: kp.p.textSecondary }}>
              {T("Главная")}
            </Box>
            <Box component={RouterLink} to="/books" sx={{ color: kp.p.textSecondary }}>
              {T("Аудиокниги")}
            </Box>
            <Box component="span" aria-current="page" sx={{ color: kp.p.text, fontWeight: 600 }}>
              {hero?.title || "…"}
            </Box>
          </Breadcrumbs>

          <Box
            sx={{
              display: "grid",
              gap: { xs: 4, md: 6 },
              gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
              alignItems: "start",
            }}
          >
            <Box sx={{ maxWidth: { xs: 220, md: "none" }, width: "100%" }}>
              <BookCover
                book={hero && hero.id ? hero : { id: params.id, title: hero?.title }}
                rounded={20}
                eager
                transitionName={coverTransitionName(params.id)}
                sx={kp.isContrast ? undefined : { boxShadow: "0 40px 80px -32px rgba(14,26,43,.55)" }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography id="book-title" variant="h1" tabIndex={-1} sx={{ fontSize: "clamp(1.9rem, 1.4rem + 2.2vw, 3rem)" }}>
                {hero?.title || (ready ? T("Книга не найдена") : "…")}
              </Typography>

              <Box
                component="dl"
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "auto 1fr" },
                  gap: { xs: 1, sm: "12px 20px" },
                  mt: 3,
                  mb: 0,
                  fontSize: "1.125rem",
                }}
              >
                {hero?.authors_name && (
                  <>
                    <Box component="dt" sx={{ color: kp.p.textSecondary }}>{T("Автор")}</Box>
                    <Box component="dd" sx={{ m: 0, fontWeight: 600 }}>
                      <Box
                        component={RouterLink}
                        to={`/person/authors/${hero.authors_id}`}
                        sx={{ color: kp.p.text }}
                      >
                        {hero.authors_name}
                      </Box>
                    </Box>
                  </>
                )}
                {hero?.dictors_name && (
                  <>
                    <Box component="dt" sx={{ color: kp.p.textSecondary }}>{T("Диктор")}</Box>
                    <Box component="dd" sx={{ m: 0, fontWeight: 600 }}>
                      <Box
                        component={RouterLink}
                        to={`/person/dictors/${hero.dictors_id}`}
                        sx={{ color: kp.p.text }}
                      >
                        {hero.dictors_name}
                      </Box>
                    </Box>
                  </>
                )}
                {hero?.genres && hero.genres.length > 0 && (
                  <>
                    <Box component="dt" sx={{ color: kp.p.textSecondary }}>{T("Жанр")}</Box>
                    <Box component="dd" sx={{ m: 0, fontWeight: 600 }}>
                      {hero.genres.map((genre, index) => (
                        <React.Fragment key={genre.id || index}>
                          {index > 0 && <span aria-hidden="true"> · </span>}
                          <Box
                            component={RouterLink}
                            to={`/person/genres/${genre.id}`}
                            sx={{ color: kp.p.primary }}
                          >
                            {genre.name}
                          </Box>
                        </React.Fragment>
                      ))}
                    </Box>
                  </>
                )}
                {hero?.publishers_name && (
                  <>
                    <Box component="dt" sx={{ color: kp.p.textSecondary }}>{T("Издатель")}</Box>
                    <Box component="dd" sx={{ m: 0 }}>{hero.publishers_name}</Box>
                  </>
                )}
                {duration && (
                  <>
                    <Box component="dt" sx={{ color: kp.p.textSecondary }}>{T("Длительность")}</Box>
                    <Box component="dd" sx={{ m: 0 }}>{duration}</Box>
                  </>
                )}
              </Box>

              {rating > 0 && (
                <Box
                  role="img"
                  aria-label={`${T("Рейтинг")}: ${rating} / 5`}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 2.5 }}
                >
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= Math.round(rating) ? (
                      <Star key={star} aria-hidden="true" sx={{ color: kp.p.accent }} />
                    ) : (
                      <StarBorder key={star} aria-hidden="true" sx={{ color: kp.p.textSecondary }} />
                    )
                  )}
                  <Typography aria-hidden="true" sx={{ ml: 1, fontWeight: 700 }}>
                    {rating}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 3 }}>
                <LikeSection book={book} />
                <Button
                  variant={bookshelfed ? "contained" : "outlined"}
                  size="large"
                  startIcon={bookshelfed ? <LibraryAddCheckOutlined aria-hidden="true" /> : <LibraryAddOutlined aria-hidden="true" />}
                  aria-pressed={bookshelfed}
                  onClick={() => saveBookshelfed(!bookshelfed)}
                  sx={{
                    minHeight: 56,
                    ...(!bookshelfed && { borderWidth: 2, "&:hover": { borderWidth: 2 } }),
                  }}
                >
                  {shelfLabel}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        {/* Premium player card. */}
        <AudioPlayerSection
          book={book}
          ref={audioPlayerRef}
          playlist={playlist}
          setPlaylist={setPlaylist}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTrackId={currentTrackId}
          setCurrentTrackId={setCurrentTrackId}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          addBookmark={addBookmark}
          removeBookmark={removeBookmark}
        />

        {/* Chapters / bookmarks / about / comments. */}
        <Box sx={{ mt: { xs: 5, md: 7 } }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label={T("Разделы книги")}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label={T("Главы")} id="book-tab-0" aria-controls="book-panel-0" />
            <Tab
              label={`${T("Закладки")}${bookmarks?.length > 0 ? ` (${bookmarks.length})` : ""}`}
              id="book-tab-1"
              aria-controls="book-panel-1"
            />
            <Tab label={T("О книге")} id="book-tab-2" aria-controls="book-panel-2" />
            <Tab
              label={`${T("Комментарии")}${comments?.length > 0 ? ` (${comments.length})` : ""}`}
              id="book-tab-3"
              aria-controls="book-panel-3"
            />
          </Tabs>

          <Box id="book-panel-0" role="tabpanel" aria-labelledby="book-tab-0" hidden={tabValue !== 0} sx={{ py: 3 }}>
            {tabValue === 0 && (
              <Playlist
                data={playlist}
                playlist={playlist}
                isPlaying={isPlaying}
                currentTrackId={currentTrackId}
                playTrack={audioPlayerRef?.current?.playTrack}
                type="playlist"
              />
            )}
          </Box>
          <Box id="book-panel-1" role="tabpanel" aria-labelledby="book-tab-1" hidden={tabValue !== 1} sx={{ py: 3 }}>
            {tabValue === 1 && (
              <Playlist
                data={bookmarks}
                playlist={playlist}
                isPlaying={false}
                currentTrackId={-1}
                playTrack={audioPlayerRef?.current?.playTrack}
                type="bookmarks"
                removeBookmark={removeBookmark}
              />
            )}
          </Box>
          <Box id="book-panel-2" role="tabpanel" aria-labelledby="book-tab-2" hidden={tabValue !== 2} sx={{ py: 3 }}>
            {tabValue === 2 && (
              <Typography sx={{ fontSize: "1.125rem", lineHeight: 1.7, maxWidth: 860 }}>
                {book?.annotation || T("Описание пока отсутствует")}
              </Typography>
            )}
          </Box>
          <Box id="book-panel-3" role="tabpanel" aria-labelledby="book-tab-3" hidden={tabValue !== 3} sx={{ py: 3 }}>
            {tabValue === 3 && (
              <>
                <AddCommentSection bookId={book.id} onCommentAdded={refetchComments} commentsCount={comments.length} />
                {comments.map((comment, index) => (
                  <Comment
                    key={comment.id || index}
                    book={book}
                    comment={comment}
                    onCommentUpdated={refetchComments}
                    onCommentDeleted={refetchComments}
                  />
                ))}
              </>
            )}
          </Box>
        </Box>

        <Recommendations book={book?.id} />
      </Container>
    </PageShell>
  );
};

export default Book;
