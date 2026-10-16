import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Tabs, Tab, Skeleton, useTheme } from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ShuffleRounded from "@mui/icons-material/ShuffleRounded";
import RecordVoiceOverRounded from "@mui/icons-material/RecordVoiceOverRounded";
import KeyboardRounded from "@mui/icons-material/KeyboardRounded";
import HeadphonesRounded from "@mui/icons-material/HeadphonesRounded";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import PageShell, { SectionHeader } from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import { BookGrid } from "../ds/components/BookCard";
import { Reveal, RiseText, Accent, useReducedMotion } from "../ds/motion";
import { getHost, request } from "../lib/api";
import useLibrary from "../LibraryContext";
import { announce } from "../lib/a11y";
import T from "../lib/translator";

const fetchJson = (url) => fetch(url).then((r) => r.json());
const useBooks = (sort, perPage) => useSWR(`${getHost()}/srv/books.php?sort=${sort}&page=0&per_page=${perPage}`, fetchJson);
const SAMPLE_SECONDS = 12;

const Section = ({ children, labelledBy, id, sx }) => (
  <Box component="section" id={id} aria-labelledby={labelledBy} sx={{ py: { xs: 9, md: 14 }, scrollMarginTop: 90, ...sx }}>
    <Container>{children}</Container>
  </Box>
);

