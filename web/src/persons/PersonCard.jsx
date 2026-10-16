import Bookmark from "@mui/icons-material/BookmarkOutlined";
import BookIcon from "@mui/icons-material/MenuBook";
import CommentIcon from "@mui/icons-material/ChatBubbleOutline";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Avatar,
  Box,
  Card,
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

const PersonCard = ({ person, table }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const avatarUrl = person.pics_ext
    ? `${getHost()}/pics/${table}/${person.id}.${person.pics_ext}`
    : `${getHost()}/pics/${table === 'authors' ? 'author' : 'dictor'}.png`;

  return (
    <Card
      sx={{
        minWidth: 785,
        width: "100%",
        height: 170,
        bgcolor: theme.palette.background.paper,
        position: "relative",
        p: 2,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 4px 24px rgba(0, 0, 0, 0.3)"
            : "0px 4px 24px rgba(38, 38, 38, 0.07)",
        border: "1px solid",
        borderColor: theme.palette.divider,
      }}
    >
      <Box sx={{ display: "flex" }}>
        {/* Avatar */}
        <Box
          sx={{
            width: 138,
            height: 138,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/person/${table}/${person.id}`)}
        >
          <Avatar
            src={avatarUrl}
            alt=""
            sx={{
              width: 138,
              height: 138,
            }}
          />
        </Box>

        {/* Person Information */}
        <Box sx={{ ml: 2, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Name, Stats and Rating Row */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            {/* Name */}
            <Typography
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                fontFamily: "'PT_Root_UI-Bold', Helvetica",
                fontSize: 18,
              }}
            >
              <Link
                aria-label={person.name}
                to={`/person/${table}/${person.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {person.name}
              </Link>
            </Typography>

            {/* Stats with Icons (centered) */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <BookIcon sx={{ width: 18, height: 18, color: theme.palette.text.secondary }} />
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontFamily: "'PT_Root_UI-Medium', Helvetica",
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  {person.books_count}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CommentIcon sx={{ width: 18, height: 18, color: theme.palette.text.secondary }} />
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontFamily: "'PT_Root_UI-Medium', Helvetica",
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  {person.comments_count}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <DownloadIcon sx={{ width: 18, height: 18, color: theme.palette.text.secondary }} />
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontFamily: "'PT_Root_UI-Medium', Helvetica",
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  {person.downloads_count}
                </Typography>
              </Box>
            </Box>

            {/* Rating */}
            <Box
              role="img"
              aria-label={T('Рейтинг') + ': 4.5 / 5'}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Rating
                aria-hidden="true"
                value={4.5}
                precision={0.1}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#F7C54D",
                  },
                  "& .MuiRating-iconEmpty": {
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.3)"
                        : "#E9E9E9",
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
                4.5
              </Typography>
            </Box>
          </Box>

          {/* Annotation */}
          {person.annotation && (
            <Box sx={{ position: "relative" }}>
              {/* Invisible spacer for text wrapping */}
              <Box
                sx={{
                  float: "right",
                  width: 60,
                  height: 60,
                  shapeOutside: "inset(0 round 50%)",
                }}
              />
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: "'PT_Root_UI-Regular', Helvetica",
                  fontSize: 14,
                  lineHeight: 1.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {person.annotation}
              </Typography>
            </Box>
          )}
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

export default PersonCard;
