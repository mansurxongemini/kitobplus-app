import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { flushSync } from "react-dom";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useReducedMotion = () => {
  const [reduce, setReduce] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduce(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on));
  }, []);
  return reduce;
};

// Плавное появление при прокрутке. Содержимое всегда в DOM — экранные читалки видят его сразу;
// при prefers-reduced-motion анимации нет совсем.
export const Reveal = ({ children, delay = 0, y = 28, as = "div", sx, ...rest }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce);
  useEffect(() => {
    if (reduce) { setShown(true); return; }
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);
  return (
    <Box
      ref={ref} component={as} {...rest}
      sx={{
        opacity: shown ? 1 : 0, transform: shown ? "none" : `translateY(${y}px)`,
        transition: reduce ? "none" : `opacity .9s cubic-bezier(.2,.8,.2,1) ${delay}s, transform .9s cubic-bezier(.2,.8,.2,1) ${delay}s`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Заголовок, слова которого поднимаются по очереди. Текст для читалок — целиком, без разбиения.
export const RiseText = ({ lines, delay = 0, step = 0.12 }) => {
  const reduce = useReducedMotion();
  let i = 0;
  return lines.map((line, li) => (
    <Box component="span" key={li} sx={{ display: "block" }}>
      {li > 0 ? " " : null}
      {line.map((w, wi) => {
        const d = delay + (i++) * step;
        return (
          <React.Fragment key={wi}>
            <Box component="span" sx={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", pb: "0.08em", mb: "-0.08em" }}>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  animation: reduce ? "none" : `kpRise 1s cubic-bezier(.2,.8,.2,1) ${d}s both`,
                  "@keyframes kpRise": { from: { transform: "translateY(105%)" }, to: { transform: "none" } },
                }}
              >
                {w}
              </Box>
            </Box>
            {wi < line.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </Box>
  ));
};

// Акцентное слово: курсив с засечками, синим (из концепции D).
export const Accent = ({ children, color }) => {
  const { kp } = useTheme();
  return (
    <Box component="span" sx={{ fontFamily: kp.fonts.serif, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: color || kp.p.primary, fontSize: "1.06em" }}>
      {children}
    </Box>
  );
};

// Переход «обложка летит на страницу книги» (View Transitions API, где поддерживается).
// Обложка в карточке и на странице книги получают одинаковое view-transition-name.
export const coverTransitionName = (id) => `kp-cover-${id}`;
// state — данные для мгновенной отрисовки новой страницы (например, карточка книги).
export const navigateWithTransition = (navigate, to, sourceEl, id, state) => {
  const go = () => navigate(to, state ? { state } : undefined);
  if (!document.startViewTransition || prefersReducedMotion()) { go(); return; }
  if (sourceEl) sourceEl.style.viewTransitionName = coverTransitionName(id);
  // Прокрутка вверх — внутри перехода, чтобы новый кадр снимался уже с верха страницы, без рывка после.
  const t = document.startViewTransition(() => { flushSync(go); window.scrollTo({ top: 0, left: 0, behavior: "instant" }); });
  t.finished.finally(() => { if (sourceEl) sourceEl.style.viewTransitionName = ""; });
};
