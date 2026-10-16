import React, { useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "react-router-dom";
import Navigation from "../parts/Navigation";
import FooterSection from "../parts/FooterSection";
import { ThemeProvider } from "../parts/ThemeProvider";
import PersonsSection from "./PersonsSection";
import PersonsViewParams from "./PersonsViewParams";
import PersonsBreadcrumbs from "./PersonsBreadcrumbs";
import T from "../lib/translator";
import { useRouteA11y } from "../lib/a11y";

const Persons = () => {
  const { table } = useParams(); // 'authors' or 'dictors'
  const [sort, setSort] = useState("new");
  const [viewMode, setViewMode] = useState("list");

  const tableLabels = {
    authors: T("Авторы"),
    dictors: T("Дикторы"),
  };
  useRouteA11y(tableLabels[table] || T("Персоны"));

  return (
    <ThemeProvider>
      <Navigation mainContent="persons_title" />
      <Box
        component="main"
        id="main_content"
        tabIndex={-1}
        sx={{
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: "1440px",
            position: "relative",
            bgcolor: "background.paper",
          }}
        >
          {/* Breadcrumbs */}
          <PersonsBreadcrumbs table={table} />

          {/* Main content */}
          <Box sx={{ display: "flex", mt: "32px"}}>
            {/* Left column */}
            <Box sx={{ width: "785px", mx: 15.5, }}>
              {/* Header with title and view options */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontFamily: "'PT Root UI', Helvetica",
                    fontWeight: 700,
                    color: "text.primary",
                  }}
                >
                  {tableLabels[table] || T("Персоны")}
                </Typography>

                <PersonsViewParams
                  selectedFilter={sort}
                  setSelectedFilter={setSort}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              </Box>

              <PersonsSection
                table={table}
                sort={sort}
                viewMode={viewMode}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <FooterSection />
    </ThemeProvider>
  );
};

export default Persons;
