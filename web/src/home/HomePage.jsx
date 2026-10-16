import React, { useEffect, useState } from "react";
import { Box, Button, Typography, InputBase, Tabs, Tab, Skeleton, useTheme, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShuffleRounded from "@mui/icons-material/ShuffleRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import HeadphonesRounded from "@mui/icons-material/HeadphonesRounded";
import KeyboardRounded from "@mui/icons-material/KeyboardRounded";
import SpeedRounded from "@mui/icons-material/SpeedRounded";
import DevicesRounded from "@mui/icons-material/DevicesRounded";
import RecordVoiceOverRounded from "@mui/icons-material/RecordVoiceOverRounded";
import BedtimeOutlined from "@mui/icons-material/BedtimeOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import WorkspacePremiumOutlined from "@mui/icons-material/WorkspacePremiumOutlined";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AutoStoriesOutlined from "@mui/icons-material/AutoStoriesOutlined";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import PageShell, { SectionHeader } from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import BookCover from "../ds/components/BookCover";
import { BookGrid } from "../ds/components/BookCard";
import { useFormatDuration } from "../ds/format";
import { getHost, request } from "../lib/api";
import useLibrary from "../LibraryContext";
import { VisuallyHidden } from "../lib/a11y";
import T from "../lib/translator";

const fetchJson = (url) => fetch(url).then((r) => r.json());
const useBooks = (sort, perPage) => useSWR(`${getHost()}/srv/books.php?sort=${sort}&page=0&per_page=${perPage}`, fetchJson);

const Section = ({ children, sx, labelledBy, id, tone }) => {
  const { kp } = useTheme();
  const bg = tone === "alt" ? (kp.isContrast ? kp.p.bg : kp.p.surfaceAlt) : tone === "ink" ? kp.p.ink : "transparent";
  return (
    <Box component="section" id={id} aria-labelledby={labelledBy} sx={{ bgcolor: bg, py: { xs: 7, md: 11 }, scrollMarginTop: 90, ...(kp.isContrast && tone && { borderBlock: `2px solid ${kp.p.border}` }), ...sx }}>
      <Container>{children}</Container>
    </Box>
  );
};

/* ---------- Hero ---------- */
const Hero = () => {
  const { kp } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { data } = useBooks("new", 3);
  const covers = (data && data.data) || [];
  const total = data && data.total;

  const randomBook = async () => {
    const r = await fetchJson(`${getHost()}/srv/books.php?sort=rand&page=0&per_page=1`).catch(() => null);
    const b = r && r.data && r.data[0];
    if (b) navigate(`/books/${b.id}`);
  };

  return (
    <Box
      component="section" aria-labelledby="kp-hero-title"
      sx={{
        position: "relative", overflow: "hidden",
        background: kp.isContrast ? kp.p.bg : `radial-gradient(1200px 520px at 85% -10%, ${alpha(kp.p.cyan, kp.p.mode === "dark" ? 0.18 : 0.22)}, transparent 60%), radial-gradient(900px 500px at -10% 110%, ${alpha(kp.p.accent, kp.p.mode === "dark" ? 0.10 : 0.16)}, transparent 60%), ${kp.p.bg}`,
      }}
    >
      <Container sx={{ pt: { xs: 5, md: 9 }, pb: { xs: 7, md: 11 }, display: "grid", gap: { xs: 6, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1.1fr .9fr" }, alignItems: "center" }}>
        <Box>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.75, py: 0.75, borderRadius: 999, bgcolor: kp.isContrast ? "transparent" : kp.p.primarySoft, color: kp.p.onPrimarySoft, border: kp.isContrast ? `2px solid ${kp.p.border}` : "none", fontWeight: 600, fontSize: "0.9375rem" }}>
            <VerifiedUserOutlined aria-hidden="true" sx={{ fontSize: 20 }} />
            {T("Бесплатно для людей с нарушениями зрения")}
          </Box>
          <Typography id="kp-hero-title" variant="h1" sx={{ mt: 3, maxWidth: 680 }}>
            {T("Книги, которые можно")}{" "}
            <Box component="span" sx={{ color: kp.p.primary, position: "relative", whiteSpace: "nowrap" }}>{T("услышать")}</Box>
          </Typography>
          <Typography variant="subtitle1" component="p" sx={{ mt: 2.5, color: kp.p.textSecondary, maxWidth: 560, fontSize: { xs: "1.125rem", md: "1.25rem" } }}>
            {T("Онлайн-аудиобиблиотека KitobPlus: узбекская и мировая литература в исполнении профессиональных дикторов. Удобно для экранных читалок и управления с клавиатуры.")}
          </Typography>

          <Box
            component="form" role="search" aria-label={T("Поиск по книгам")}
            onSubmit={(e) => { e.preventDefault(); navigate(q.trim() ? `/books?q=${encodeURIComponent(q.trim())}` : "/books"); }}
            sx={{ mt: 4, maxWidth: 600 }}
          >
            <Typography component="label" htmlFor="kp-hero-search" sx={{ display: "block", fontWeight: 600, mb: 1 }}>
              {T("Найдите книгу, автора или диктора")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 0.75, pl: 2, borderRadius: 999, bgcolor: kp.p.surface, border: `2px solid ${kp.p.borderStrong}`, boxShadow: kp.shadows.raised, "&:focus-within": { borderColor: kp.p.focus, boxShadow: `0 0 0 6px ${kp.p.focusHalo}` } }}>
              <SearchIcon aria-hidden="true" sx={{ color: kp.p.textSecondary }} />
              <InputBase
                id="kp-hero-search" value={q} onChange={(e) => setQ(e.target.value)} type="search" autoComplete="off"
                placeholder={T("Например, «O‘tkan kunlar»")}
                sx={{ flex: 1, fontSize: "1.125rem", minHeight: 52, "& input::placeholder": { color: kp.p.textSecondary, opacity: 1 } }}
              />
              <Button type="submit" variant="contained" size="large">{T("Найти")}</Button>
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <Button component={RouterLink} to="/books" variant="contained" size="large" endIcon={<ArrowForwardRounded aria-hidden="true" />}>
              {T("Открыть каталог")}
            </Button>
            <Button onClick={randomBook} variant="outlined" size="large" startIcon={<ShuffleRounded aria-hidden="true" />}>
              {T("Случайная аудиокнига")}
            </Button>
          </Box>

          <Box component="dl" sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 3, md: 5 }, m: 0, pt: 5 }}>
            {[
              { v: total ? Number(total).toLocaleString("ru-RU") : "—", l: T("аудиокниг в каталоге") },
              { v: "100%", l: T("доступно с экранной читалкой") },
              { v: "3", l: T("языка интерфейса") },
            ].map((s) => (
              <Box key={s.l} sx={{ display: "flex", flexDirection: "column-reverse" }}>
                <Box component="dt" sx={{ color: kp.p.textSecondary, fontSize: "1rem" }}>{s.l}</Box>
                <Box component="dd" sx={{ m: 0, fontFamily: "'Manrope Variable', sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.03em" }}>{s.v}</Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Декоративная композиция: веер обложек и «сейчас играет». Скрыта от экранных читалок. */}
        <Box aria-hidden="true" sx={{ position: "relative", height: { xs: 360, sm: 440, md: 520 }, display: { xs: "none", sm: "block" } }}>
          {[0, 1, 2].map((i) => {
            const b = covers[i];
            const pos = [
              { left: "4%", top: "14%", rot: -9, w: "42%", z: 1 },
              { left: "30%", top: "2%", rot: 0, w: "46%", z: 3 },
              { left: "58%", top: "16%", rot: 9, w: "40%", z: 2 },
            ][i];
            return (
              <Box key={i} sx={{ position: "absolute", left: pos.left, top: pos.top, width: pos.w, zIndex: pos.z, transform: `rotate(${pos.rot}deg)`, transition: "transform .6s" }}>
                {b ? <BookCover book={b} rounded={20} eager /> : <Skeleton variant="rounded" sx={{ width: "100%", height: "auto", aspectRatio: "2/3", borderRadius: "20px" }} />}
              </Box>
            );
          })}
          <Box
            sx={{
              position: "absolute", zIndex: 4, left: { sm: "8%", md: "0%" }, right: { sm: "8%", md: "6%" }, bottom: { xs: 0, md: "4%" },
              p: 2.25, borderRadius: 5, display: "flex", alignItems: "center", gap: 2,
              bgcolor: kp.isContrast ? kp.p.bg : alpha(kp.p.surface, 0.82), backdropFilter: "blur(18px)",
              border: `1px solid ${kp.isContrast ? kp.p.border : alpha(kp.p.text, 0.08)}`, boxShadow: kp.shadows.float,
            }}
          >
            <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: kp.p.primary, color: kp.p.onPrimary, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <PlayArrowRounded sx={{ fontSize: 34 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{covers[1] ? covers[1].title : "KitobPlus"}</Box>
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: "3px", height: 26, mt: 0.75 }}>
                {Array.from({ length: 32 }).map((_, i) => (
                  <Box key={i} sx={{
                    width: 4, borderRadius: 2, bgcolor: i < 13 ? kp.p.primary : kp.p.surfaceSunken,
                    height: `${30 + ((i * 37) % 70)}%`,
                    animation: i < 13 ? `kpWave 1.${(i % 6) + 2}s ease-in-out ${i * 0.06}s infinite alternate` : "none",
                    "@keyframes kpWave": { from: { transform: "scaleY(.55)" }, to: { transform: "scaleY(1)" } }, transformOrigin: "bottom",
                  }} />
                ))}
              </Box>
            </Box>
            <Box sx={{ fontVariantNumeric: "tabular-nums", color: kp.p.textSecondary, fontWeight: 600 }}>1.25×</Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

/* ---------- Полка «Новинки / Популярные» ---------- */
const Shelf = () => {
  const [tab, setTab] = useState(0);
  const sort = tab === 0 ? "new" : "popular";
  const { data, isLoading } = useBooks(sort, 6);
  const tabs = [T("Последние"), T("Популярные")];
  return (
    <Section labelledBy="kp-shelf-title">
      <SectionHeader id="kp-shelf-title" title={T("Что послушать")} subtitle={T("Новые поступления и книги, которые слушают чаще всего.")} linkTo="/books" linkLabel={T("Все книги")} />
      <Tabs value={tab} onChange={(e, v) => setTab(v)} aria-label={T("Подборка книг")} sx={{ mb: 4, borderBottom: 1, borderColor: "divider" }}>
        {tabs.map((t, i) => <Tab key={t} label={t} id={`kp-shelf-tab-${i}`} aria-controls="kp-shelf-panel" />)}
      </Tabs>
      <Box id="kp-shelf-panel" role="tabpanel" aria-labelledby={`kp-shelf-tab-${tab}`}>
        <BookGrid books={data && data.data} loading={isLoading} label={tabs[tab]} />
      </Box>
    </Section>
  );
};

/* ---------- Книга дня ---------- */
const Spotlight = () => {
  const { kp } = useTheme();
  const fmt = useFormatDuration();
  const [book, setBook] = useState(null);
  useEffect(() => {
    fetchJson(`${getHost()}/srv/books.php?sort=rand&page=0&per_page=1`).then((r) => setBook(r && r.data && r.data[0])).catch(() => {});
  }, []);
  if (!book) return null;
  return (
    <Section labelledBy="kp-spot-title" tone="ink" sx={{ color: kp.p.onInk }}>
      <Box sx={{ display: "grid", gap: { xs: 5, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "320px 1fr" }, alignItems: "center" }}>
        <Box sx={{ maxWidth: { xs: 240, md: "none" }, mx: { xs: "auto", md: 0 }, width: "100%" }}><BookCover book={book} rounded={20} /></Box>
        <Box>
          <Typography variant="overline" component="p" sx={{ color: kp.p.cyan }}>{T("Книга дня")}</Typography>
          <Typography id="kp-spot-title" variant="h2" sx={{ mt: 1, color: kp.p.onInk }}>{book.title}</Typography>
          <Typography sx={{ mt: 1.5, color: kp.p.onInkSecondary, fontSize: "1.1875rem" }}>
            {book.authors_name}{book.dictors_name ? ` · ${T("Читает")}: ${book.dictors_name}` : ""}
          </Typography>
          {book.annotation && (
            <Typography sx={{ mt: 2.5, color: kp.p.onInk, maxWidth: 680, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {String(book.annotation).replace(/<[^>]+>/g, " ")}
            </Typography>
          )}
          <Box sx={{ mt: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[fmt(book.seconds), book.genres_name].filter(Boolean).map((c) => (
              <Box key={c} sx={{ px: 1.75, py: 0.75, borderRadius: 999, border: `1px solid ${kp.isContrast ? kp.p.border : "rgba(255,255,255,.24)"}`, color: kp.p.onInk, fontWeight: 600, fontSize: "0.9375rem" }}>{c}</Box>
            ))}
          </Box>
          <Button component={RouterLink} to={`/books/${book.id}`} variant="contained" size="large" startIcon={<PlayArrowRounded aria-hidden="true" />} sx={{ mt: 4, bgcolor: kp.p.cyan, color: kp.p.ink, "&:hover": { bgcolor: kp.p.onInk } }}>
            {T("Слушать")}<VisuallyHidden>: {book.title}</VisuallyHidden>
          </Button>
        </Box>
      </Box>
    </Section>
  );
};

/* ---------- Жанры ---------- */
const Genres = () => {
  const { kp } = useTheme();
  const { data, isLoading } = useSWR(`${getHost()}/srv/genres.php?sort=popular`, fetchJson);
  const genres = ((data && data.data) || []).slice(0, 8);
  return (
    <Section labelledBy="kp-genres-title" tone="alt">
      <SectionHeader id="kp-genres-title" title={T("Жанры")} subtitle={T("Выберите настроение: от классики до сказок для детей.")} linkTo="/genres" linkLabel={T("Все жанры")} />
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>
        {isLoading && Array.from({ length: 4 }).map((_, i) => <li key={i}><Skeleton variant="rounded" height={112} sx={{ borderRadius: 4 }} /></li>)}
        {genres.map((g, i) => (
          <li key={g.id}>
            <Box
              component={RouterLink} to={`/person/genres/${g.id}`}
              sx={{
                display: "flex", alignItems: "center", gap: 2, p: 2.5, minHeight: 112, borderRadius: 4, textDecoration: "none",
                bgcolor: kp.p.surface, border: `1px solid ${kp.p.border}`, color: kp.p.text, boxShadow: kp.shadows.card,
                transition: "transform .25s, box-shadow .25s, border-color .25s",
                "&:hover": { transform: kp.isContrast ? "none" : "translateY(-3px)", boxShadow: kp.shadows.raised, borderColor: kp.p.primary },
              }}
            >
              <Box aria-hidden="true" sx={{ width: 56, height: 56, borderRadius: 3, display: "grid", placeItems: "center", flexShrink: 0, bgcolor: kp.isContrast ? "transparent" : kp.p.primarySoft, color: kp.p.onPrimarySoft, border: kp.isContrast ? `2px solid ${kp.p.border}` : "none" }}>
                <AutoStoriesOutlined />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ fontFamily: "'Manrope Variable', sans-serif", fontWeight: 700, fontSize: "1.1875rem" }}>{g.name}</Box>
                {g.books_count && <Box sx={{ color: kp.p.textSecondary, fontSize: "1rem" }}>{g.books_count} {T("книг (число)")}</Box>}
              </Box>
            </Box>
          </li>
        ))}
      </Box>
    </Section>
  );
};

/* ---------- Доступ: бесплатный режим и премиум ---------- */
const Access = () => {
  const { kp } = useTheme();
  const { user } = useLibrary();
  const card = { p: { xs: 3.5, md: 5 }, borderRadius: 6, height: "100%", display: "flex", flexDirection: "column" };
  const List = ({ items, color }) => (
    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mt: 3, display: "grid", gap: 1.5 }}>
      {items.map((t) => (
        <Box component="li" key={t} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          <CheckCircleRounded aria-hidden="true" sx={{ color, mt: "3px" }} /><span>{t}</span>
        </Box>
      ))}
    </Box>
  );
  return (
    <Section labelledBy="kp-access-title" id="about">
      <SectionHeader id="kp-access-title" title={T("Библиотека для всех")} subtitle={T("Наша миссия — сделать знания и литературу доступными для всех, независимо от возможностей здоровья.")} />
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
        <Box sx={{ ...card, bgcolor: kp.p.ink, color: kp.p.onInk, border: kp.isContrast ? `2px solid ${kp.p.border}` : "none" }}>
          <VerifiedUserOutlined aria-hidden="true" sx={{ fontSize: 40, color: kp.p.cyan }} />
          <Typography variant="h3" component="h3" sx={{ mt: 2, color: kp.p.onInk }}>{T("Бесплатно и без ограничений")}</Typography>
          <Typography sx={{ mt: 1.5, color: kp.p.onInkSecondary }}>{T("Для людей с инвалидностью по зрению весь каталог открыт полностью и бесплатно. Для доступа нужно подтвердить статус.")}</Typography>
          <List color={kp.p.cyan} items={[T("Все книги каталога без лимитов"), T("Закладки, скорость и таймер сна"), T("Подтверждение через школу, библиотеку или общество слепых")]} />
          <Box sx={{ mt: "auto", pt: 4 }}>
            <Button component={RouterLink} to={user ? "/profile" : "/login"} variant="contained" size="large" sx={{ bgcolor: kp.p.cyan, color: kp.p.ink, "&:hover": { bgcolor: kp.p.onInk } }}>
              {T("Подтвердить статус")}
            </Button>
          </Box>
        </Box>
        <Box sx={{ ...card, bgcolor: kp.p.surface, border: `1px solid ${kp.p.border}`, boxShadow: kp.shadows.card }}>
          <WorkspacePremiumOutlined aria-hidden="true" sx={{ fontSize: 40, color: kp.p.mode === "dark" ? kp.p.accent : "#9A6A00" }} />
          <Typography variant="h3" component="h3" sx={{ mt: 2 }}>{T("Премиум для всех")}</Typography>
          <Typography sx={{ mt: 1.5, color: kp.p.textSecondary }}>{T("Также мы предлагаем платную подписку «Премиум-доступ» для всех желающих. Средства от подписок направляются на развитие библиотеки, что позволяет нам расширять каталог и улучшать сервис.")}</Typography>
          <List color={kp.p.primary} items={[T("7 дней Премиума бесплатно после регистрации"), T("Без ограничений по времени и книжной полке"), T("Регистрация по номеру телефона")]} />
          <Box sx={{ mt: "auto", pt: 4 }}>
            <Button component={RouterLink} to={user ? "/profile" : "/login"} variant="contained" size="large">
              {user ? T("Управлять подпиской") : T("Попробовать бесплатно")}
            </Button>
          </Box>
        </Box>
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
    { icon: <SpeedRounded />, t: T("Скорость и закладки"), d: T("Слушайте в своём темпе и возвращайтесь к важным местам.") },
    { icon: <BedtimeOutlined />, t: T("Таймер сна"), d: T("Книга остановится сама, когда вы уснёте.") },
    { icon: <HeadphonesRounded />, t: T("Кнопки наушников"), d: T("Пауза и перемотка с наушников и экрана блокировки.") },
    { icon: <DevicesRounded />, t: T("На всех устройствах"), d: T("Сайт, iPhone и Android: место остановки синхронизируется.") },
  ];
  return (
    <Section labelledBy="kp-features-title" tone="alt">
      <SectionHeader id="kp-features-title" title={T("Удобно с первого касания")} subtitle={T("Каждой функцией можно пользоваться без мыши и без зрения.")} />
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
        {items.map((it) => (
          <Box component="li" key={it.t} sx={{ p: 3.5, borderRadius: 5, bgcolor: kp.p.surface, border: `1px solid ${kp.p.border}` }}>
            <Box aria-hidden="true" sx={{ width: 52, height: 52, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: kp.isContrast ? "transparent" : kp.p.primarySoft, color: kp.p.onPrimarySoft, border: kp.isContrast ? `2px solid ${kp.p.border}` : "none" }}>{it.icon}</Box>
            <Typography variant="h4" component="h3" sx={{ mt: 2.5 }}>{it.t}</Typography>
            <Typography sx={{ mt: 1, color: kp.p.textSecondary }}>{it.d}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
};

/* ---------- Новости ---------- */
const News = () => {
  const { kp } = useTheme();
  const [items, setItems] = useState(null);
  useEffect(() => {
    request("news/list", { page: 0, per_page: 3 }).then((r) => setItems((r && r.news) || [])).catch(() => setItems([]));
  }, []);
  if (items && !items.length) return null;
  return (
    <Section labelledBy="kp-news-title">
      <SectionHeader id="kp-news-title" title={T("Новости")} linkTo="/news" linkLabel={T("Все новости")} />
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        {(items || [null, null, null]).map((n, i) => (
          <li key={n ? n.id : i}>
            {n ? (
              <Box component="article" sx={{ position: "relative", height: "100%", p: 3.5, borderRadius: 5, bgcolor: kp.p.surface, border: `1px solid ${kp.p.border}`, boxShadow: kp.shadows.card, transition: "box-shadow .25s, transform .25s", "&:hover": { boxShadow: kp.shadows.raised, transform: kp.isContrast ? "none" : "translateY(-3px)" }, "&:focus-within": { outline: `3px solid ${kp.p.focus}`, outlineOffset: 4 } }}>
                <Typography component="p" variant="body2" sx={{ color: kp.p.textSecondary }}>
                  <time dateTime={String(n.datetime || "").replace(" ", "T")}>{n.datetime_str || n.datetime}</time>
                </Typography>
                <Typography variant="h4" component="h3" sx={{ mt: 1.25 }}>
                  <Box component={RouterLink} to={`/news/${n.id}`} sx={{ color: kp.p.text, textDecoration: "none", "&::after": { content: '""', position: "absolute", inset: 0 }, "&:focus-visible": { outline: "none", boxShadow: "none" } }}>
                    {n.subject}
                  </Box>
                </Typography>
                <Typography sx={{ mt: 1.25, color: kp.p.textSecondary, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {String(n.body || "").replace(/<[^>]+>/g, " ")}
                </Typography>
              </Box>
            ) : <Skeleton variant="rounded" height={220} sx={{ borderRadius: 5 }} />}
          </li>
        ))}
      </Box>
    </Section>
  );
};

/* ---------- Призыв к регистрации ---------- */
const JoinCta = () => {
  const { kp } = useTheme();
  const { user } = useLibrary();
  if (user) return null;
  return (
    <Container sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 7, md: 11 } }}>
      <Box component="section" aria-labelledby="kp-join-title" sx={{
        position: "relative", overflow: "hidden", borderRadius: 7, p: { xs: 4, md: 7 },
        color: kp.p.onPrimary, bgcolor: kp.p.primary,
        background: kp.isContrast ? kp.p.primary : `radial-gradient(600px 300px at 90% 0%, ${alpha("#fff", 0.18)}, transparent 60%), linear-gradient(135deg, ${kp.p.primary}, ${kp.p.primaryHover})`,
        display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", justifyContent: "space-between",
      }}>
        <Box sx={{ maxWidth: 640 }}>
          <Typography id="kp-join-title" variant="h2" sx={{ color: "inherit" }}>{T("7 дней Премиума — в подарок")}</Typography>
          <Typography sx={{ mt: 1.5, color: "inherit", opacity: 0.92, fontSize: "1.1875rem" }}>{T("Для создания аккаунта требуется только номер телефона.")}</Typography>
        </Box>
        <Button component={RouterLink} to="/login" size="large" variant="contained" sx={{ bgcolor: kp.p.onPrimary, color: kp.p.primary, "&:hover": { bgcolor: kp.p.onPrimary, opacity: 0.92 } }}>
          {T("Регистрация за 30 секунд.")}
        </Button>
      </Box>
    </Container>
  );
};

const HomePage = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#about") {
      requestAnimationFrame(() => document.getElementById("about")?.scrollIntoView({ block: "start" }));
    }
  }, [location]);
  return (
    <PageShell title={T("Главная")}>
      <Hero />
      <Shelf />
      <Spotlight />
      <Genres />
      <Access />
      <Features />
      <News />
      <JoinCta />
    </PageShell>
  );
};

export default HomePage;
