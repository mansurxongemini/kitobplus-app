import ChatIcon from "@mui/icons-material/Chat";
import { Box, Button, Typography, TextField, Stack } from "@mui/material"; // Added TextField, Stack
import React, { useState } from "react";
import { add as addComment } from '../lib/comments.ts'; // Import addComment
import T from '../lib/translator.js';

const AddCommentSection = ({ bookId, onCommentAdded, commentsCount }) => {
  const [newComment, setNewComment] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textFieldRef = React.useRef(null);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError(T("Комментарий не может быть пустым"));
      return;
    }
    if (!bookId) {
        setError(T("Не удалось определить ID книги"));
        return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      // Assuming the 'add' function in comments.ts takes (id, books_id, comment)
      // and the first 'id' parameter might be user_id or null if not needed for adding.
      // For now, let's assume it's not strictly needed or handled by the backend if null.
      // You might need to adjust this based on your actual API requirements for 'id'.
      // If 'id' refers to a comment ID for replies, this structure needs more thought.
      // If 'id' is user_id, it should be fetched from auth context or similar.
      // For simplicity, passing 0 or null if the backend can infer user.
      await addComment(0, bookId, newComment); // Passing 0 as a placeholder for the first 'id'
      setNewComment("");
      setShowInput(false);
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError(T("Не удалось добавить комментарий. Попробуйте еще раз."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", py: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h2" color="secondary" sx={{ fontWeight: 700 }}>
            {T('Комментарии')}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <ChatIcon fontSize="small" sx={{ color: "#949494", mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: "#949494" }}>
              {commentsCount || 0}
            </Typography>
          </Box>
        </Box>

        {!showInput && (
          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              setShowInput(true);
              setTimeout(() => {
                textFieldRef.current?.focus();
              }, 0);
            }}
            sx={{
              bgcolor: "#e6f6f8",
              color: "primary.main",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "#d9f0f3",
              },
            }}
          >
            {T('Комментировать')}
          </Button>
        )}
      </Box>

      {showInput && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            inputRef={textFieldRef}
            label={T("Ваш комментарий")}
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            fullWidth
            error={!!error}
            helperText={error}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              disableElevation
              onClick={handleAddComment}
              disabled={isSubmitting || !newComment.trim()}
              sx={{
                bgcolor: "#e6f6f8",
                color: "primary.main",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#d9f0f3",
                },
                "&.Mui-disabled": {
                  bgcolor: "#f0f0f0",
                  color: "#b0b0b0",
                },
              }}
            >
              {isSubmitting ? T('Отправка...') : T('Отправить')}
            </Button>
            <Button
              onClick={() => {
                setShowInput(false);
                setError("");
                setNewComment("");
              }}
              disabled={isSubmitting}
            >
              {T('Отмена')}
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default AddCommentSection;
