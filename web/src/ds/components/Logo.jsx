import { Box, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import T from "../../lib/translator";

// Знак: четыре столбика эквалайзера — «книга, которая звучит». Движение отключается при reduced motion.
export const LogoMark = ({ size = 22, inverted = false, animated = true }) => {
  const { kp } = useTheme();
  const color = inverted ? kp.p.cyan : kp.p.primary;
  const heights = [0.45, 1, 0.68, 0.86];
  return (
    <Box aria-hidden="true" sx={{ display: "inline-flex", alignItems: "center", gap: "3px", height: size }}>
      {heights.map((h, i) => (
        <Box
          key={i}
          sx={{
            width: Math.max(3, Math.round(size / 7)), height: `${h * 100}%`, borderRadius: 4, bgcolor: color, transformOrigin: "center",
            animation: animated ? `kpEq 1.1s ease-in-out ${[0, 0.2, 0.4, 0.1][i]}s infinite alternate` : "none",
            "@keyframes kpEq": { to: { transform: "scaleY(.45)" } },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
      ))}
    </Box>
  );
};

const Logo = ({ inverted = false, to = "/" }) => {
  const { kp } = useTheme();
  return (
    <Box
      component={RouterLink}
      to={to}
      aria-label={T("KitobPlus — главная страница")}
      sx={{
        display: "inline-flex", alignItems: "center", gap: 1.25, textDecoration: "none",
        color: inverted ? kp.p.onInk : kp.p.text, borderRadius: 2, minHeight: 48,
      }}
    >
      <LogoMark inverted={inverted} />
      <Box component="span" aria-hidden="true" sx={{ fontFamily: kp.fonts.heading, fontWeight: 800, fontSize: "1.3125rem", letterSpacing: "-0.04em" }}>
        KitobPlus
      </Box>
    </Box>
  );
};

export default Logo;