/* ---------- Дышащая звуковая волна (концепция A). Амплитуда растёт, когда звучит отрывок. ---------- */
const BreathingWave = ({ active }) => {
  const { kp } = useTheme();
  const reduce = useReducedMotion();
  const p1 = useRef(null), p2 = useRef(null);
  const target = useRef(14);
  useEffect(() => { target.current = active ? 54 : 14; }, [active]);
  useEffect(() => {
    let amp = 14, raf;
    const path = (a, f, ph) => {
      let d = "M0 130";
      for (let x = 0; x <= 1440; x += 12) {
        const env = Math.sin((x / 1440) * Math.PI);
        const y = 130 + Math.sin(x * f + ph) * a * env + Math.sin(x * f * 2.3 + ph * 1.7) * a * 0.35 * env;
        d += ` L${x} ${y.toFixed(1)}`;
      }
      return d;
    };
    if (reduce) {
      if (p1.current) p1.current.setAttribute("d", path(14, 0.008, 0));
      if (p2.current) p2.current.setAttribute("d", path(10, 0.011, 1));
      return undefined;
    }
    const frame = (ts) => {
      const t = ts / 1000;
      amp += (target.current - amp) * 0.06;
      const jitter = target.current > 20 ? Math.random() * 16 : 0;
      if (p1.current) p1.current.setAttribute("d", path(amp + jitter, 0.008, t * 1.6));
      if (p2.current) p2.current.setAttribute("d", path((amp + jitter) * 0.7, 0.011, t * 1.1 + 1));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  return (
    <Box component="svg" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true"
      sx={{ position: "absolute", left: 0, right: 0, top: "40%", width: "100%", height: { xs: 180, md: 260 }, transform: "translateY(-50%)", pointerEvents: "none", zIndex: 0 }}>
      <path ref={p1} fill="none" stroke={kp.p.primary} strokeWidth="2" />
      <path ref={p2} fill="none" stroke={kp.p.primary} strokeOpacity=".28" strokeWidth="1.5" />
    </Box>
  );
};

/* ---------- «Послушать 10 секунд»: бесплатный отрывок (/books/NNNNN.mp3) книги дня ---------- */
const useSample = (book) => {
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);
  const timers = useRef([]);
  const clear = () => { timers.current.forEach((t) => clearTimeout(t) || clearInterval(t)); timers.current = []; };
  const stop = () => {
    clear();
    if (audio.current) { audio.current.pause(); audio.current = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setPlaying(false);
  };
  // Если отрывок недоступен — зачитываем название и аннотацию голосом браузера.
  const speakFallback = () => {
    if (!window.speechSynthesis || !book) { stop(); return; }
    const text = [book.title, book.authors_name, String(book.annotation || "").replace(/<[^>]+>/g, " ")].filter(Boolean).join(". ");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "uz-UZ";
    u.rate = 0.95;
    u.onend = u.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(u);
  };
  const start = () => {
    if (!book) return;
    setPlaying(true);
    const a = new Audio(`${getHost()}/books/${String(book.id).padStart(5, "0")}.mp3`);
    audio.current = a;
    a.onerror = () => { if (audio.current === a) { audio.current = null; speakFallback(); } };
    a.play().then(() => {
      timers.current.push(setTimeout(() => {
        let v = 1;
        const fade = setInterval(() => {
          v -= 0.1;
          if (!audio.current || v <= 0) { clearInterval(fade); stop(); } else audio.current.volume = Math.max(0, v);
        }, 80);
        timers.current.push(fade);
      }, SAMPLE_SECONDS * 1000));
    }).catch(() => { if (audio.current === a) { audio.current = null; speakFallback(); } });
  };
  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps
  return { playing, toggle: () => (playing ? stop() : start()) };
};

const Hero = () => {
  const { kp } = useTheme();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [book, setBook] = useState(null);
  useEffect(() => {
    fetchJson(`${getHost()}/srv/books.php?sort=rand&page=0&per_page=1`).then((r) => setBook(r && r.data && r.data[0])).catch(() => {});
  }, []);
  const { playing, toggle } = useSample(book);
  const playingLabel = T("Звучит отрывок");
  useEffect(() => { if (playing) announce(playingLabel + (book ? ": " + book.title : "")); }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onKey = (e) => { if (e.code === "Space" && e.target === document.body) { e.preventDefault(); toggle(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const fade = (d) => ({ animation: reduce ? "none" : `kpFade .9s ${d}s both`, "@keyframes kpFade": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "none" } } });
  const random = async () => {
    const r = await fetchJson(`${getHost()}/srv/books.php?sort=rand&page=0&per_page=1`).catch(() => null);
    const b = r && r.data && r.data[0];
    if (b) navigate(`/books/${b.id}`);
  };

  return (
    <Box component="section" aria-labelledby="kp-hero-title" sx={{ position: "relative", overflow: "hidden", minHeight: "calc(100vh - 76px)", display: "grid", placeItems: "center", textAlign: "center", py: { xs: 8, md: 10 } }}>
      <BreathingWave active={playing} />
      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="overline" component="p" sx={{ color: kp.p.textSecondary, letterSpacing: "0.16em", ...fade(0) }}>{T("Онлайн-аудиобиблиотека")}</Typography>
        <Typography id="kp-hero-title" variant="h1" sx={{ mt: 2.5, fontSize: "clamp(3.25rem, 1.2rem + 9vw, 10rem)", lineHeight: 0.92, letterSpacing: "-0.058em" }}>
          <RiseText lines={[[T("Книги"), T("теперь")], [<Accent key="a">{T("звучат.")}</Accent>]]} />
        </Typography>
        <Typography variant="subtitle1" component="p" sx={{ mt: { xs: 3, md: 4 }, mx: "auto", maxWidth: 580, color: kp.p.textSecondary, fontSize: { xs: "1.125rem", md: "1.3125rem" }, ...fade(0.55) }}>
          {T("Узбекская и мировая литература в исполнении профессиональных дикторов. Для людей с нарушениями зрения — бесплатно.")}
        </Typography>

        <Box sx={{ mt: { xs: 4.5, md: 5.5 }, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, ...fade(0.8) }}>
          <Box
            component="button" type="button" onClick={toggle} aria-pressed={playing} disabled={!book}
            sx={{
              display: "inline-flex", alignItems: "center", gap: 2, p: "10px 30px 10px 10px", borderRadius: 999, border: 0, cursor: "pointer",
              bgcolor: kp.p.action, color: kp.p.onAction, font: "inherit", textAlign: "left", transition: "transform .25s",
              "&:hover": { transform: kp.isContrast ? "none" : "scale(1.03)" }, "&:focus-visible": kp.focusRing, "&:disabled": { opacity: 0.6, cursor: "wait" },
            }}
          >
            <Box aria-hidden="true" sx={{
              position: "relative", width: 60, height: 60, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: kp.p.primary, color: kp.p.onPrimary, flexShrink: 0,
              "&::before, &::after": reduce ? {} : { content: '""', position: "absolute", inset: -6, borderRadius: "50%", border: `2px solid ${kp.p.primary}`, animation: `kpRing ${playing ? 0.9 : 2.6}s infinite` },
              "&::after": { animationDelay: playing ? "0.45s" : "1.3s" },
              "@keyframes kpRing": { "0%": { transform: "scale(.9)", opacity: 0.9 }, "100%": { transform: "scale(1.55)", opacity: 0 } },
            }}>
              {playing ? <PauseRounded sx={{ fontSize: 30 }} /> : <PlayArrowRounded sx={{ fontSize: 32 }} />}
            </Box>
            <Box component="span">
              <Box component="span" sx={{ display: "block", fontWeight: 700, fontSize: "1.1875rem" }}>{playing ? T("Остановить") : T("Послушать 10 секунд")}</Box>
              {book && <Box component="span" sx={{ display: "block", fontSize: "0.9375rem", opacity: 0.8 }}>«{book.title}» — {book.authors_name}</Box>}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: kp.p.textSecondary }}>{T("Или нажмите пробел")}</Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
            <Button component={RouterLink} to="/books" variant="text" endIcon={<ArrowForwardRounded aria-hidden="true" />}>{T("Открыть каталог")}</Button>
            {book && <Button component={RouterLink} to={`/books/${book.id}`} variant="text">{T("Слушать полностью")}</Button>}
            <Button variant="text" startIcon={<ShuffleRounded aria-hidden="true" />} onClick={random}>{T("Случайная аудиокнига")}</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

/* ---------- Полка ---------- */
const Shelf = () => {
  const [tab, setTab] = useState(0);
  const { data, isLoading } = useBooks(tab === 0 ? "new" : "popular", 5);
  const tabs = [T("Последние"), T("Популярные")];
  return (
    <Section labelledBy="kp-shelf-title">
      <SectionHeader id="kp-shelf-title" title={<>{T("На этой неделе")} <Accent>{T("с любовью")}</Accent> {T("слушают")}</>} linkTo="/books" linkLabel={T("Все книги")} />
      <Tabs value={tab} onChange={(e, v) => setTab(v)} aria-label={T("Подборка книг")} sx={{ mb: { xs: 4, md: 5 } }}>
        {tabs.map((t, i) => <Tab key={t} label={t} id={`kp-shelf-tab-${i}`} aria-controls="kp-shelf-panel" />)}
      </Tabs>
      <Box id="kp-shelf-panel" role="tabpanel" aria-labelledby={`kp-shelf-tab-${tab}`}>
        <BookGrid books={data && data.data} loading={isLoading} label={tabs[tab]} />
      </Box>
    </Section>
  );
};

/* ---------- Манифест и цифры (A) ---------- */
const Statement = () => {
  const { kp } = useTheme();
  const { data } = useBooks("new", 1);
  const total = data && data.total;
  const stats = [
    { v: total ? Number(total).toLocaleString("ru-RU") : "—", l: T("аудиокниг в каталоге") },
    { v: "100%", l: T("работает с экранной читалкой") },
    { v: T("0 сум"), l: T("для читателей с инвалидностью по зрению") },
  ];
  return (
    <Section labelledBy="kp-about-title" id="about">
      <Typography id="kp-about-title" component="h2" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>{T("О нас")}</Typography>
      <Reveal>
        <Typography component="p" sx={{ fontFamily: kp.fonts.heading, fontWeight: 700, fontSize: "clamp(1.875rem, 1.1rem + 3.2vw, 3.75rem)", lineHeight: 1.12, letterSpacing: "-0.04em", maxWidth: 1080 }}>
          {T("Мы превращаем книгу в то, что можно")} <Accent>{T("услышать")}</Accent> {T("— с экранной читалкой, клавиатурой и наушниками, без мыши и без зрения.")}
        </Typography>
      </Reveal>
      <Box component="dl" sx={{ m: 0, mt: { xs: 6, md: 9 }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, borderTop: `1px solid ${kp.p.border}` }}>
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.1} sx={{ py: { xs: 3, md: 4 }, pr: 3, display: "flex", flexDirection: "column-reverse", borderBottom: { xs: `1px solid ${kp.p.border}`, md: "none" } }}>
            <Box component="dt" sx={{ color: kp.p.textSecondary, fontSize: "1.0625rem", mt: 0.5 }}>{s.l}</Box>
            <Box component="dd" sx={{ m: 0, fontFamily: kp.fonts.heading, fontWeight: 800, fontSize: "clamp(2.5rem, 1.8rem + 2.4vw, 4rem)", letterSpacing: "-0.05em", lineHeight: 1 }}>{s.v}</Box>
          </Reveal>
        ))}
      </Box>
    </Section>
  );
};

/* ---------- Жанры: редакционный указатель ---------- */
const Genres = () => {
  const { kp } = useTheme();
  const { data, isLoading } = useSWR(`${getHost()}/srv/genres.php?sort=popular`, fetchJson);
  const genres = ((data && data.data) || []).slice(0, 8);
  return (
    <Section labelledBy="kp-genres-title" sx={{ bgcolor: kp.isContrast ? kp.p.bg : kp.p.surfaceAlt }}>
      <SectionHeader id="kp-genres-title" title={<>{T("Выберите")} <Accent>{T("настроение")}</Accent></>} linkTo="/genres" linkLabel={T("Все жанры")} />
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, columnGap: 6 }}>
        {isLoading && Array.from({ length: 4 }).map((_, i) => <li key={i}><Skeleton height={88} /></li>)}
        {genres.map((g, i) => (
          <Reveal as="li" key={g.id} delay={(i % 2) * 0.08}>
            <Box component={RouterLink} to={`/person/genres/${g.id}`} sx={{
              display: "flex", alignItems: "center", gap: 2, minHeight: 88, borderTop: `1px solid ${kp.isContrast ? kp.p.border : kp.p.borderStrong}`, color: kp.p.text, textDecoration: "none",
              "& .kp-arrow": { transition: "transform .35s cubic-bezier(.2,.8,.2,1)" }, "&:hover .kp-arrow": { transform: "translateX(8px)" }, "&:hover .kp-gname": { color: kp.p.primary },
            }}>
              <Box className="kp-gname" component="span" sx={{ fontFamily: kp.fonts.heading, fontWeight: 700, fontSize: { xs: "1.5rem", md: "2rem" }, letterSpacing: "-0.035em", flex: 1, transition: "color .25s" }}>{g.name}</Box>
              {g.books_count && <Box component="span" sx={{ color: kp.p.textSecondary }}>{g.books_count} {T("книг (число)")}</Box>}
              <ArrowForwardRounded className="kp-arrow" aria-hidden="true" />
            </Box>
          </Reveal>
        ))}
      </Box>
    </Section>
  );
};

