import { Box, Button, Typography } from "@mui/material";
import React from "react";
import group19999 from "./img/group19999.png";
import T from "../lib/translator";

const TestimonialsSection = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "auto", md: "414px" },
        bgcolor: "maindark.main",
        position: "relative",
        overflow: "hidden",
        py: { xs: 4, md: 0 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "auto", md: "414px" },
          ml: { xs: 0, md: "124px" },
          width: { xs: "100%", md: "1316px" },
          maxWidth: "100%",
          px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        {/* Background image and effects - only on desktop */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "absolute",
            width: "1124px",
            height: "414px",
            top: 0,
            left: "192px",
            backgroundImage: "url(/group-2-2.png)",
            backgroundSize: "100% 100%",
          }}
        >
          <Box sx={{ position: "relative", height: "501px", top: "-87px" }}>
            <Box
              sx={{
                width: "1124px",
                height: "414px",
                top: "87px",
                transform: "rotate(180deg)",
                position: "absolute",
                left: 0,
                background:
                  "linear-gradient(270deg, rgba(2,73,89,1) 0%, rgba(2,73,89,0) 100%)",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: "187px",
                height: "285px",
                top: "55px",
                left: "688px",
                bgcolor: "#000000b2",
                borderRadius: "93.29px/142.38px",
                filter: "blur(42px)",
              }}
            />

            <Box
              component="img"
              sx={{
                position: "absolute",
                width: "632px",
                height: "501px",
                top: 0,
                left: "309px",
              }}
              alt=""
              aria-hidden="true"
              src={group19999}
            />
          </Box>
        </Box>

        {/* Content */}
        <Typography
          variant="h2"
          sx={{
            position: { xs: "relative", md: "absolute" },
            width: { xs: "100%", md: "500px" },
            top: { xs: 0, md: "8px" },
            left: 0,
            mb: { xs: 2, md: 0 },
            fontFamily: "'PT_Root_UI-Bold', Helvetica",
            fontWeight: "bold",
            color: "white",
            fontSize: { xs: "24px", md: "30px" },
            lineHeight: { xs: "1.3", md: "39px" },
          }}
        >
          {T('Пройдите регистрацию и получи премиум доступ на семь дней')}
        </Typography>

        <Typography
          sx={{
            position: { xs: "relative", md: "absolute" },
            width: { xs: "100%", md: "478px" },
            top: { xs: 0, md: "110px" },
            left: 0,
            mb: { xs: 3, md: 0 },
            fontFamily: "'PT_Root_UI-Medium', Helvetica",
            fontWeight: "medium",
            color: "#ffffffb2",
            fontSize: { xs: "14px", md: "16px" },
            textAlign: "left",
            lineHeight: { xs: "1.5", md: "normal" },
          }}
        >
🎁 <strong>{T('7 дней Премиум-доступа — в подарок каждому!')}</strong><br/>
{T('Хотите попробовать нашу библиотеку? Достаточно указать номер телефона — и вы получите неделю бесплатного доступа ко всем книгам. Никаких платежей — только книги.')}<br/><br/>

⏱️ <strong>{T('Регистрация за 30 секунд.')}</strong><br/>
{T('Никаких документов — только ваш телефон. Попробуйте прямо сейчас: нажмите "Зарегистрироваться" и слушайте любимые книги уже сегодня!')}<br/><br/>

        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth={{ xs: true, sm: false }}
          sx={{
            position: { xs: "relative", md: "absolute" },
            width: { xs: "100%", sm: "249px" },
            height: "56px",
            top: { xs: 0, md: "333px" },
            left: 0,
            boxShadow: "0px 6px 40px #02a3b833",
            bgcolor: "primary.main",
            borderRadius: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'PT_Root_UI-Bold', Helvetica",
              fontWeight: "bold",
              color: "lightwhite.main",
              fontSize: { xs: "18px", md: "20px" },
              textAlign: "center",
            }}
          >
            {T('Зарегистрироваться')}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default TestimonialsSection;
