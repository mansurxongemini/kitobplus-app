import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Box, Divider, Stack, Typography, IconButton, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import useLibrary from "../LibraryContext";
import { add as updateComment, remove as removeComment } from "../lib/comments.ts";
import T from "../lib/translator.js";

export const Comment = ({ book, comment, onCommentUpdated, onCommentDeleted }) => { // Accept comment as a prop
  const { user } = useLibrary();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Default comment structure if comment prop is not sufficient
  const defaultComment = {
    users_name: T("Аноним"),
    created_at: new Date().toISOString(), // Or a default date string
    comment: T("Нет текста комментария."),
    // Add other fields like views, likes if necessary, with default values
    views: 0,
    likes: 0,
  };

  // Merge provided comment with defaults to ensure all fields are present
  const displayComment = { ...defaultComment, ...comment };

  // Check if current user can edit/delete this comment
  const canEditComment = user && displayComment.users_id && user.id === displayComment.users_id;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return T("Дата не указана");
    const date = new Date(dateString);
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString()}`;
  };

  const formatUser = (userString) => {
    if (!userString) return T("Аноним");
    return userString.replace(/^\S+\s(\S.+)$/, '$1');
  };

  // Handle edit comment
  const handleEditComment = () => {
    setEditText(displayComment.comment);
    setIsEditing(true);
    setError("");
  };

  // Handle save edited comment
  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      setError(T("Комментарий не может быть пустым"));
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await updateComment(displayComment.id, book.id, editText);
      setIsEditing(false);
      if (onCommentUpdated) {
        onCommentUpdated();
      }
    } catch (err) {
      console.error("Failed to update comment:", err);
      setError(T("Не удалось обновить комментарий. Попробуйте еще раз."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText("");
    setError("");
  };

  // Handle delete comment
  const handleDeleteComment = async () => {
    if (!window.confirm(T("Вы уверены, что хотите удалить этот комментарий?"))) {
      return;
    }

    setIsSubmitting(true);
    try {
      await removeComment(displayComment.id, book.id);
      if (onCommentDeleted) {
        onCommentDeleted();
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError(T("Не удалось удалить комментарий. Попробуйте еще раз."));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper", py: 2 }}>
      <Box sx={{ display: "flex", ml: 1 }}>
        <Avatar
          src={displayComment.users_avatar || "https://example.com/placeholder-avatar.jpg"} 
          alt={formatUser(displayComment.user)}
          sx={{ width: 51, height: 51 }}
        />
        <Box sx={{ ml: 2, width: "100%" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography
              variant="h3"
              sx={{
                opacity: 0.8,
                color: "secondary.main",
                fontSize: "20px",
                fontWeight: "bold",
                lineHeight: "28px",
              }}
            >
              {formatUser(displayComment.user)}
            </Typography>

            <Divider
              orientation="vertical"
              sx={{ bgcolor: "primary.main", height: 20 }}
            />

            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon
                sx={{ width: 16, height: 16, color: "#adacae" }}
              />
              <Typography
                sx={{
                  color: "#adacae",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "16px",
                }}
              >
                {formatDate(displayComment.created_at)}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                sx={{
                  color: "#adacae",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "16px",
                }}
              >
                {displayComment.views || 0}
              </Typography>
              <VisibilityIcon
                sx={{ width: 16, height: 16, color: "#adacae" }}
              />
            </Stack>

            {canEditComment && !isEditing && (
              <IconButton
                onClick={handleEditComment}
                size="small"
                sx={{ color: "#949494" }}
                disabled={isSubmitting}
                aria-label={T('Редактировать комментарий')}
                title={T('Редактировать комментарий')}
              >
                <EditIcon sx={{ width: 16, height: 16 }} />
              </IconButton>
            )}
          </Stack>

          {isEditing ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                multiline
                rows={3}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveEdit}
                  disabled={isSubmitting || !editText.trim()}
                  size="small"
                >
                  {isSubmitting ? T('Сохранение...') : T('Сохранить')}
                </Button>
                {canEditComment && (
                  <Button
                    color="error"
                    onClick={handleDeleteComment}
                    disabled={isSubmitting}
                    size="small"
                    startIcon={<DeleteIcon />}
                  >
                    {T('Удалить комментарий')}
                  </Button>
                )}
                <Button
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  size="small"
                >
                  {T('Отмена')}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Typography
              sx={{
                mt: 2,
                opacity: 0.5,
                color: "darkText.main",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "25.2px",
              }}
            >
              {displayComment.comment}
            </Typography>
          )}

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
            <Typography
              sx={{
                color: "#949494",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "19.6px",
              }}
            >
              {displayComment.likes || 0}
            </Typography>

            <ThumbUpOutlinedIcon
              aria-hidden="true"
              sx={{ width: 24, height: 24, color: "#949494" }}
            />

            <ChatBubbleOutlineIcon
              aria-hidden="true"
              sx={{ width: 24, height: 24, color: "#949494" }}
            />

            <Typography
              sx={{
                color: "#949494",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "19.6px",
              }}
            >
              0
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Comment;