/* ---------- Доступ ---------- */
const Access = () => {
  const { kp } = useTheme();
  const { user } = useLibrary();
  const to = user ? "/profile" : "/login";
  const big = { fontSize: "clamp(1.75rem, 1.3rem + 1.4vw, 2.5rem)" };
  return (
    <Section labelledBy="kp-access-title">
      <SectionHeader id="kp-access-title" title={<>{T("Библиотека")} <Accent>{T("для всех")}</Accent></>} subtitle={T("Наша миссия — сделать знания и литературу доступными для всех, независимо от возможностей здоровья.")} />
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
        <Reveal sx={{ p: { xs: 4, md: 6 }, borderRadius: 8, bgcolor: kp.p.ink, color: kp.p.onInk, border: kp.isContrast ? `2px solid ${kp.p.border}` : "none", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="overline" component="p" sx={{ color: kp.p.cyan }}>{T("Бесплатно и без ограничений")}</Typography>
          <Typography variant="h3" component="h3" sx={{ color: kp.p.onInk, ...big }}>{T("Для людей с инвалидностью по зрению")}</Typography>
          <Typography sx={{ color: kp.p.onInkSecondary }}>{T("Для людей с инвалидностью по зрению весь каталог открыт полностью и бесплатно. Для доступа нужно подтвердить статус.")}</Typography>
          <Box sx={{ mt: "auto", pt: 2 }}>
            <Button component={RouterLink} to={to} variant="contained" size="large" sx={{ bgcolor: kp.p.onInk, color: kp.p.ink, "&:hover": { bgcolor: kp.p.onInk, opacity: 0.92 } }}>{T("Подтвердить статус")}</Button>
          </Box>
        </Reveal>
        <Reveal delay={0.1} sx={{ p: { xs: 4, md: 6 }, borderRadius: 8, bgcolor: kp.p.surface, border: `1px solid ${kp.p.border}`, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="overline" component="p" sx={{ color: kp.p.textSecondary }}>{T("Премиум для всех")}</Typography>
          <Typography variant="h3" component="h3" sx={big}>{T("7 дней Премиума бесплатно после регистрации")}</Typography>
          <Typography sx={{ color: kp.p.textSecondary }}>{T("Также мы предлагаем платную подписку «Премиум-доступ» для всех желающих. Средства от подписок направляются на развитие библиотеки, что позволяет нам расширять каталог и улучшать сервис.")}</Typography>
          <Box sx={{ mt: "auto", pt: 2 }}>
            <Button component={RouterLink} to={to} variant="contained" size="large">{user ? T("Управлять подпиской") : T("Попробовать бесплатно")}</Button>
          </Box>
        </Reveal>
      </Box>
    </Section>
  );
};

/* ---------- Удобство ---------- */
const Features = () => {
  const { kp } = useTheme();
  const items = [
    { icon: <RecordVoiceOverRounded />, t: T("Для экранных читалок"), d: T("Понятные подписи, заголовки и объявления для NVDA, JAWS, TalkBack и VoiceOver.") },
    { icon: <KeyboardRounded />, t: T("Управление с клавиатуры"), d: T("Пробел — пауза, стрелки — 30 секунд назад и вперёд, Shift и стрелки — скорость.") },
    { icon: <HeadphonesRounded />, t: T("Кнопки наушников"), d: T("Пауза и перемотка с наушников и экрана блокировки.") },
  ];
  return (
    <Section labelledBy="kp-features-title" sx={{ pt: { xs: 2, md: 4 } }}>
      <SectionHeader id="kp-features-title" title={<>{T("Удобно")} <Accent>{T("без зрения")}</Accent></>} subtitle={T("Каждой функцией можно пользоваться без мыши и без зрения.")} />
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: 0, md: 6 }, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        {items.map((it, i) => (
          <Reveal as="li" key={it.t} delay={i * 0.1} sx={{ pt: 3, pb: { xs: 4, md: 0 }, borderTop: `1px solid ${kp.p.border}` }}>
            <Box aria-hidden="true" sx={{ color: kp.p.primary, "& svg": { fontSize: 30 } }}>{it.icon}</Box>
            <Typography variant="h4" component="h3" sx={{ mt: 2 }}>{it.t}</Typography>
            <Typography sx={{ mt: 1, color: kp.p.textSecondary }}>{it.d}</Typography>
          </Reveal>
        ))}
      </Box>
    </Section>
  );
};

/* ---------- Новости: список строк ---------- */
const News = () => {
  const { kp } = useTheme();
  const [items, setItems] = useState(null);
  useEffect(() => {
    request("news/list", { page: 0, per_page: 3 }).then((r) => setItems((r && r.news) || [])).catch(() => setItems([]));
  }, []);
  if (items && !items.length) return null;
  return (
    <Section labelledBy="kp-news-title" sx={{ pt: { xs: 2, md: 4 } }}>
      <SectionHeader id="kp-news-title" title={T("Новости")} linkTo="/news" linkLabel={T("Все новости")} />
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, borderBottom: `1px solid ${kp.p.border}` }}>
        {(items || [null, null, null]).map((n, i) => (
          <Reveal as="li" key={n ? n.id : i} delay={i * 0.08}>
            {n ? (
              <Box component={RouterLink} to={`/news/${n.id}`} sx={{
                display: "grid", gridTemplateColumns: { xs: "1fr", md: "200px 1fr auto" }, gap: { xs: 1, md: 4 }, alignItems: "baseline",
                py: { xs: 3, md: 4 }, borderTop: `1px solid ${kp.p.border}`, color: kp.p.text, textDecoration: "none",
                "& .kp-arrow": { transition: "transform .35s" }, "&:hover .kp-arrow": { transform: "translateX(8px)" }, "&:hover .kp-ntitle": { color: kp.p.primary },
              }}>
                <Box component="time" dateTime={String(n.datetime || "").replace(" ", "T")} sx={{ color: kp.p.textSecondary }}>{n.datetime_str || n.datetime}</Box>
                <Box component="span">
                  <Box className="kp-ntitle" component="span" sx={{ display: "block", fontFamily: kp.fonts.heading, fontWeight: 700, fontSize: { xs: "1.375rem", md: "1.75rem" }, letterSpacing: "-0.03em", transition: "color .25s" }}>{n.subject}</Box>
                  <Box component="span" sx={{ display: "block", mt: 0.75, color: kp.p.textSecondary }}>{String(n.body || "").replace(/<[^>]+>/g, " ").slice(0, 160)}</Box>
                </Box>
                <ArrowForwardRounded className="kp-arrow" aria-hidden="true" sx={{ display: { xs: "none", md: "block" } }} />
              </Box>
            ) : <Skeleton height={110} />}
          </Reveal>
        ))}
      </Box>
    </Section>
  );
};

/* ---------- Финальный призыв ---------- */
const JoinCta = () => {
  const { kp } = useTheme();
  const { user } = useLibrary();
  if (user) return null;
  return (
    <Section labelledBy="kp-join-title" sx={{ textAlign: "center", pb: { xs: 10, md: 16 } }}>
      <Reveal>
        <Typography id="kp-join-title" variant="h2" sx={{ fontSize: "clamp(2.5rem, 1.4rem + 5vw, 6rem)", lineHeight: 0.98 }}>
          {T("7 дней Премиума")} <Accent>{T("в подарок")}</Accent>
        </Typography>
        <Typography sx={{ mt: 2.5, color: kp.p.textSecondary, fontSize: "1.1875rem" }}>{T("Для создания аккаунта требуется только номер телефона.")}</Typography>
        <Button component={RouterLink} to="/login" variant="contained" size="large" sx={{ mt: 4 }} endIcon={<ArrowForwardRounded aria-hidden="true" />}>{T("Регистрация за 30 секунд.")}</Button>
      </Reveal>
    </Section>
  );
};

const HomePage = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#about") requestAnimationFrame(() => document.getElementById("about")?.scrollIntoView({ block: "start" }));
  }, [location]);
  return (
    <PageShell title={T("Главная")}>
      <Hero />
      <Shelf />
      <Statement />
      <Genres />
      <Access />
      <Features />
      <News />
      <JoinCta />
    </PageShell>
  );
};

export default HomePage;
