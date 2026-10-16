import AddIcon from "@mui/icons-material/Add";
import CasinoIcon from '@mui/icons-material/Casino';
import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import logo_icon from "./img/logo_icon.png";
import featured_play_icon from "./img/featured_play_icon.png";
import audiobooks_icon from "./img/audiobooks_icon.png";
import group19 from "./img/group-19.png";
import pexelsKarolinaGrabowska44763661 from "./img/pexels-karolina-grabowska-4476366-1.png";
import vision_impired_icon from "./img/vision_impired_icon.png";
import { useNavigate } from "react-router-dom";
import T from "../lib/translator";
import { getHost } from "../lib/api";

const FeaturedSection = () => {
  const navigate = useNavigate();
  
  const playRandomBook = async () => {
    const response = await fetch(getHost() + '/srv/books.php?sort=rand&page=0&per_page=1');
    const result = await response.json();
    if (result?.success && result?.data.length === 1) {
      navigate("/books/" + result?.data[0].id);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "auto", sm: "480px", md: "584px" },
        minHeight: { xs: "500px", sm: "auto" },
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(236,241,245,0.5) 100%)",
        position: "relative",
      }}
    >
      <Box sx={{
        height: { xs: "auto", sm: "480px", md: "724px" },
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" }
      }}>
        {/* Background image - hidden on mobile, visible on tablet+ */}
        <Box
          component="img"
          src={pexelsKarolinaGrabowska44763661}
          alt="Женщина в очках озвучивает аудиокнигу сидя за столом в комнате со светлым интерьером."
          sx={{
            display: { xs: "none", sm: "block" },
            position: "absolute",
            width: { sm: "50%", md: "934px" },
            height: { sm: "480px", md: "584px" },
            right: 0,
            objectFit: "cover",
            zIndex: 1,
          }}
        />

        {/* Hero section with gradient background */}
        <Box
          sx={{
            position: { xs: "relative", sm: "absolute" },
            width: { xs: "100%", sm: "60%", md: "919px" },
            height: { xs: "auto", sm: "480px", md: "584px" },
            left: 0,
            background: {
              xs: "rgba(2,163,184,1)",
              sm: "linear-gradient(274deg, rgba(2,163,184,0) 0%, rgba(2,163,184,1) 33%, rgba(2,163,184,1) 100%)",
            },
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: { xs: "flex-start", md: "center" },
            px: { xs: 3, sm: 4, md: 0 },
            py: { xs: 6, md: 0 },
          }}
        >
          {/* Circular logo */}
          <Box
            sx={{
              position: { xs: "relative", md: "absolute" },
              width: { xs: "80px", md: "100px" },
              height: { xs: "80px", md: "100px" },
              top: { xs: 0, md: "90px" },
              left: { xs: 0, md: "129px" },
              mb: { xs: 3, md: 0 },
              bgcolor: "white",
              borderRadius: "70px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: "74px", md: "94px" },
                height: { xs: "74px", md: "94px" },
                top: "3px",
                left: "3px",
              }}
              component="img"
              src={featured_play_icon}
            />
          </Box>

          {/* Main heading */}
          <Typography
            variant="h1"
            color="white"
            sx={{
              position: { xs: "relative", md: "absolute" },
              width: { xs: "100%", md: "574px" },
              top: { xs: 0, md: "221px" },
              left: { xs: 0, md: "129px" },
              mb: { xs: 2, md: 0 },
              fontFamily: "'PT_Root_UI-Bold', Helvetica",
              fontSize: { xs: "36px", sm: "48px", md: "59px" },
              lineHeight: { xs: "1.2", md: "82.6px" },
            }}
          >
            {T('Онлайн библиотека')}
          </Typography>

          {/* Subheading */}
          <Typography
            variant="h2"
            color="white"
            sx={{
              position: { xs: "relative", md: "absolute" },
              width: { xs: "100%", md: "574px" },
              top: { xs: 0, md: "308px" },
              left: { xs: 0, md: "129px" },
              mb: { xs: 4, md: 0 },
              fontFamily: "'PT_Root_UI-Regular', Helvetica",
              fontWeight: "normal",
              fontSize: { xs: "18px", sm: "24px", md: "30px" },
              lineHeight: { xs: "1.4", md: "39px" },
              whiteSpace: { xs: "normal", md: "pre-line" },
            }}
          >
            {T('для любителей аудиокниг и\nдля Лиц с нарушениями зрения')}
          </Typography>

          {/* Action buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 0 }}
            sx={{
              position: { xs: "relative", md: "absolute" },
              top: { xs: 0, md: "526px" },
              left: { xs: 0, md: "124px" },
            }}
          >
            <Button
              id="main_content"
              variant="contained"
              fullWidth={{ xs: true, sm: false }}
              sx={{
                bgcolor: "maindark.main",
                px: { xs: 3, md: 4 },
                py: 2,
                borderRadius: 0,
              }}
              startIcon={
                <Box
                  sx={{
                    width: "26px",
                    height: "26px",
                    bgcolor: "white",
                    borderRadius: "70px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      position: "absolute",
                      top: "1px",
                      left: "1px",
                    }}
                    component="img"
                    src={audiobooks_icon}
                  />
                </Box>
              }
              onClick={() => navigate('/books')}
            >
              <Typography
                sx={{
                  fontFamily: "'PT_Root_UI-Medium', Helvetica",
                  fontWeight: 500,
                  fontSize: { xs: "18px", md: "20px" },
                  lineHeight: "26px",
                  color: "white"
                }}
              >
                {T('Аудиокниги')}
              </Typography>
            </Button>

            <Button
              variant="contained"
              fullWidth={{ xs: true, sm: false }}
              sx={{
                bgcolor: "rgba(2, 73, 89, 0.5)",
                px: { xs: 3, md: 4 },
                py: 2,
                borderRadius: 0,
              }}
              startIcon={
                <CasinoIcon
                  sx={{ color: "white", width: "26px", height: "26px" }}
                />
              }
              onClick={playRandomBook}
            >
              <Typography
                sx={{
                  fontFamily: "'PT_Root_UI-Medium', Helvetica",
                  fontWeight: 500,
                  fontSize: { xs: "18px", md: "20px" },
                  lineHeight: "26px",
                  color: "white"
                }}
              >
                {T('Случайная аудиокнига')}
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedSection;
