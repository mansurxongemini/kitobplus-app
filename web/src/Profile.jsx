import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PageShell, { PageHeader } from "./ds/components/PageShell";
import Container from "./ds/components/Container";
import ProfileMenuSection from "./profile/ProfileMenuSection";
import useLibrary from "./LibraryContext";
import { getToken } from "./lib/api";
import T from "./lib/translator.js";

// Profile: global theme (the local ./profile/ThemeProvider is gone) and the
// shared PageShell header/footer. Section navigation lives in
// ProfileMenuSection. Без входа вместо пустого профиля — приглашение войти.
const Profile = () => {
  const { kp } = useTheme();
  const { user } = useLibrary();
  const signedOut = !user && !getToken();

  return (
    <PageShell title={T("Профиль")}>
      <PageHeader title={T("Профиль")} crumbs={[{ label: T("Профиль") }]} />
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        {signedOut ? (
          <Box sx={{ maxWidth: 560, p: { xs: 3, md: 5 }, borderRadius: 6, border: `1px solid ${kp.p.border}`, bgcolor: kp.p.surface }}>
            <Typography sx={{ fontSize: "1.25rem", lineHeight: 1.5 }}>
              {T("Чтобы открыть профиль, войдите в аккаунт")}
            </Typography>
            <Button component={RouterLink} to="/login" variant="contained" size="large" sx={{ mt: 3 }}>
              {T("Вход")}
            </Button>
          </Box>
        ) : (
          <ProfileMenuSection />
        )}
      </Container>
    </PageShell>
  );
};

export default Profile;
