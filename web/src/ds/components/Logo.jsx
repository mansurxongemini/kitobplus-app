import { Box, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import T from "../../lib/translator";

// Знак: раскрытая книга, из которой выходит звуковая волна.
export const LogoMark = ({ size = 40, inverted = false }) => {
  const { kp } = useTheme();
  const bg = inverted ? kp.p.onInk : kp.p.primary;
  const fg = inverted ? kp.p.ink : kp.p.onPrimary;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="12" fill={bg} />
      <path d="M9 13.5c3.6-1.4 7.2-1 10 1.2v13.8c-2.8-2.2-6.4-2.6-10-1.2V13.5Z" fill={fg} />
      <path d="M31 13.5c-3.6-1.4-7.2-1-10 1.2v13.8c2.8-2.2 6.4-2.6 10-1.2V13.5Z" fill={fg} opacity=".72" />
      <path d="M24 9.5c1.4 1 2.3 2.4 2.3 4M27 7c2.3 1.6 3.8 4 3.8 6.6" stroke={kp.p.accent} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
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
      <Box
        component="span"
        aria-hidden="true"
        sx={{ fontFamily: "'Manrope Variable', sans-serif", fontWeight: 800, fontSize: "1.375rem", letterSpacing: "-0.03em" }}
      >
        Kitob<Box component="span" sx={{ color: inverted ? kp.p.cyan : kp.p.primary }}>Plus</Box>
      </Box>
    </Box>
  );
};

export default Logo;
