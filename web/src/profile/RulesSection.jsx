import Gavel from "@mui/icons-material/Gavel";
import Security from "@mui/icons-material/Security";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import Warning from "@mui/icons-material/Warning";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import React from "react";
import T from "../lib/translator";

const RulesSection = () => {
  const rulesData = [
    {
      id: 1,
      category: T("Общие правила"),
      icon: <Gavel color="primary" />,
      rules: [
        T("Уважайте других пользователей платформы"),
        T("Не публикуйте оскорбительные комментарии"),
        T("Используйте платформу только в законных целях"),
        T("Не нарушайте авторские права"),
        T("Соблюдайте правила сообщества")
      ]
    },
    {
      id: 2,
      category: T("Безопасность аккаунта"),
      icon: <Security color="primary" />,
      rules: [
        T("Используйте надежный пароль"),
        T("Не передавайте данные аккаунта третьим лицам"),
        T("Регулярно обновляйте пароль"),
        T("Сообщайте о подозрительной активности"),
        T("Выходите из аккаунта на общих устройствах")
      ]
    },
    {
      id: 3,
      category: T("Использование контента"),
      icon: <VerifiedUser color="primary" />,
      rules: [
        T("Контент предназначен только для личного использования"),
        T("Запрещено скачивание и распространение аудиокниг"),
        T("Не нарушайте лицензионные соглашения"),
        T("Уважайте права авторов и издателей"),
        T("Сообщайте о нарушениях авторских прав")
      ]
    }
  ];

  const violationConsequences = [
    T("Предупреждение пользователя"),
    T("Временная блокировка аккаунта"),
    T("Ограничение доступа к функциям"),
    T("Полная блокировка аккаунта"),
    T("Правовые последствия при серьезных нарушениях")
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
        {T('Правила пользования')}
      </Typography>

      {/* Основные правила */}
      {rulesData.map((section, index) => (
        <Card
          key={section.id}
          sx={{
            mb: 3,
            border: 1,
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {section.icon}
              <Typography
                variant="h4" component="h3"
                sx={{
                  fontWeight: "bold",
                  ml: 1,
                }}
              >
                {section.category}
              </Typography>
            </Box>
            <List>
              {section.rules.map((rule, ruleIndex) => (
                <ListItem key={ruleIndex} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          color: "text.primary",
                          lineHeight: 1.6,
                        }}
                      >
                        • {rule}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* Последствия нарушений */}
      <Card
        sx={{
          mb: 3,
          border: 1,
          borderColor: "warning.main",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Warning color="warning" />
            <Typography
              variant="h4" component="h3"
              sx={{
                fontWeight: "bold",
                color: "warning.main",
                ml: 1,
              }}
            >
              {T('Последствия нарушений')}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "text.secondary",
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            {T('При нарушении правил платформы могут быть применены следующие меры')}:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {violationConsequences.map((consequence, index) => (
              <Chip
                key={index}
                label={consequence}
                variant="outlined"
                color="warning"
                size="small"
                sx={{
                  fontSize: "0.9375rem",
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Контактная информация */}
      <Card sx={{ border: 1, borderColor: "divider" }}>
        <CardContent>
          <Typography
            variant="h4" component="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {T('Вопросы по правилам')}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "text.secondary",
              lineHeight: 1.6,
            }}
          >
            {T('Если у вас есть вопросы по правилам пользования платформой или вы хотите сообщить о нарушении, обратитесь в службу поддержки по адресу')}{" "}
            <Typography
              component="span"
              sx={{
                color: "primary.main",
                fontWeight: "medium",
              }}
            >
              support@kitobplus.uz
            </Typography>
          </Typography>
        </CardContent>
      </Card>

      {/* Дата обновления */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: "0.9375rem",
            color: "text.secondary",
          }}
        >
          {T('Последнее обновление правил: 15 июня 2024 г.')}
        </Typography>
      </Box>
    </Box>
  );
};

export default RulesSection;
