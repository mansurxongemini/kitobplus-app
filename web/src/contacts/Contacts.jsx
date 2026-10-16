import React from "react";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import Navigation from "../parts/Navigation";
import FooterSection from "../parts/FooterSection";
import T from "../lib/translator";
import { useRouteA11y } from "../lib/a11y";

const Contacts = () => {
  useRouteA11y(T('Контакты'));
  return (
    <>
      <Navigation />
      <Box
        component="main"
        id="main_content"
        tabIndex={-1}
        sx={{
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          py: 6,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "960px",
            px: 3,
          }}
        >
          <Typography variant="h3" component="h1" sx={{ mb: 3, fontFamily: "'PT_Root_UI-Bold', Helvetica", fontWeight: 700 }}>
            {T('Контакты')}
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 2, fontFamily: "'PT_Root_UI-Bold', Helvetica", fontWeight: 700 }}>
            {T('Исполнители проекта')}:
          </Typography>

          <Typography sx={{ mb: 1.5 }}>
            {T('Менеджер проекта: Мирали Гиясов')}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            {T('Координатор проекта: Абдулазиз Салимов')}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            {T('Программист: Михаил Корнеев')}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            {T('Корректор: Ширин Ульмасова')}
          </Typography>
          <Typography sx={{ mb: 3 }}>
            {T('Бухгалтер проекта: Ирода Нарзиева')}
          </Typography>

          <Typography sx={{ mb: 3 }}>
            {T('Ваши вопросы и предложения по проекту направляйте на электронный адрес')}{" "}
            <MuiLink href="mailto:m.giyosov@sharoitplus.uz">m.giyosov@sharoitplus.uz</MuiLink>{" "}
            {T('или свяжитесь с нами по этому номеру телефона')}:{" "}
            <MuiLink href="tel:+998977087331">+998 (97) 708-73-31</MuiLink>.
          </Typography>

          <Typography sx={{ mb: 1.5 }}>
            {T('Если вы хотите внести свой вклад в реализацию этого проекта, вы можете поддержать нас, используя системы онлайн-платежей Click, Payme или Payze или став волонтером по ссылке')}:
          </Typography>
          <MuiLink
            href="https://sharoitplus.uz/ru/podderjat/#donate-form"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ wordBreak: "break-all" }}
          >
            https://sharoitplus.uz/ru/podderjat/#donate-form
          </MuiLink>
        </Box>
      </Box>
      <FooterSection />
    </>
  );
};

export default Contacts;
