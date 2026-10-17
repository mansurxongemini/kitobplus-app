import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Skeleton, Divider, useTheme, alpha } from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import KeyboardRounded from "@mui/icons-material/KeyboardRounded";
import HeadphonesRounded from "@mui/icons-material/HeadphonesRounded";
import AutoStoriesOutlined from "@mui/icons-material/AutoStoriesOutlined";
import HearingRounded from "@mui/icons-material/HearingRounded";
import GraphicEqRounded from "@mui/icons-material/GraphicEqRounded";
import StarOutlineRounded from "@mui/icons-material/StarOutlineRounded";
import DevicesOutlined from "@mui/icons-material/DevicesOutlined";
import AccessibilityNewRounded from "@mui/icons-material/AccessibilityNewRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import { Link as RouterLink, useLocation } from "react-router-dom";
import useSWR from "swr";
import PageShell, { SectionHeader } from "../ds/components/PageShell";
import Feed from "./Feed";
import Shelf from "../ds/components/Shelf";
import Container from "../ds/components/Container";
import heroBg from "../img/hero-bg.png";
import featSpeaker from "../img/feat_speaker.png";
import featKeys from "../img/feat_keys.png";
import featHeadphones from "../img/feat_headphones.png";
import accessWave from "../img/access_wave.png";
import { Reveal, Accent, useReducedMotion } from "../ds/motion";
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

