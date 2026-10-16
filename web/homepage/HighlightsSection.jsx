import { Box, Button, Typography } from "@mui/material";
import React from "react";
import layer2 from "./img/layer2.png";
import T from "../lib/translator";

const HighlightsSection = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "auto", md: "573px" },
        bgcolor: "maindark.main",
        position: "relative",
        overflow: "hidden",
        py: { xs: 4, md: 0 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: "1322px" },
          height: { xs: "auto", md: "645px" },
          position: "relative",
          top: { xs: 0, md: "-72px" },
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        {/* Background layers - only on desktop */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "956px",
            height: "573px",
            position: "absolute",
            top: "72px",
            left: 0,
            backgroundImage: "url(/layer-0.png)",
            backgroundSize: "100% 100%",
          }}
        />

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "956px",
            height: "573px",
            position: "absolute",
            top: "72px",
            left: 0,
            background:
              "linear-gradient(270deg, rgba(2,73,89,1) 0%, rgba(2,73,89,0) 100%)",
          }}
        />

        {/* Blur effects - only on desktop */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "120px",
            height: "120px",
            position: "absolute",
            top: "44px",
            left: "123px",
            bgcolor: "#00000080",
            borderRadius: "60px",
            filter: "blur(30px)",
          }}
        />

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "120px",
            height: "120px",
            position: "absolute",
            top: "50px",
            left: "290px",
            bgcolor: "#00000080",
            borderRadius: "60px",
            filter: "blur(30px)",
          }}
        />

        {/* Image - hidden on mobile */}
        <Box
          component="img"
          src={layer2}
          alt="People using tablet"
          sx={{
            display: { xs: "none", md: "block" },
            width: "590px",
            height: "645px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "956px",
            height: "573px",
            position: "absolute",
            top: "72px",
            left: 0,
            background:
              "linear-gradient(0deg, rgba(2,73,89,1) 0%, rgba(2,73,89,0) 100%)",
          }}
        />

        {/* Content box */}
        <Box
          sx={{
            width: { xs: "100%", md: "587px" },
            height: "auto",
            position: { xs: "relative", md: "absolute" },
            top: { xs: 0, md: "100px" },
            left: { xs: 0, md: "735px" },
            zIndex: 2,
          }}
        >
          <Typography
            id="about"
            variant="h2"
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", md: "478px" },
              position: { xs: "relative", md: "absolute" },
              top: 0,
              left: 0,
              mb: { xs: 2, md: 0 },
              fontFamily: "'PT_Root_UI-Bold', Helvetica",
              fontWeight: 700,
              color: "lightwhite.main",
              fontSize: { xs: "24px", md: "30px" },
              lineHeight: { xs: "1.3", md: "39px" },
            }}
          >
            {T('О портале')}
          </Typography>

          <Typography
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", md: "481px" },
              position: { xs: "relative", md: "absolute" },
              top: { xs: 0, md: "57px" },
              left: 0,
              mb: { xs: 3, md: 0 },
              fontFamily: "'PT_Root_UI-Medium', Helvetica",
              fontWeight: 500,
              color: "#ffffffb2",
              fontSize: { xs: "14px", md: "16px" },
              textAlign: { xs: "left", md: "justify" },
              lineHeight: "normal",
            }}
          >
{T('Наша платформа предоставляет бесплатный доступ к обширной коллекции аудиокниг для людей с инвалидностью по зрению. Для получения доступа необходимо подтвердить статус инвалидности.')}<br/><br/>
{T('Также мы предлагаем платную подписку «Премиум-доступ» для всех желающих. Средства от подписок направляются на развитие библиотеки, что позволяет нам расширять каталог и улучшать сервис.')}<br/><br/>
{T('Каждый новый пользователь может бесплатно протестировать Премиум-доступ в течение 7 дней после регистрации. Для создания аккаунта требуется только номер телефона.')}<br/><br/>
{T('Наша миссия — сделать знания и литературу доступными для всех, независимо от возможностей здоровья.')}<br/><br/>
          </Typography>

          <Typography
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", md: "481px" },
              position: { xs: "relative", md: "absolute" },
              top: { xs: 0, md: "380px" },
              left: 0,
              mb: { xs: 2, md: 0 },
              fontFamily: "'PT_Root_UI-Bold', Helvetica",
              fontWeight: 700,
              color: "lightwhite.main",
              fontSize: { xs: "18px", md: "20px" },
              lineHeight: "normal",
            }}
          >
            {T('Ваша поддержка позволит нам озвучивать новые книги для инвалидов по зрению')}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth={{ xs: true, sm: false }}
            sx={{
              width: { xs: "100%", sm: "249px" },
              height: "56px",
              position: { xs: "relative", md: "absolute" },
              top: { xs: 0, md: "460px" },
              left: 0,
              boxShadow: "0px 6px 40px rgba(2, 163, 184, 0.2)",
              bgcolor: "primary.main",
              borderRadius: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'PT_Root_UI-Bold', Helvetica",
                fontWeight: 700,
                color: "lightwhite.main",
                fontSize: { xs: "18px", md: "20px" },
                textAlign: "center",
                lineHeight: "normal",
              }}
            >
              {T('Пожертвовать')}
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HighlightsSection;
