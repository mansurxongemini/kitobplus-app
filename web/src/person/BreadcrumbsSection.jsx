import React from "react";
import { Breadcrumbs, Box, useTheme } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import T from "../lib/translator";

const BreadcrumbsSection = ({ table, name }) => {
  const { kp } = useTheme();
  const parentLink = table === "genres" ? "/genres" : `/persons/${table}`;
  const parentLabel =
    table === "genres"
      ? T("Жанры")
      : table === "dictors"
      ? T("Дикторы")
      : T("Авторы");

  return (
    <Breadcrumbs
      aria-label={T("Вы находитесь здесь")}
      separator={<NavigateNextIcon fontSize="small" aria-hidden="true" />}
      sx={{ mb: 3, "& a, & span": { fontSize: "1rem" } }}
    >
      <Box
        component={RouterLink}
        to="/"
        sx={{ color: kp.p.textSecondary, textDecoration: "none", "&:hover": { color: kp.p.text } }}
      >
        {T("Главная")}
      </Box>
      <Box
        component={RouterLink}
        to={parentLink}
        sx={{ color: kp.p.textSecondary, textDecoration: "none", "&:hover": { color: kp.p.text } }}
      >
        {parentLabel}
      </Box>
      <Box component="span" aria-current="page" sx={{ color: kp.p.text, fontWeight: 600 }}>
        {name}
      </Box>
    </Breadcrumbs>
  );
};

export default BreadcrumbsSection;