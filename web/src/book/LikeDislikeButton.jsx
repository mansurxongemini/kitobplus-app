import { Stack, Typography, useTheme, Button } from "@mui/material";

// Like / dislike toggle: icon always paired with a visible text label and the
// pressed state (aria-pressed), never colour alone.
const LikeDislikeButton = ({ action, active, icon_active, icon_inactive, count, ariaLabel }) => {
  const { kp } = useTheme();
  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
      <Button
        onClick={action}
        aria-label={ariaLabel}
        aria-pressed={!!active}
        variant={active ? "contained" : "outlined"}
        size="large"
        startIcon={active ? icon_active : icon_inactive}
        sx={{
          minHeight: 56,
          ...(!active && {
            borderWidth: 2,
            borderColor: kp.p.borderStrong,
            color: kp.p.text,
            "&:hover": { borderWidth: 2, borderColor: kp.p.text },
          }),
        }}
      >
        {ariaLabel}
        {count > 0 && (
          <Typography
            component="span"
            aria-hidden="true"
            sx={{ ml: 0.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
          >
            {count}
          </Typography>
        )}
      </Button>
    </Stack>
  );
};

export default LikeDislikeButton;
