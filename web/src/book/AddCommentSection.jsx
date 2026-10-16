import ChatIcon from "@mui/icons-material/Chat";
import { Box, Button, Typography, TextField, Stack } from "@mui/material";
import React, { useState } from "react";
import { add as addComment } from "../lib/comments.ts";
import T, { tr } from "../lib/translator.js";

// "Add comment" block. Same API calls and flow as before, restyled to the
// design system: visible label, described-by error, large targets.
const AddCommentSection = ({ bookId, onCommentAdded, commentsCount }) => {
  const [newComment, setNewComment] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textFieldRef = React.useRef(null);
  const fieldId = React.useId();
  const errorId = `${fieldId}-error`;

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError(tr("Комментарий не может быть пустым"));
      return;
    }
    if (!bookId) {
      setError(tr("Не удалось определить ID книги"));
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await addComment(0, bookId, newComment);
      setNewComment("");
      setShowInput(false);
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      setError(tr("Не удалось добавить комментарий. Попробуйте еще раз."));
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
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h3" component="h3">
            {T("Комментарии")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", ml: 2, color: "text.secondary" }}>
            <ChatIcon fontSize="small" aria-hidden="true" sx={{ mr: 0.5 }} />
            <Typography variant="body2" aria-label={`${T("Комментарии")}: ${commentsCount || 0}`}>
              {commentsCount || 0}
            </Typography>
          </Box>
        </Box>

        {!showInput && (
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setShowInput(true);
              setTimeout(() => {
                textFieldRef.current?.focus();
              }, 0);
            }}
          >
            {T("Комментировать")}
          </Button>
        )}
      </Box>

      {showInput && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            id={fieldId}
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
            aria-describedby={error ? errorId : undefined}
            FormHelperTextProps={{ id: error ? errorId : undefined }}
            disabled={isSubmitting}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={handleAddComment}
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? T("Отправка...") : T("Отправить")}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                setShowInput(false);
                setError("");
                setNewComment("");
              }}
              disabled={isSubmitting}
            >
              {T("Отмена")}
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default AddCommentSection;
