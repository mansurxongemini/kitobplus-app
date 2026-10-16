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
        {T('Правила пользования')}
      </Typography>

      {/* Основные правила */}
      {rulesData.map((section, index) => (
        <Card
          key={section.id}
          sx={{
            mb: 3,
            border: 1,
            borderColor: "neutral.100",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {section.icon}
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'PT_Root_UI-Bold',Helvetica",
                  fontWeight: "bold",
                  color: "secondary.main",
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
                          fontFamily: "'PT_Root_UI-Regular',Helvetica",
                          fontSize: "14px",
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
          bgcolor: "rgba(255, 152, 0, 0.05)",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Warning color="warning" />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'PT_Root_UI-Bold',Helvetica",
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
              fontFamily: "'PT_Root_UI-Regular',Helvetica",
              fontSize: "14px",
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
                  fontFamily: "'PT_Root_UI-Regular',Helvetica",
                  fontSize: "12px",
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Контактная информация */}
      <Card sx={{ border: 1, borderColor: "neutral.100" }}>
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
            {T('Вопросы по правилам')}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'PT_Root_UI-Regular',Helvetica",
              fontSize: "14px",
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
            fontFamily: "'PT_Root_UI-Regular',Helvetica",
            fontSize: "12px",
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
