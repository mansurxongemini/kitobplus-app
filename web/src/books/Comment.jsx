import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Box, Divider, Stack, Typography, IconButton, TextField, Button, useTheme } from "@mui/material";
import React, { useState } from "react";
import useLibrary from "../LibraryContext";
import { add as updateComment, remove as removeComment } from "../lib/comments.ts";
import T, { tr } from "../lib/translator.js";

// Single comment. Same edit/delete logic and API calls as before; only the
// styling now comes from the design-system tokens.
export const Comment = ({ book, comment, onCommentUpdated, onCommentDeleted }) => {
  const { kp } = useTheme();
  const { user } = useLibrary();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const defaultComment = {
    users_name: T("Аноним"),
    created_at: new Date().toISOString(),
    comment: T("Нет текста комментария."),
    views: 0,
    likes: 0,
  };

  const displayComment = { ...defaultComment, ...comment };
  const canEditComment = user && displayComment.users_id && user.id === displayComment.users_id;

  const formatDate = (dateString) => {
    if (!dateString) return T("Дата не указана");
    const date = new Date(dateString);
    return `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${date.toLocaleDateString()}`;
  };

  const formatUser = (userString) => {
    if (!userString) return T("Аноним");
    return userString.replace(/^\S+\s(\S.+)$/, "$1");
  };

  const handleEditComment = () => {
    setEditText(displayComment.comment);
    setIsEditing(true);
    setError("");
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      setError(tr("Комментарий не может быть пустым"));
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
      setError(tr("Не удалось обновить комментарий. Попробуйте еще раз."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText("");
    setError("");
  };

  const handleDeleteComment = async () => {
    if (!window.confirm(tr("Вы уверены, что хотите удалить этот комментарий?"))) {
      return;
    }
    setIsSubmitting(true);
    try {
      await removeComment(displayComment.id, book.id);
      if (onCommentDeleted) {
        onCommentDeleted();
      }
    } catch (err) {
      setError(tr("Не удалось удалить комментарий. Попробуйте еще раз."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="article"
      sx={{
        width: "100%",
        bgcolor: kp.p.surface,
        border: `1px solid ${kp.p.border}`,
        borderRadius: 4,
        boxShadow: kp.shadows.card,
        p: { xs: 2, md: 3 },
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Avatar
          src={displayComment.users_avatar}
          alt=""
          aria-hidden="true"
          sx={{ width: 51, height: 51 }}
        />
        <Box sx={{ ml: 2, width: "100%", minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            <Typography variant="h3" sx={{ fontSize: "1.125rem" }}>
              {formatUser(displayComment.user)}
            </Typography>
            <Divider orientation="vertical" sx={{ height: 20 }} />
            <Stack direction="row" alignItems="center" spacing={1} sx={{ color: kp.p.textSecondary }}>
              <AccessTimeIcon aria-hidden="true" sx={{ width: 16, height: 16 }} />
              <Typography sx={{ fontSize: "0.875rem" }}>
                <time dateTime={displayComment.created_at}>{formatDate(displayComment.created_at)}</time>
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ color: kp.p.textSecondary }}>
              <Typography sx={{ fontSize: "0.875rem" }}>{displayComment.views || 0}</Typography>
              <VisibilityIcon aria-hidden="true" sx={{ width: 16, height: 16 }} />
            </Stack>
            {canEditComment && !isEditing && (
              <IconButton
                onClick={handleEditComment}
                disabled={isSubmitting}
                aria-label={T("Редактировать комментарий")}
                title={T("Редактировать комментарий")}
                sx={{ width: 48, height: 48 }}
              >
                <EditIcon />
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
                label={T("Ваш комментарий")}
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSaveEdit}
                  disabled={isSubmitting || !editText.trim()}
                >
                  {isSubmitting ? T("Сохранение...") : T("Сохранить")}
                </Button>
                {canEditComment && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={handleDeleteComment}
                    disabled={isSubmitting}
                    startIcon={<DeleteIcon aria-hidden="true" />}
                  >
                    {T("Удалить комментарий")}
                  </Button>
                )}
                <Button variant="text" size="large" onClick={handleCancelEdit} disabled={isSubmitting}>
                  {T("Отмена")}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Typography sx={{ mt: 2, fontSize: "1.125rem", lineHeight: 1.65 }}>
              {displayComment.comment}
            </Typography>
          )}

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2, color: kp.p.textSecondary }}>
            <Typography sx={{ fontSize: "0.875rem" }}>{displayComment.likes || 0}</Typography>
            <ThumbUpOutlinedIcon aria-hidden="true" sx={{ width: 24, height: 24 }} />
            <ChatBubbleOutlineIcon aria-hidden="true" sx={{ width: 24, height: 24 }} />
            <Typography sx={{ fontSize: "0.875rem" }}>0</Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Comment;
