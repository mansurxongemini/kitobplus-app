import { Box, Container, Typography } from "@mui/material";
import React from "react";
import BreadCrumbSection from "./profile/BreadCrumbSection";
import FooterSection from "./parts/FooterSection";
import EditProfileSection from "./profile/EditProfileSection";
import ProfileMenuSection from "./profile/ProfileMenuSection";
import { ThemeProvider } from "./profile/ThemeProvider";
import Navigation from "./parts/Navigation";

const DivWrapper = () => {
  return (
      <Box
        sx={{
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            bgcolor: "background.paper",
            width: "100%",
            maxWidth: "1440px",
            position: "relative",
            p: 0,
          }}
        >
          <Navigation />
          <BreadCrumbSection />

          <Box sx={{
            px: { xs: 2, sm: 3, md: 8, lg: "124px" },
            mt: { xs: 2, md: 3 }
          }}>
            <Typography
              variant="h1"
              color="secondary.main"
              fontFamily="PT_Root_UI-Bold, Helvetica"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "32px", sm: "40px", md: "59px" },
                lineHeight: { xs: "1.2", md: "82.6px" }
              }}
            >
              Профиль
            </Typography>

            <ProfileMenuSection />
          </Box>

          <FooterSection />
        </Container>
      </Box>
  );
};

export default DivWrapper;
