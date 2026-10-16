import EmailIcon from "@mui/icons-material/Email";
import TelegramIcon from '@mui/icons-material/Telegram';
import PhoneIcon from "@mui/icons-material/Phone";
import TwitterIcon from "@mui/icons-material/Twitter";

import { Box, Container, Grid, Link, Stack, Typography } from "@mui/material";
import React from "react";
import sharoit_logo from "../img/sharoit-final-1.png";
import logo_icon from "./img/logo_icon.png";
import group19 from "./img/group-19.png";
import group19_dark from "./img/group-19-dark.png";
import useLibrary from '../LibraryContext.js';
import T from "../lib/translator";
import {SITE_URL} from "../lib/config";

// Since we can't use local imports, we'll use placeholder URLs for images
const LOGO_URL = "https://example.com/kitobplus-logo.png"; // Placeholder

export default function FooterSection() {
  const {darkMode, setDarkMode} = useLibrary();

  // Navigation links data
  const navLinks = [
    { title: T("О нас"), active: false, href: "/#about"},
    { title: T("Аудиокниги"), active: false, href: "/books" },
    /*{ title: "Гостевая книга", active: false },*/
    { title: T("Контакты"), active: false, href: "/contacts" },
  ];

  // Social media links
  const socialLinks = [
    { icon: <TelegramIcon aria-hidden="true" />, url: "https://t.me/kitobplus_uz", label: T('Телеграм') },
    { icon: <TwitterIcon aria-hidden="true" />, url: "#", label: T('Твиттер') },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        py: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          opacity: 0.06,
          zIndex: -1,
        }}
      />

      <Container maxWidth="lg" sx={{textAlign: 'center'}}>
        {/* Logo Section */}
        <Box sx={{
          height: { xs: "36px", md: "48px" },
          mt: { xs: 2, md: 4 },
          mb: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
            <Box
            component="img"
            alt=""
            sx={{
                width: { xs: "26px", md: "39px" },
                height: { xs: "32px", md: "48px" },
            }}
            src={logo_icon}
            />
            <Box
            component="img"
            src={darkMode ? group19_dark : group19}
            alt={T('Логотип KitobPlus')}
            sx={{ height: { xs: "16px", md: "24px" }, ml: { xs: 1, md: 2 } }}
            />
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" } }}>
          {/* Error reporting box */}
          <Grid xs={12} md={3}>
            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(2, 163, 184, 0.05)",
                minHeight: { xs: "auto", md: "91px" },
                width: { xs: "100%", md: "277px" },
                mx: { xs: "auto", md: 0 },
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontFamily: "'PT_Root_UI-Medium',Helvetica",
                  fontSize: { xs: "14px", md: "16px" },
                  lineHeight: "22.4px",
                }}
              >
                {T('Если вы видите ошибку на сайте, выделите ее и нажмите CTRL + ENTER (⌘ + ENTER)')}
              </Typography>
            </Box>
          </Grid>

          {/* Navigation Links */}
          <Grid xs={12} md={5}>
            <nav aria-label={T('Меню')}>
            <Grid container spacing={{ xs: 2, md: 4 }}>
              <Grid xs={6}>
                {navLinks.slice(0, 2).map((link, index) => (
                  <Box key={index} mb={2}>
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent={{ xs: "center", md: "flex-start" }}>
                      {link.active && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            bgcolor: "primary.main",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                      <Link
                        href={link.href}
                        underline="none"
                        sx={{
                          fontFamily: "'PT_Root_UI-Medium',Helvetica",
                          fontSize: { xs: "16px", md: "20px" },
                          fontWeight: "medium",
                          color: "secondary.main",
                          opacity: link.active ? 1 : 0.5,
                          lineHeight: "26px",
                        }}
                      >
                        {link.title}
                      </Link>
                    </Stack>
                  </Box>
                ))}
              </Grid>
              <Grid xs={6}>
                {navLinks.slice(2, 4).map((link, index) => (
                  <Box key={index} mb={2}>
                    <Link
                      href={link.href}
                      underline="none"
                      sx={{
                        fontFamily: "'PT_Root_UI-Medium',Helvetica",
                        fontSize: { xs: "16px", md: "20px" },
                        fontWeight: "medium",
                        color: "secondary.main",
                        opacity: 0.5,
                        lineHeight: "26px",
                      }}
                    >
                      {link.title}
                    </Link>
                  </Box>
                ))}
              </Grid>
            </Grid>
            </nav>
          </Grid>

          {/* Contact Information */}
          <Grid xs={12} md={4}>
            <Stack spacing={2} alignItems={{ xs: "center", md: "flex-start" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PhoneIcon sx={{ color: "secondary.main", fontSize: { xs: 20, md: 24 } }} />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'PT_Root_UI-Medium',Helvetica",
                    fontSize: { xs: "16px", md: "20px" },
                    fontWeight: "medium",
                    color: "secondary.main",
                    lineHeight: "32px",
                  }}
                >
                  +998 (90) 808-73-31
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <EmailIcon sx={{ color: "secondary.main", fontSize: { xs: 20, md: 24 } }} />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'PT_Root_UI-Medium',Helvetica",
                    fontSize: { xs: "16px", md: "20px" },
                    fontWeight: "medium",
                    color: "secondary.main",
                    lineHeight: "32px",
                  }}
                >
                  info@kitobplus.uz
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Footer Bottom Section */}
        <Box
          sx={{ mt: { xs: 3, md: 4 }, pt: 1, borderTop: "1px solid rgba(173, 172, 174, 0.3)" }}
        >
          <Grid container spacing={{ xs: 2, md: 0 }} justifyContent="space-between" alignItems="center">
            <Grid xs={12} md={4} sx={{ order: { xs: 3, md: 1 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontFamily: "'PT_Root_UI-Medium',Helvetica",
                  fontSize: { xs: "14px", md: "16px" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                {T('Все права защищены')} © 2025 Kitobplus.uz
              </Typography>
            </Grid>

            <Grid xs={12} md={4} sx={{ order: { xs: 1, md: 2 } }}>
              <nav aria-label={T('Социальные сети')}>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Link
                  href={"https://apps.apple.com/us/app/kitobplus/id6470842246"}
                  aria-label={T('Приложение под iOS')}
                  sx={{
                    color: "secondary.main",
                    width: 35,
                    height: 35,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: "rgba(2, 163, 184, 0.05)",
                  }}
                >
                  <img title={T('Приложение под iOS')} alt="" aria-hidden="true" style={{height: 24,paddingRight: 8}} src={SITE_URL + "/images/appstore.png"}/>
                </Link>

                <Link
                  href={"https://play.google.com/store/apps/details?id=uz.kitobplus.app"}
                  aria-label={T('Приложение под Android')}
                  sx={{
                    color: "secondary.main",
                    width: 35,
                    height: 35,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: "rgba(2, 163, 184, 0.05)",
                  }}
                >
                  <img title={T('Приложение под Android')} alt="" aria-hidden="true" style={{height: 24,paddingRight: 8}} src={SITE_URL + "/images/googleplay.png"}/>
                </Link>

                {socialLinks.map((social, index) => (
                  <Link
                    target="_blank"
                    key={index}
                    href={social.url}
                    aria-label={social.label}
                    sx={{
                      color: "secondary.main",
                      width: 35,
                      height: 35,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      bgcolor: "rgba(2, 163, 184, 0.05)",
                    }}
                  >
                    {social.icon}
                  </Link>
                ))}
              </Stack>
              </nav>
            </Grid>

            <Grid xs={12} md={4} sx={{ order: { xs: 2, md: 3 } }}>
              <Stack direction="row" alignItems="center" spacing={1} justifyContent={{ xs: "center", md: "flex-end" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#939393",
                    fontFamily: "'Open_Sans-SemiBold',Helvetica",
                    fontWeight: 600,
                    fontSize: { xs: "12px", md: "14px" },
                  }}
                >
                Powered by
                </Typography>
                  <Link
                    target="_blank"
                    aria-label={'Powered by Sharoit plus'}
                    href="https://sharoitplus.uz/"
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      src={sharoit_logo}
                      style={{width: 32, height: 32}}
                    />
                  </Link>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
