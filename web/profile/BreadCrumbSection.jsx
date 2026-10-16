import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import React from "react";

const BreadCrumbSection = () => {
  // Breadcrumb items data
  const breadcrumbItems = [
    { label: "Главная", active: false },
    { label: "Профиль", active: false },
    { label: "Мои данные", active: true },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "43px",
        bgcolor: "background.paper",
        boxShadow: "inset 0px -1px 0px #ecf1f5",
        display: "flex",
        alignItems: "center",
        paddingLeft: { xs: 2, md: "122px" },
      }}
    >
      <Breadcrumbs
        separator={
          <NavigateNextIcon
            fontSize="small"
            sx={{ width: "10px", height: "19px", color: "text.secondary" }}
          />
        }
        aria-label="breadcrumb"
      >
        {breadcrumbItems.map((item, index) => (
          <Typography
            key={index}
            sx={{
              fontFamily: "'PT_Root_UI-Medium', Helvetica",
              fontWeight: 500,
              fontSize: "16px",
              color: item.active ? "text.primary" : "text.secondary",
              opacity: item.active ? 0.7 : 0.5,
              lineHeight: "normal",
              whiteSpace: "nowrap",
              mt: "-1px",
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadCrumbSection;
