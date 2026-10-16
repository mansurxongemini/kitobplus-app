import React from "react";
import { Button } from "@mui/material";

/**
 * Accessible, styled button for selecting a payment plan.
 * - Uses native button element (MUI Button) for keyboard and screen reader support.
 * - Adds visible focus ring and larger hit target.
 * - Supports selected/pressed state via aria-pressed.
 */
const PlanButton = ({
  children,
  onClick,
  color = "primary",
  variant = "contained",
  disabled = false,
  pressed = false,
  ariaLabel,
  fullWidth = true,
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      color={color}
      variant={variant}
      disabled={disabled}
      fullWidth={fullWidth}
      aria-pressed={pressed || undefined}
      aria-label={ariaLabel}
      sx={{
        // Visual improvements
        fontWeight: "bold",
        textTransform: "none",
        borderRadius: 2,
        px: 2.5,
        py: 1.25,
        minHeight: 44, // comfortable hit target
        justifyContent: "center",

        // Hover/active styles
        transition: (theme) =>
          theme.transitions.create(["background-color", "box-shadow", "transform"], {
            duration: 120,
          }),
        "&:hover": {
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
          transform: "translateY(-1px)",
        },
        "&:active": {
          transform: "translateY(0)",
          boxShadow: "none",
        },

        // Focus-visible ring for accessibility
        "&:focus-visible": {
          outline: "none",
          boxShadow:
            "0 0 0 3px rgba(59,130,246,0.45), 0 1px 2px rgba(0,0,0,0.05)",
        },

        // High contrast support
        "@media (prefers-contrast: more)": {
          "&:focus-visible": {
            boxShadow:
              "0 0 0 3px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.2)",
          },
        },

        // Reduced motion
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover, &:active": {
            transform: "none",
          },
        },
      }}
    >
      {children}
    </Button>
  );
};

export default PlanButton;