/* ---------- «Послушать 10 секунд»: бесплатный отрывок (/books/NNNNN.mp3) книги дня ---------- */
const useSample = (book) => {
  const [playing, setPlaying] = useState(false);
  const { setActiveAudio } = useLibrary();
  const audio = useRef(null);
  const timers = useRef([]);
  const clear = () => { timers.current.forEach((t) => clearTimeout(t) || clearInterval(t)); timers.current = []; };
  const stop = () => {
    clear();
    if (audio.current) { audio.current.pause(); audio.current = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setPlaying(false);
    setActiveAudio(null);
  };
  // Если отрывок недоступен — зачитываем название и аннотацию голосом браузера.
  const speakFallback = () => {
    if (!window.speechSynthesis || !book) { stop(); return; }
    const text = [book.title, book.authors_name, String(book.annotation || "").replace(/<[^>]+>/g, " ")].filter(Boolean).join(". ");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "uz-UZ";
    u.rate = 0.95;
    u.onend = u.onerror = () => { setPlaying(false); setActiveAudio(null); };
    window.speechSynthesis.speak(u);
  };
  const start = () => {
    if (!book) return;
    setPlaying(true);
    setActiveAudio({
      id: book.id,
      title: book.title,
      author: book.authors_name,
      cover: book.cover || (book.id ? `${getHost()}/books/${book.id}.jpg` : null),
      isPlaying: true,
      progress: 35,
      onTogglePlay: () => stop(),
      onClose: () => stop(),
    });
    const a = new Audio(`${getHost()}/books/${String(book.id).padStart(5, "0")}.mp3`);
    audio.current = a;
    a.onerror = () => { if (audio.current === a) { audio.current = null; speakFallback(); } };
    const p = a.play();
    const handleSuccess = () => {
      timers.current.push(setTimeout(() => {
        let v = 1;
        const fade = setInterval(() => {
          v -= 0.1;
          if (!audio.current || v <= 0) { clearInterval(fade); stop(); } else audio.current.volume = Math.max(0, v);
        }, 80);
        timers.current.push(fade);
      }, SAMPLE_SECONDS * 1000));
    };
    if (p && typeof p.then === "function") {
      p.then(handleSuccess).catch(() => { if (audio.current === a) { audio.current = null; speakFallback(); } });
    } else {
      handleSuccess();
    }
  };
  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps
  return { playing, toggle: () => (playing ? stop() : start()) };
};

const Hero = () => {
  const { kp } = useTheme();
  const reduce = useReducedMotion();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetchJson(`${getHost()}/srv/books.php?sort=rand&page=0&per_page=1`)
      .then((r) => setBook(r && r.data && r.data[0]))
      .catch(() => {});
  }, []);

  const { playing, toggle } = useSample(book);
  const playingLabel = T("Звучит отрывок");

  useEffect(() => {
    if (playing) announce(playingLabel + (book ? ": " + book.title : ""));
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!playing) return undefined;
    const onKey = (e) => {
      if (e.code === "Space" && (e.target === document.body || e.target?.tagName === "BODY")) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, toggle]);

  const fade = (d) => ({
    animation: reduce ? "none" : `kpFade .9s ${d}s both`,
    "@keyframes kpFade": {
      from: { opacity: 0, transform: "translateY(12px)" },
      to: { opacity: 1, transform: "none" },
    },
  });

  const features = [
    {
      icon: <HearingRounded sx={{ fontSize: 24, color: kp.p.primary }} />,
      title: T("Ko'rish imkoniyati cheklanganlar uchun bepul"),
      subtitle: T("Bilim hamma uchun"),
    },
    {
      icon: <AutoStoriesOutlined sx={{ fontSize: 24, color: kp.p.primary }} />,
      title: T("Keng katalog"),
      subtitle: T("Minglab audio kitoblar"),
    },
    {
      icon: <GraphicEqRounded sx={{ fontSize: 24, color: kp.p.primary }} />,
      title: T("Professional suxandonlar"),
      subtitle: T("Yuqori sifatli ijro"),
    },
    {
      icon: <StarOutlineRounded sx={{ fontSize: 24, color: kp.p.primary }} />,
      title: T("Turli janrlar"),
      subtitle: T("Badiiy, ilmiy, motivatsion"),
    },
    {
      icon: <DevicesOutlined sx={{ fontSize: 24, color: kp.p.primary }} />,
      title: T("Har qurilmada"),
      subtitle: T("Telefon, planshet, kompyuter"),
    },
  ];

  return (
    <Box
      component="section"
      aria-labelledby="kp-hero-title"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: kp.p.bg,
        backgroundImage: {
          xs: `linear-gradient(180deg, ${alpha(kp.p.bg, 0.96)} 0%, ${alpha(kp.p.bg, 0.90)} 38%, ${alpha(kp.p.bg, 0.25)} 60%, ${alpha(kp.p.bg, 0.96)} 100%), url(${heroBg})`,
          md: `linear-gradient(90deg, ${alpha(kp.p.bg, 0.98)} 0%, ${alpha(kp.p.bg, 0.92)} 36%, ${alpha(kp.p.bg, 0.35)} 60%, ${alpha(kp.p.bg, 0)} 80%), url(${heroBg})`,
        },
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: { xs: "72% 70%", md: "right center" },
        pt: { xs: 5, md: 8, lg: 9 },
        pb: { xs: 4, md: 5 },
        minHeight: { xs: "auto", md: "calc(100vh - 76px)", lg: "800px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Container sx={{ width: "100%", zIndex: 1, my: "auto" }}>
        <Box sx={{ maxWidth: { xs: "100%", md: 620, lg: 680 }, textAlign: "left" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.75,
              py: 0.6,
              borderRadius: 999,
              bgcolor: alpha(kp.p.primary, 0.12),
              color: kp.p.primary,
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              mb: { xs: 2.5, md: 3 },
              ...fade(0.1),
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: kp.p.primary,
                color: kp.p.onPrimary,
                display: "grid",
                placeItems: "center",
              }}
            >
              <AccessibilityNewRounded sx={{ fontSize: 13 }} />
            </Box>
            {T("HAR BIR INSON UCHUN KITOB")}
          </Box>

          <Typography
            id="kp-hero-title"
            variant="h1"
            sx={{
              fontFamily: kp.fonts.heading,
              fontWeight: 850,
              fontSize: { xs: "2.75rem", sm: "3.5rem", md: "4.5rem", lg: "5.25rem" },
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: kp.p.text,
              ...fade(0.2),
            }}
          >
            {T("Kitoblar endi")}{" "}
            <Box
              component="span"
              sx={{
                display: "block",
                fontFamily: kp.fonts.serif,
                fontStyle: "italic",
                fontWeight: 400,
                color: kp.p.primary,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              {T("eshitiladi.")}
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: { xs: 2.5, md: 3 },
              fontSize: { xs: "1rem", sm: "1.0625rem", md: "1.1875rem" },
              lineHeight: 1.6,
              color: kp.p.textSecondary,
              maxWidth: 540,
              ...fade(0.4),
            }}
          >
            {T("hero_description")}
          </Typography>

          <Box
            sx={{
              mt: { xs: 3.5, md: 4.5 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              flexWrap: "wrap",
              ...fade(0.6),
            }}
          >
            <Button
              variant="contained"
              onClick={toggle}
              aria-pressed={playing}
              disabled={!book}
              startIcon={
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: alpha(kp.p.onPrimary, 0.2),
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {playing ? <PauseRounded sx={{ fontSize: 18 }} /> : <PlayArrowRounded sx={{ fontSize: 20 }} />}
                </Box>
              }
              endIcon={<ArrowForwardRounded sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                bgcolor: kp.p.primary,
                "&:hover": { bgcolor: kp.p.primaryHover },
                color: kp.p.onPrimary,
                border: kp.isContrast ? "2px solid #FFFFFF" : "none",
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: "0.9375rem", sm: "1rem" },
                fontWeight: 700,
                textTransform: "none",
                boxShadow: kp.isContrast ? "none" : "0 6px 20px rgba(13, 80, 184, 0.28)",
              }}
            >
              {playing ? T("Остановить") : T("10 soniya tinglab ko'ring")}
            </Button>

            <Button
              component={RouterLink}
              to="/books"
              variant="outlined"
              startIcon={<AutoStoriesOutlined sx={{ fontSize: 20, color: kp.p.primary }} />}
              sx={{
                borderRadius: 999,
                bgcolor: kp.p.surface,
                "&:hover": { bgcolor: kp.p.surfaceAlt, borderColor: kp.p.borderStrong },
                color: kp.p.text,
                borderColor: kp.p.border,
                px: { xs: 2.5, sm: 3 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: "0.9375rem", sm: "1rem" },
                fontWeight: 700,
                textTransform: "none",
                boxShadow: kp.shadows.card,
              }}
            >
              {T("Katalogni ochish")}
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mt: 1.75,
              fontSize: "0.875rem",
              color: kp.p.textSecondary,
              fontStyle: "italic",
              ...fade(0.7),
            }}
          >
            {book ? `«${book.title}» — ${book.authors_name}` : "«Dunyoning ishlari» — O'tkir Hoshimov"}
          </Typography>
        </Box>
      </Container>

      <Container sx={{ width: "100%", maxWidth: "100%", zIndex: 1, mt: { xs: 3.5, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            p: { xs: 1.5, sm: 2, md: "18px 32px" },
            borderRadius: { xs: 4, md: 8 },
            bgcolor: alpha(kp.p.surface, 0.92),
            backdropFilter: "blur(20px)",
            border: `1px solid ${kp.p.border}`,
            boxShadow: kp.shadows.raised,
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-start", lg: "space-between" },
            gap: { xs: 2, md: 2.5 },
            overflowX: "auto",
            maxWidth: "100%",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            ...fade(0.85),
          }}
        >
          {features.map((feat, i) => (
            <React.Fragment key={feat.title}>
              {i > 0 && (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    display: { xs: "none", lg: "block" },
                    borderColor: kp.p.border,
                    my: 0.5,
                  }}
                />
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexShrink: 0,
                  minWidth: "max-content",
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: alpha(kp.p.primary, 0.12),
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {feat.icon}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: kp.p.text,
                      lineHeight: 1.25,
                    }}
                  >
                    {feat.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: kp.p.textSecondary,
                      mt: 0.25,
                      lineHeight: 1.2,
                    }}
                  >
                    {feat.subtitle}
                  </Typography>
                </Box>
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

/* ---------- Манифест и цифры (A) ---------- */
const Statement = () => {
  const { kp } = useTheme();
  const { data } = useBooks("new", 1);
  const total = data && data.total;
  const stats = [
    {
      v: total ? Number(total).toLocaleString("ru-RU") : "61",
      l: T("ta audiokitob katalogda"),
      icon: <AutoStoriesOutlined sx={{ fontSize: 26, color: kp.p.primary }} />,
      bg: alpha(kp.p.primary, 0.12),
    },
    {
      v: "100%",
      l: T("ekran o'quvchi bilan ishlaydi"),
      icon: <AccessibilityNewRounded sx={{ fontSize: 26, color: kp.p.success }} />,
      bg: alpha(kp.p.success, 0.14),
    },
    {
      v: "0 so'm",
      l: T("ko'rish bo'yicha nogironligi bo'lgan kitobxonlar uchun"),
      icon: <FavoriteRounded sx={{ fontSize: 26, color: kp.p.error }} />,
      bg: alpha(kp.p.error, 0.14),
    },
  ];
  return (
    <Section labelledBy="kp-about-title" id="about" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography id="kp-about-title" component="h2" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>{T("О нас")}</Typography>
      <Box
        component="dl"
        sx={{
          m: 0,
          p: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: { xs: 2, md: 3 },
        }}
      >
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.1}>
            <Box
              sx={{
                bgcolor: kp.p.surface,
                borderRadius: 5,
                p: { xs: 2.5, sm: 3 },
                border: `1px solid ${kp.p.border}`,
                boxShadow: kp.shadows.card,
                display: "flex",
                alignItems: "center",
                gap: 2.25,
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  bgcolor: s.bg,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </Box>
              <Box>
                <Box
                  component="dd"
                  sx={{
                    m: 0,
                    fontWeight: 800,
                    fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    letterSpacing: "-0.03em",
                    color: kp.p.text,
                    lineHeight: 1.15,
                  }}
                >
                  {s.v}
                </Box>
                <Box
                  component="dt"
                  sx={{
                    color: kp.p.textSecondary,
                    fontSize: "0.84rem",
                    mt: 0.25,
                    lineHeight: 1.3,
                  }}
                >
                  {s.l}
                </Box>
              </Box>
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
    {
      icon: <AccessibilityNewRounded sx={{ fontSize: 24, color: kp.p.primary }} />,
      bg: alpha(kp.p.primary, 0.12),
      cardBg: kp.p.mode === "dark" ? kp.p.surface : "linear-gradient(135deg, #F0F7FF 0%, #E6F0FA 100%)",
      borderColor: kp.p.border,
      title: T("Ekran o'quvchilar uchun"),
      desc: T("NVDA, JAWS, TalkBack va VoiceOver uchun tushunarli nomlar, sarlavhalar va ovozli xabarlar."),
      img: featSpeaker,
    },
    {
      icon: <KeyboardRounded sx={{ fontSize: 24, color: kp.p.primary }} />,
      bg: alpha(kp.p.primary, 0.12),
      cardBg: kp.p.mode === "dark" ? kp.p.surface : "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
      borderColor: kp.p.border,
      title: T("Klaviatura bilan boshqarish"),
      desc: T("Bo'sh joy — pauza, strelkalar — 30 soniya orqaga va oldinga, Shift va strelkalar — tezlik."),
      img: featKeys,
    },
    {
      icon: <HeadphonesRounded sx={{ fontSize: 24, color: kp.p.accent }} />,
      bg: alpha(kp.p.accent, 0.15),
      cardBg: kp.p.mode === "dark" ? kp.p.surface : "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 60%, #FDF2E9 100%)",
      borderColor: kp.p.border,
      title: T("Quloqchin tugmalari"),
      desc: T("Quloqchin va qulflangan ekrandan pauza va o'tkazish."),
      img: featHeadphones,
    },
  ];

  return (
    <Section labelledBy="kp-features-title" sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 5, md: 8 } }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: { xs: 3, md: 4 }, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography
            id="kp-features-title"
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.75rem", md: "2.375rem" },
              letterSpacing: "-0.03em",
              color: kp.p.text,
            }}
          >
            {T("Ko'rmasdan ham")}{" "}
            <Box
              component="span"
              sx={{
                fontFamily: "Instrument Serif, serif",
                fontStyle: "italic",
                color: kp.p.primary,
                fontWeight: 400,
              }}
            >
              {T("qulay")}
            </Box>
          </Typography>
          <Typography sx={{ color: kp.p.textSecondary, fontSize: "0.9375rem", mt: 0.5 }}>
            {T("Har bir imkoniyatdan sichqonchasiz va ko'rmasdan foydalanish mumkin.")}
          </Typography>
        </Box>
        <Box
          component="img"
          src={accessWave}
          alt=""
          aria-hidden="true"
          sx={{
            display: { xs: "none", md: "block" },
            height: 38,
            objectFit: "contain",
            opacity: 0.85,
          }}
        />
      </Box>

      <Box
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "grid",
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        }}
      >
        {items.map((it, i) => (
          <Reveal as="li" key={it.title} delay={i * 0.1}>
            <Box
              sx={{
                background: it.cardBg,
                border: `1px solid ${it.borderColor}`,
                borderRadius: 5,
                p: { xs: 2.5, sm: 3 },
                height: "100%",
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: kp.shadows.card,
                transition: "transform .25s ease, box-shadow .25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: kp.shadows.raised,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: it.bg,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {it.icon}
                </Box>
                <Box sx={{ pr: 6 }}>
                  <Typography
                    component="h3"
                    sx={{
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: kp.p.text,
                      lineHeight: 1.25,
                    }}
                  >
                    {it.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: kp.p.textSecondary,
                      fontSize: "0.8125rem",
                      mt: 0.75,
                      lineHeight: 1.4,
                    }}
                  >
                    {it.desc}
                  </Typography>
                </Box>
              </Box>

              <Box
                component="img"
                src={it.img}
                alt=""
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  width: { xs: 70, sm: 80 },
                  height: "auto",
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
              />
            </Box>
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

const CategoriesSection = () => (
  <Container sx={{ mt: { xs: 4, md: 6 } }}>
    <Shelf
      id="home-categories"
      eyebrow={T("JANRLAR BO'YICHA")}
      title={T("Audiokitoblar toifalari")}
      subtitle={T("Qiziqarli mavzularda minglab audiokitoblar sizni kutmoqda.")}
      to="/genres"
      actionLabel={T("Barchasini ko'rish")}
      variant="categories"
    />
  </Container>
);

const HomePage = () => {
  const { countryCode } = useLibrary();
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#about") requestAnimationFrame(() => document.getElementById("about")?.scrollIntoView({ block: "start" }));
  }, [location]);
  // Промо-блоки пересобираются при смене языка
  const promos = React.useMemo(() => ({
    about: <><Statement /><Features /></>, join: <JoinCta />, access: <Access />, news: <News />,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [countryCode]);
  return (
    <PageShell title={T("Главная")}>
      <Hero />
      <Box component="a" href="#site-footer" className="kp-skip-link">{T("Пропустить ленту")}</Box>
      <CategoriesSection />
      <Feed promos={promos} />
    </PageShell>
  );
};

export default HomePage;
