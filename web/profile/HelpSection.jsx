import HelpOutline from "@mui/icons-material/HelpOutline";
import Email from "@mui/icons-material/Email";
import Phone from "@mui/icons-material/Phone";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import T from "../lib/translator";

const HelpSection = () => {
  const faqData = [
    {
      id: 1,
      question: T("Как зарегистрироваться на платформе?"),
      answer: T("Для регистрации нажмите кнопку 'Войти' в правом верхнем углу, затем выберите 'Регистрация'. Заполните все необходимые поля и подтвердите свой email адрес.")
    },
    {
      id: 2,
      question: T("Как найти нужную книгу?"),
      answer: T("Используйте поиск по названию, автору или жанру. Также вы можете воспользоваться фильтрами для более точного поиска.")
    },
    {
      id: 3,
      question: T("Как слушать аудиокниги?"),
      answer: T("Выберите книгу, нажмите кнопку воспроизведения. Вы можете регулировать скорость воспроизведения и ставить закладки.")
    },
    {
      id: 4,
      question: T("Как добавить книгу в избранное?"),
      answer: T("Нажмите на иконку сердца рядом с названием книги. Все избранные книги будут доступны в вашем профиле.")
    },
    {
      id: 5,
      question: T("Проблемы с воспроизведением аудио"),
      answer: T("Проверьте интернет-соединение, обновите браузер или попробуйте другой браузер. Если проблема сохраняется, обратитесь в поддержку.")
    }
  ];

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "neutral.100",
        boxShadow: "0px 4px 24px rgba(38, 38, 38, 0.07)",
        p: 3,
        width: "100%",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontFamily: "'PT_Root_UI-Bold',Helvetica",
          fontWeight: "bold",
          color: "secondary.main",
          mb: 3,
        }}
      >
        {T('Помощь')}
      </Typography>

      {/* Контактная информация */}
      <Card sx={{ mb: 3, border: 1, borderColor: "neutral.100" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'PT_Root_UI-Bold',Helvetica",
              fontWeight: "bold",
              color: "secondary.main",
              mb: 2,
            }}
          >
            {T('Связаться с нами')}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Email color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary="info@kitobplus.uz"
                primaryTypographyProps={{
                  fontFamily: "'PT_Root_UI-Medium',Helvetica",
                  fontWeight: "medium",
                }}
                secondaryTypographyProps={{
                  fontFamily: "'PT_Root_UI-Regular',Helvetica",
                }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Phone color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={T("Телефон")}
                secondary="+998 (90) 808-73-31"
                primaryTypographyProps={{
                  fontFamily: "'PT_Root_UI-Medium',Helvetica",
                  fontWeight: "medium",
                }}
                secondaryTypographyProps={{
                  fontFamily: "'PT_Root_UI-Regular',Helvetica",
                }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Часто задаваемые вопросы */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: "'PT_Root_UI-Bold',Helvetica",
          fontWeight: "bold",
          color: "secondary.main",
          mb: 2,
        }}
      >
        {T('Часто задаваемые вопросы')}
      </Typography>

      {faqData.map((faq) => (
        <Accordion
          key={faq.id}
          sx={{
            mb: 1,
            border: 1,
            borderColor: "neutral.100",
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              bgcolor: "background.paper",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HelpOutline sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                sx={{
                  fontFamily: "'PT_Root_UI-Medium',Helvetica",
                  fontWeight: "medium",
                  fontSize: "16px",
                }}
              >
                {faq.question}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                fontFamily: "'PT_Root_UI-Regular',Helvetica",
                fontSize: "14px",
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Кнопка обратной связи */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: 250,
            height: 44,
            fontFamily: "'PT_Root_UI-Bold',Helvetica",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {T('Написать в поддержку')}
        </Button>
      </Box>
    </Box>
  );
};

export default HelpSection;
