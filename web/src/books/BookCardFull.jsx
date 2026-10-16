import Bookmark from "@mui/icons-material/BookmarkOutlined";
import PlayCircle from "@mui/icons-material/PlayCircle";
import {
  Box,
  Card,
  Chip,
  IconButton,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { getHost } from "../lib/api";
import T from "../lib/translator";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const bookData = {
  title: "Гарри Поттер: Дары смерти (часть 1)",
  author: "Жоанна Кэтлин Роулинг",
  narrator: "Талипова Зилола",
  rating: 4.6,
  genres: ["Бизнес-книги", "Менеджмент"],
  tags: [
    "#философия",
    "#современная_литература",
    "#философия",
    "#классическая",
  ],
  coverImage: "/image-5.png",
};

const BookCardFull = ({book}) => {
  const navigate = useNavigate()
  const theme = useTheme()
  
  return (
    <Card
      sx={{
        minWidth: { xs: "100%", md: 785 },
        width: '100%',
        height: { xs: "auto", md: 170 },
        minHeight: { xs: 200, md: 170 },
        bgcolor: theme.palette.background.paper,
        position: "relative",
        p: { xs: 1.5, md: 2 },
        boxShadow: theme.palette.mode === 'dark'
          ? "0px 4px 24px rgba(0, 0, 0, 0.3)"
          : "0px 4px 24px rgba(38, 38, 38, 0.07)",
        border: "1px solid",
        borderColor: theme.palette.divider,
      }}

    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
        {/* Book Cover with Play Button */}
        <Box
          sx={{
            width: { xs: "100%", sm: 138 },
            height: { xs: 180, sm: 138 },
            maxWidth: { xs: 138, sm: 138 },
            mx: { xs: "auto", sm: 0 },
            flexShrink: 0,
            backgroundImage: 'url(' + getHost() + '/pics/' + (book.pics_ext ? 'books/' + book.id + '.' + book.pics_ext : 'book.png') + ')',
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            '& .hover-button': {
              opacity: 0,
              transform: 'scale(0.8)',
              transition: 'all 0.3s ease',
            },
            '&:hover .hover-button': {
              opacity: 1,
              transform: 'scale(1)',
            },
            cursor: 'pointer',
          }}
          onClick={_ => navigate('/books/' + book.id)}
        >
          <IconButton
            tabIndex={-1}
            className="hover-button"
            sx={{
              //width: 160,
              //height: 160,
              //bgcolor: "rgba(255, 255, 255, 0.7)",
              //"&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <PlayCircle sx={{ width: 90, height: 90, color: "#FFFFFF" }} />
          </IconButton>
        </Box>

        {/* Book Information */}
        <Box sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1.5, sm: 0 }, flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              mb: 1,
              fontFamily: "'PT_Root_UI-Bold', Helvetica",
              fontSize: { xs: "16px", md: "18px" },
            }}
          >
            <Link aria-label={book.authors_name + '–' + book.title + ' (' + book.dictors_name + ')'} to={"/books/" + book.id} style={{textDecoration: 'none', color: 'inherit'}}>{book.title}</Link>
          </Typography>

          <Stack spacing={1} sx={{ mb: { xs: 1, md: 2 } }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: "'PT_Root_UI-Medium', Helvetica",
                  fontWeight: 500,
                  fontSize: { xs: 14, md: 16 },
                  flexShrink: 0,
                }}
              >
                {T('Автор')}:
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontFamily: "'PT_Root_UI-Medium', Helvetica",
                  fontWeight: 500,
                  fontSize: { xs: 14, md: 16 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {book.authors_name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: "'PT_Root_UI-Medium', Helvetica",
                  fontWeight: 500,
                  fontSize: { xs: 14, md: 16 },
                  flexShrink: 0,
                }}
              >
                {T('Диктор')}:
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontFamily: "'PT_Root_UI-Medium', Helvetica",
                  fontWeight: 500,
                  fontSize: { xs: 14, md: 16 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {book.dictors_name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: "'PT_Root_UI-Medium', Helvetica",
                  fontWeight: 500,
                  fontSize: { xs: 14, md: 16 },
                  flexShrink: 0,
                }}
              >
                {T('Жанр')}:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, overflow: "hidden" }}>
                {book?.genres_name?.split(',').map((genre, index) => (
                  <React.Fragment key={index}>
                    <Typography
                      sx={{
                        color: "#0066CC",
                        fontFamily: "'PT_Root_UI-Medium', Helvetica",
                        fontWeight: 500,
                        fontSize: { xs: 14, md: 16 },
                        whiteSpace: "nowrap",
                      }}
                    >
                      {genre}
                    </Typography>
                    {index < book?.genres_name?.split(',').length - 1 && (
                      <Typography sx={{ mx: 0.5, color: theme.palette.text.secondary }}>•</Typography>
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          </Stack>

          {/* Tags */}
          {false && <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {bookData.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.1)" : "#F5F5F5",
                  color: theme.palette.text.primary,
                  fontFamily: "'PT_Root_UI-Medium', Helvetica",
                  fontWeight: 500,
                  fontSize: 16,
                  borderRadius: 1,
                  py: 0.5,
                }}
              />
            ))}
          </Box>}
        </Box>

        {/* Rating - hide on mobile */}
        <Box
          role="img"
          aria-label={T('Рейтинг') + ': ' + (book?.rating || bookData.rating) + ' / 5'}
          sx={{ display: { xs: "none", sm: "flex" }, alignItems: "flex-start", ml: 2 }}
        >
          <Rating
            aria-hidden="true"
            value={Number(book?.rating) || bookData.rating}
            precision={0.1}
            readOnly
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#F7C54D",
              },
              "& .MuiRating-iconEmpty": {
                color: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.3)" : "#E9E9E9",
              },
            }}
          />
          <Typography
            aria-hidden="true"
            sx={{
              ml: 1,
              fontWeight: "bold",
              color: theme.palette.text.primary,
              fontFamily: "'PT_Root_UI-Bold', Helvetica",
              fontSize: 16,
            }}
          >
            {book?.rating || bookData.rating}
          </Typography>
        </Box>

        {/* Bookmark Button */}
        <IconButton
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            width: 44,
            height: 44,
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.text.primary,
            },
          }}
          tabIndex={-1}
        >
          <Bookmark sx={{ width: 28, height: 28 }} />
        </IconButton>
      </Box>
    </Card>
  );
};

export default BookCardFull;
