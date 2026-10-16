import { Box } from "@mui/material";
import React from "react";
import Navigation from "../parts/Navigation";
import FooterSection from "../parts/FooterSection";
import GenresView from "./GenresView";
import T from "../lib/translator";
import { useRouteA11y } from "../lib/a11y";

const Genres = () => {
  useRouteA11y(T('Все жанры библиотеки'));
  return (
    <>
      <Navigation mainContent="genres_title" />
      <Box
        component="main"
        id="main_content"
        tabIndex={-1}
        sx={{
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          minHeight: "calc(100vh - 96px)", // Вычитаем высоту навигации
        }}
      >
        <Box
          sx={{
            bgcolor: "background.default",
            width: "100%",
            maxWidth: "1440px",
          }}
        >
          <GenresView />
        </Box>
      </Box>
      <FooterSection />
    </>
  );
};

export default Genres;
