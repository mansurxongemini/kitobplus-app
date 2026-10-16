import Star from "@mui/icons-material/Star";
import { Box, Chip, Stack, Typography, useTheme, Tabs, Tab } from "@mui/material";
import React, { useState, useEffect } from "react"; // Added useState, useEffect
import { useLocation, useParams } from "react-router-dom";
import AudioPlayerSection from "./AudioPlayerSection.js";
import AddCommentSection from "./AddCommentSection.jsx"; // Corrected import path
import Comment from "../books/Comment.jsx"; // Corrected import path
import { getHost, getToken } from '../lib/api';
import { useLocalStorage } from '@uidotdev/usehooks';
//import { get as getPlaybackPosition } from '../lib/bookmarks.ts';
import { get as getBookmarks } from '../lib/bookmarks.ts';
import { request } from '../lib/api.js';
import { get as getComments } from '../lib/comments.ts'; // Import getComments
import Playlist from "./Playlist.jsx";
import T from '../lib/translator.js';
import Navigation from "../parts/Navigation.jsx";
import FooterSection from "../parts/FooterSection.jsx";
import { Link } from "react-router-dom";
import { add as addCloudBookmark, remove as removeCloudBookmark } from "../lib/bookmarks.ts";
import Recommendations from "./Recommendations.jsx";
import { useRouteA11y } from "../lib/a11y";
//import Comments from './comments.js';

