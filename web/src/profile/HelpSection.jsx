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
        borderColor: "divider",
        borderRadius: 6,
        p: 3,
        width: "100%",
      }}
    >
      <Typography
        variant="h3" component="h2"
        sx={{
          fontWeight: "bold",
          mb: 3,
        }}
      >
        {T('Помощь')}
      </Typography>

      {/* Контактная информация */}
      <Card sx={{ mb: 3, border: 1, borderColor: "divider" }}>
        <CardContent>
          <Typography
            variant="h4" component="h3"
            sx={{
              fontWeight: "bold",
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
                  fontWeight: "medium",
                }}
                secondaryTypographyProps={{
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
                  fontWeight: "medium",
                }}
                secondaryTypographyProps={{
                }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Часто задаваемые вопросы */}
      <Typography
        variant="h4" component="h3"
        sx={{
          fontWeight: "bold",
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
            borderColor: "divider",
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HelpOutline sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                sx={{
                  fontWeight: "medium",
                  fontSize: "1.0625rem",
                }}
              >
                {faq.question}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                fontSize: "1rem",
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
            fontWeight: "bold",
            fontSize: "1.0625rem",
          }}
        >
          {T('Написать в поддержку')}
        </Button>
      </Box>
    </Box>
  );
};

export default HelpSection;
