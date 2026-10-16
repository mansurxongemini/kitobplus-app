import React from "react";
import { Box, Card, Typography, useTheme } from "@mui/material";
import LoginForm from "./login/LoginForm.jsx";
import PageShell from "./ds/components/PageShell";
import Container from "./ds/components/Container";
import T from "./lib/translator.js";
import { useRouteA11y } from "./lib/a11y";

// Login: centred card inside the global PageShell (header, footer, theme).
// All phone/SMS/Google/Apple logic lives in LoginForm and is unchanged.
const Login = () => {
  const { kp } = useTheme();
  useRouteA11y(T("Регистрация/вход"));
  return (
    <PageShell title={T("Регистрация/вход")}>
      <Container sx={{ py: { xs: 5, md: 9 }, display: "flex", justifyContent: "center" }}>
        <Card
          component="section"
          aria-labelledby="login-title"
          sx={{
            width: "100%",
            maxWidth: 560,
            p: { xs: 3, md: 5 },
            borderRadius: 6,
            boxShadow: kp.shadows.raised,
          }}
        >
          <Typography id="login-title" variant="h1" sx={{ fontSize: "clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem)" }}>
            {T("Регистрация/вход")}
          </Typography>
          <Typography sx={{ mt: 1.5, color: kp.p.textSecondary }}>
            {T("Войдите по номеру телефона — это займёт меньше минуты")}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <LoginForm />
          </Box>
        </Card>
      </Container>
    </PageShell>
  );
};

export default Login;
