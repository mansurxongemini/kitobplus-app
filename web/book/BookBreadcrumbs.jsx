import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import T from "../lib/translator";

const BookBreadcrumbs = ({ book }) => {
  const breadcrumbsData = [
    { label: T("Главная"), link: "/", active: false },
    { label: T("Аудиокниги"), link: "/books", active: false },
    {
      label: book?.authors_name && book?.title && book?.dictors_name
        ? `${book.authors_name} – ${book.title} (${book.dictors_name})`
        : "...",
      link: "#",
      active: true
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "43px",
        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.1)",
        borderRadius: 0,
        backgroundColor: "transparent",        
      }}
    >
      <Box
        sx={{
          paddingLeft: "32px",
          paddingTop: "16px",
          height: "100%",
        }}
      >
        <Breadcrumbs
          separator={
            <NavigateNextIcon
              fontSize="small"
              sx={{
                color: "#eee",
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
                  color: "#eee",
                  opacity: 0.75,
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
                  color: "#eee",
                  opacity: 0.99,
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

export default BookBreadcrumbs;
