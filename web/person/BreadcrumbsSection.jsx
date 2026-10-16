import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import T from "../lib/translator";

const BreadcrumbsSection = ({table, userData}) => {
  const tables = {
    'authors': 'Авторы',
    'dictors': 'Дикторы',
    'genres': 'Жанры',
  };

  const breadcrumbsData = [
    { label: T("Главная"), link: "/", active: false },
    { label: T(tables[table]), link: `/persons/${table}`, active: false },
    { label: userData?.name, link: "#", active: true },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "43px",
        boxShadow: "inset 0px -1px 0px #ecf1f5",
        borderRadius: 0,
      }}
    >
      <Box
        sx={{
          paddingLeft: "122px",
          paddingTop: "12px",
          height: "100%",
        }}
      >
        <Breadcrumbs
          separator={
            <NavigateNextIcon
              fontSize="small"
              sx={{
                color: "text.secondary",
                opacity: 0.4,
                width: "10px",
                height: "19px",
              }}
            />
          }
          aria-label="breadcrumb"
        >
          {breadcrumbsData.map((item, index) => (
            item.active ? (
              <Typography
                key={index}
                sx={{
                  fontFamily: "'PT Root UI', Helvetica, Arial, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "text.secondary",
                }}
              >
                {item.label}
              </Typography>
            ) : (
              <Typography
                key={index}
                component={Link}
                to={item.link}
                sx={{
                  fontFamily: "'PT Root UI', Helvetica, Arial, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "text.secondary",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {item.label}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      </Box>
    </Paper>
  );
};

export default BreadcrumbsSection;