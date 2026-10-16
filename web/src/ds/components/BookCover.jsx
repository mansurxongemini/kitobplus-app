import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { coverGradients } from "../tokens";
import { coverUrl } from "../format";
import { getHost } from "../../lib/api";

const pick = (id) => coverGradients[Math.abs(Number(id) || 0) % coverGradients.length];

// Обложка книги 2:3. Если картинки нет или она не загрузилась — аккуратная сгенерированная обложка
// с названием и автором. Обложка декоративная (alt=""), название книги всегда есть в тексте карточки.
const BookCover = ({ book, sx, rounded = 16, eager = false }) => {
  const { kp } = useTheme();
  const [failed, setFailed] = useState(false);
  const src = coverUrl(getHost(), book);
  const [c1, c2, fg] = pick(book && book.id);

  return (
    <Box
      sx={{
        position: "relative", width: "100%", aspectRatio: "2 / 3", borderRadius: `${rounded}px`, overflow: "hidden",
        bgcolor: kp.p.surfaceSunken, boxShadow: kp.isContrast ? "none" : "0 1px 2px rgba(0,0,0,.08), 0 10px 26px rgba(13,26,32,.16)",
        outline: kp.isContrast ? `2px solid ${kp.p.border}` : "none",
        ...sx,
      }}
    >
      {src && !failed ? (
        <Box
          component="img" src={src} alt="" loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute", inset: 0, p: "12%", display: "flex", flexDirection: "column", justifyContent: "space-between",
            color: fg, background: `linear-gradient(155deg, ${c1} 0%, ${c2} 100%)`,
          }}
        >
          <Box component="svg" viewBox="0 0 120 40" sx={{ width: "46%", opacity: 0.55 }}>
            {[6, 16, 26, 36, 46, 56, 66, 76, 86, 96, 106].map((x, i) => {
              const hgt = [10, 22, 34, 18, 28, 38, 24, 14, 30, 20, 12][i];
              return <rect key={x} x={x} y={(40 - hgt) / 2} width="5" height={hgt} rx="2.5" fill="currentColor" />;
            })}
          </Box>
          <Box>
            <Box sx={{ fontFamily: "'Manrope Variable', sans-serif", fontWeight: 800, lineHeight: 1.12, fontSize: "clamp(0.95rem, 0.6rem + 1.1vw, 1.35rem)", letterSpacing: "-0.02em", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {book && book.title}
            </Box>
            {book && book.authors_name && (
              <Box sx={{ mt: 1, fontSize: "0.8rem", fontWeight: 600, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {book.authors_name}
              </Box>
            )}
          </Box>
          <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "7%", background: "linear-gradient(90deg, rgba(0,0,0,.28), rgba(0,0,0,0))" }} />
        </Box>
      )}
    </Box>
  );
};

export default BookCover;
