import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import SendRounded from "@mui/icons-material/SendRounded";
import VolunteerActivismOutlined from "@mui/icons-material/VolunteerActivismOutlined";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import PageShell, { PageHeader } from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import useLibrary from "../LibraryContext";
import T from "../lib/translator";

const Contacts = () => {
  const { kp } = useTheme();
  useLibrary();

  const contactsList = [
    {
      icon: <MailOutlineRounded sx={{ fontSize: 28 }} />,
      label: T("Электронная почта"),
      value: "m.giyosov@sharoitplus.uz",
      href: "mailto:m.giyosov@sharoitplus.uz",
    },
    {
      icon: <PhoneOutlined sx={{ fontSize: 28 }} />,
      label: T("Телефон"),
      value: "+998 (97) 708-73-31",
      href: "tel:+998977087331",
    },
    {
      icon: <SendRounded sx={{ fontSize: 28 }} />,
      label: "Telegram",
      value: "@kitobplus_uz",
      href: "https://t.me/kitobplus_uz",
      external: true,
    },
    {
      icon: <VolunteerActivismOutlined sx={{ fontSize: 28 }} />,
      label: T("Поддержка"),
      value: "sharoitplus.uz",
      href: "https://sharoitplus.uz/ru/podderjat/#donate-form",
      external: true,
    },
  ];

  const team = [
    T("Менеджер проекта: Мирали Гиясов"),
    T("Координатор проекта: Абдулазиз Салимов"),
    T("Программист: Михаил Корнеев"),
    T("Корректор: Ширин Ульмасова"),
    T("Бухгалтер проекта: Ирода Нарзиева"),
  ];

  return (
    <PageShell title={T("Контакты")}>
      <PageHeader
        title={T("Контакты")}
        crumbs={[{ label: T("Контакты") }]}
      />

      <Container sx={{ py: { xs: 5, md: 8 } }}>
        {/* Contact cards */}
        <Box
          component="ul"
          aria-label={T("Контакты")}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          }}
        >
          {contactsList.map((c) => (
            <Box
              component="li"
              key={c.label}
              sx={{
                p: 3.5,
                borderRadius: 5,
                bgcolor: kp.p.surface,
                border: `1px solid ${kp.p.border}`,
                boxShadow: kp.shadows.card,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                transition: "box-shadow .25s, transform .25s, border-color .25s",
                "&:hover": {
                  boxShadow: kp.shadows.raised,
                  transform: kp.isContrast ? "none" : "translateY(-3px)",
                  borderColor: kp.p.primary,
                },
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: kp.isContrast ? "transparent" : kp.p.primarySoft,
                  color: kp.isContrast ? kp.p.primary : kp.p.onPrimarySoft,
                  border: kp.isContrast ? `2px solid ${kp.p.border}` : "none",
                }}
              >
                {c.icon}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ color: kp.p.textSecondary, fontWeight: 500 }}>
                  {c.label}
                </Typography>
                <Box
                  component="a"
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  sx={{
                    display: "inline-block",
                    mt: 0.5,
                    color: kp.p.primary,
                    fontWeight: 700,
                    fontSize: "1.0625rem",
                    textDecoration: "none",
                    wordBreak: "break-all",
                    borderRadius: 1,
                    "&:hover": { textDecoration: "underline" },
                    "&:focus-visible": { outline: `3px solid ${kp.p.focus}`, outlineOffset: 2 },
                  }}
                >
                  {c.value}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Team Section */}
        <Box sx={{ mt: { xs: 7, md: 10 } }}>
          <Typography variant="h2" component="h2" sx={{ mb: 4 }}>
            {T("Исполнители проекта")}
          </Typography>

          <Box
            component="ul"
            aria-label={T("Исполнители проекта")}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "grid",
              gap: 2.5,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            }}
          >
            {team.map((member) => (
              <Box
                component="li"
                key={member}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: kp.p.surface,
                  border: `1px solid ${kp.p.border}`,
                  boxShadow: kp.shadows.card,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    bgcolor: kp.isContrast ? "transparent" : kp.p.surfaceAlt,
                    color: kp.p.primary,
                    border: kp.isContrast ? `2px solid ${kp.p.border}` : `1px solid ${kp.p.border}`,
                  }}
                >
                  <PersonOutlineRounded sx={{ fontSize: 24 }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Manrope Variable', sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: kp.p.text,
                    lineHeight: 1.4,
                  }}
                >
                  {member}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Donation & Volunteer CTA Card */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            p: { xs: 4, md: 6 },
            borderRadius: 6,
            bgcolor: kp.isContrast ? kp.p.bg : kp.p.surfaceAlt,
            border: `1px solid ${kp.p.border}`,
            boxShadow: kp.shadows.card,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Box sx={{ maxWidth: 720 }}>
            <Typography variant="h3" component="h3" sx={{ mb: 1.5 }}>
              {T("Поддержка")}
            </Typography>
            <Typography sx={{ color: kp.p.textSecondary, fontSize: "1.0625rem", lineHeight: 1.6 }}>
              {T(
                "Если вы хотите внести свой вклад в реализацию этого проекта, вы можете поддержать нас, используя системы онлайн-платежей Click, Payme или Payze или став волонтером по ссылке"
              )}
            </Typography>
          </Box>

          <Button
            component="a"
            href="https://sharoitplus.uz/ru/podderjat/#donate-form"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="large"
            endIcon={<OpenInNewRounded aria-hidden="true" />}
            sx={{ flexShrink: 0 }}
          >
            sharoitplus.uz
          </Button>
        </Box>
      </Container>
    </PageShell>
  );
};

export default Contacts;