const Book = ({id}) => {
  const theme = useTheme();
  
  // Book details data
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

  const addBookmark = (tracks_id, pos) => bookmarkFunc(addCloudBookmark, tracks_id, pos)
  const removeBookmark = (tracks_id, pos) => bookmarkFunc(removeCloudBookmark, tracks_id, pos)
  useRouteA11y(book && book.title ? book.title : T('Аудиокниги'));
  
  const bookmarkFunc = async (func, tracks_id, pos) => {
    try {
      console.log("bookmarkFunc");
      const result = await func(book.id, tracks_id, pos);
      console.log(" result:", result);
      setBookmarks(result);
    } catch (e) {
      alert(T("Ошибка во время работы с закладками"));
    }
  }

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (params?.id) {
      const fetchBookAndComments = async () => {
        try {
          const bookDataResponse = await request('books/get', { id: params.id });
          const currentBook = bookDataResponse.data;
          setBook(currentBook);
          if (currentBook && currentBook.id) {
            try {
              const fetchedComments = await getComments(currentBook.id);
              setComments(fetchedComments || []);
            } catch (commentsError) {
              console.error("Failed to fetch comments:", commentsError);
              setComments([]);
            }
            
            try {
              const fetchedBookmarks = await getBookmarks(currentBook.id);
              setBookmarks(fetchedBookmarks || []);
            } catch (bookmarksError) {
              console.error("Failed to fetch bookmarks:", bookmarksError);
              setBookmarks([]);
            }
          }
        } catch (bookError) {
          console.error("Failed to fetch book details:", bookError);
        } finally {
          setReady(true);
        }
      };
      fetchBookAndComments();
    }
  }, [params]);

  
  const handleCommentAdded = async () => {
    if (book && book.id) {
      try {
        const fetchedComments = await getComments(book.id);
        setComments(fetchedComments || []);
      } catch (error) {
        console.error("Failed to re-fetch comments:", error);
      }
    }
  };

  const handleCommentUpdated = async () => {
    if (book && book.id) {
      try {
        const fetchedComments = await getComments(book.id);
        setComments(fetchedComments || []);
      } catch (error) {
        console.error("Failed to re-fetch comments:", error);
      }
    }
  };

  const handleCommentDeleted = async () => {
    if (book && book.id) {
      try {
        const fetchedComments = await getComments(book.id);
        setComments(fetchedComments || []);
      } catch (error) {
        console.error("Failed to re-fetch comments:", error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Navigation />
      <Box
        component="main"
        id="main_content"
        tabIndex={-1}
        sx={{
          bgcolor: theme.palette.background.default,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box sx={{ bgcolor: theme.palette.background.default, width: { xs: "100%", lg: "1440px" }, maxWidth: "1440px", position: "relative", display: 'flex', flexDirection: 'column' }}>
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
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, mt: { xs: 0, md: 3 }, ml: { xs: 0, md: 3 }, px: { xs: 2, md: 0 } }}>
            <Stack style={{width: '100%'}}>
              <Stack direction='row'>
                {/* Book cover thumbnail - hidden on mobile */}
                <Box
                  sx={{
                    width: 320,
                    height: 400,
                    bgcolor: "#0a1a2a",
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    mt: -32,
                    ml: 2,
                    backgroundImage: "url(" + getHost() + '/pics/' + (book.pics_ext ? 'books/' + book.id + '.' + book.pics_ext : 'book.png') + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "50% 50%",
                  }}
                  style={{position: 'absolute'}}
                />

                <Box sx={{ ml: { xs: 0, md: 48 }, mr: { xs: 0, md: 4 }, width: "100%" }}>
                  <Stack>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: "14px", sm: "16px", md: "18px" },
                            fontWeight: 500,
                          }}
                        >
                          {T('Автор')}:
                        </Typography>
                        <Link
                          to={"/person/authors/" + book?.authors_id}
                          style={{
                              color: theme.palette.text.primary,
                              fontSize: "18px",
                              fontWeight: 500,
                              textDecoration: 'none'
                            }}>
                          <Typography sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" } }}>
                            {book?.authors_name}
                          </Typography>
                        </Link>
                      </Stack>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: "14px", sm: "16px", md: "18px" },
                            fontWeight: 500,
                          }}
                        >
                          {T('Диктор')}:
                        </Typography>
                        <Link
                          to={"/person/dictors/" + book?.dictors_id}
                          style={{
                              color: theme.palette.text.primary,
                              fontSize: "18px",
                              fontWeight: 500,
                              textDecoration: 'none'
                            }}>
                          <Typography sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" } }}>
                            {book?.dictors_name}
                          </Typography>
                        </Link>
                      </Stack>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: "14px", sm: "16px", md: "18px" },
                            fontWeight: 500,
                          }}
                        >
                          {T('Жанр')}:
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          {book.genres && book.genres.map((genre, index) =>
                            <>
                              <Link
                                to={"/person/genres/" + genre.id}
                                style={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 500,
                                    textDecoration: 'none'
                                  }}>
                                <Typography sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" } }}>
                                  {genre.name}
                                </Typography>
                              </Link>
                              {index < book.genres.length - 1 && (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: theme.palette.text.primary,
                                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                                    fontWeight: 500,
                                  }}
                                >•</Typography>
                              )}
                            </>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: { xs: 2, md: 3 } }} flexWrap="wrap">
                      {[1, 2, 3, 4].map((star) => (
                        <Box
                          key={star}
                          sx={{
                            width: { xs: "24px", md: "32px" },
                            height: { xs: "24px", md: "32px" },
                            bgcolor: theme.palette.rating.main,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Star
                            sx={{ color: "white", width: { xs: "16px", md: "22px" }, height: { xs: "16px", md: "21px" } }}
                          />
                        </Box>
                      ))}
                      <Box
                        sx={{
                          width: { xs: "24px", md: "32px" },
                          height: { xs: "24px", md: "32px" },
                          bgcolor: theme.palette.rating.inactive,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Star sx={{ color: "white", width: { xs: "16px", md: "22px" }, height: { xs: "16px", md: "21px" } }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: theme.palette.secondary.main,
                          fontWeight: 700,
                          ml: 1,
                          fontSize: { xs: "18px", md: "24px" },
                        }}
                      >
                        {3 + Math.round(Math.random() * 3)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
              
              <Box>
                <Box sx={{ ml: { xs: 0, md: 3 }, mt: { xs: 3, md: 2 }, mr: { xs: 0, md: 4 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.secondary.main,
                      fontWeight: 700,
                      fontSize: { xs: "24px", md: "30px" },
                    }}
                  >
                    {T('О книге')}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      fontSize: { xs: "16px", md: "20px" },
                      maxWidth: { xs: "100%", md: "785px" },
                      mt: 2,
                      lineHeight: { xs: 1.5, md: 1.6 },
                    }}
                  >
                    {book.annotation}
                  </Typography>
                </Box>

                <AddCommentSection bookId={book.id} onCommentAdded={handleCommentAdded} commentsCount={comments.length} />
                {comments.map((comment, index) => (
                  <Comment 
                    key={comment.id || index} 
                    book={book}
                    comment={comment} 
                    onCommentUpdated={handleCommentUpdated}
                    onCommentDeleted={handleCommentDeleted}
                  />
                ))}
              </Box>
            </Stack>
            <Box sx={{ width: { xs: "100%", md: "auto" }, mt: { xs: 3, md: 0 } }}>
              <Box sx={{ width: { xs: "100%", md: 377 } }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant={{ xs: "fullWidth", md: "standard" }}
                  sx={{
                    bgcolor: theme.palette.lightfirst.main,
                    '& .MuiTab-root': {
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: { xs: '14px', md: '16px' },
                      textTransform: 'none',
                      minHeight: { xs: '44px', md: '48px' },
                    },
                    '& .Mui-selected': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Tab label={T('Плейлист')} />
                  <Tab label={T('Закладки') + (bookmarks?.length > 0 ? " [" + bookmarks?.length + "]" : "")} />
                </Tabs>
                
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
            </Box>
          </Box>
          <Recommendations book={book?.id}/>
        </Box>
      </Box>

      <FooterSection/>
    </>
  );
};

export default Book;
