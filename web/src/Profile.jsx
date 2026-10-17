import React from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";
import PageShell from "./ds/components/PageShell";
import Container from "./ds/components/Container";
import ProfileMenuSection from "./profile/ProfileMenuSection";
import profileBannerBg from "./img/profile_banner_background.png";
import T from "./lib/translator.js";

const Profile = () => {
  const { kp } = useTheme();

  return (
    <PageShell title={T("Профиль")}>
      <Box
        component="section"
        aria-labelledby="kp-profile-title"
        sx={{
          bgcolor: kp.p.surfaceAlt,
          backgroundImage: `linear-gradient(90deg, ${kp.p.surfaceAlt} 0%, ${alpha(kp.p.surfaceAlt, 0.96)} 42%, ${alpha(kp.p.surfaceAlt, 0.2)} 70%, ${alpha(kp.p.surfaceAlt, 0)} 85%), url(${profileBannerBg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: { xs: "right 30%", md: "right center" },
          backgroundSize: { xs: "cover", md: "contain" },
          borderBottom: `1px solid ${kp.p.border}`,
          py: { xs: 4, md: 5.5 },
        }}
      >
        <Container>
          <Typography
            id="kp-profile-title"
            component="h1"
            sx={{
              fontFamily: kp.fonts.heading,
              fontWeight: 900,
              fontSize: { xs: "2.25rem", md: "3.25rem" },
              letterSpacing: "-0.04em",
              color: kp.p.text,
              lineHeight: 1.1,
            }}
          >
            {T("Профиль")}
          </Typography>
          <Typography
            sx={{
              color: kp.p.textSecondary,
              fontSize: { xs: "0.9375rem", md: "1.0625rem" },
              mt: 1,
              maxWidth: 540,
            }}
          >
            {T("Shaxsiy kabinetingizda ma'lumotlaringizni boshqaring")}
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <ProfileMenuSection />
      </Container>
    </PageShell>
  );
};

export default Profile;
