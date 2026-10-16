import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Breadcrumbs,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import BooksViewParams from "./BooksViewParams"
import GenresSelector from "./GenresSelector";
import { Link } from "react-router-dom";
import Navigation from "../parts/Navigation";
import FooterSection from "../parts/FooterSection";
import { ThemeProvider } from "../parts/ThemeProvider";
import BooksSection from "./BooksSeciton";
import T from "../lib/translator";

const Books = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for expanded business category
  const [sort, setSort] = useState("new");
  const [viewMode, setViewMode] = useState("list");
  const [selectedGenres, setSelectedGenres] = React.useState(new Set());

  // Auto-switch to grid view on mobile
  const effectiveViewMode = isMobile ? "grid" : viewMode;


  return (
    <ThemeProvider>
      <Navigation mainContent="books_title" />
      <Box
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
            width: "100%",
            maxWidth: "1440px",
            position: "relative",
            bgcolor: "background.paper",
          }}
        >
          {/* Breadcrumbs */}
          <Box
            sx={{
              width: "100%",
              height: { xs: "auto", md: "44px" },
              minHeight: { xs: "40px", md: "44px" },
              position: "relative",
              top: { xs: "8px", md: "12px" },
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Breadcrumbs
              sx={{
                position: "relative",
                top: "6px",
                left: 0
              }}
              separator={
                <KeyboardArrowRight
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              }
            >
              <Link
                style={{
                  fontFamily: "'PT Root UI', Helvetica",
                  fontWeight: 500,
                  fontSize: "14px",
                  textDecoration: 'none',
                  color: 'inherit'
                }}
                to="/"
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontFamily: "'PT Root UI', Helvetica",
                    fontWeight: 500,
                    fontSize: { xs: "14px", md: "16px" },
                  }}
                >
                  {T('Главная')}
                </Typography>
              </Link>
              <Typography
                color="text.secondary"
                sx={{
                  fontFamily: "'PT Root UI', Helvetica",
                  fontWeight: 500,
                  fontSize: { xs: "14px", md: "16px" },
                }}
              >
                {T('Аудиокниги')}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Main content */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            mt: { xs: "16px", md: "32px" },
            pl: { xs: 2, sm: 3, md: 4 },
            pr: { xs: 2, sm: 3, md: 0 }
          }}>
            {/* Left column */}
            <Box sx={{
              width: { xs: "100%", md: "785px" },
              pr: { xs: 0, md: 2 }
            }}>
              {/* Header with title and view options */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  mb: { xs: 2, md: 3 },
                  gap: { xs: 2, sm: 0 }
                }}
              >
                <Typography
                  id="main_content"
                  variant="h2"
                  sx={{
                    fontFamily: "'PT Root UI', Helvetica",
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: { xs: "24px", md: "30px" },
                  }}
                >
                  {T('Аудиокниги')}
                </Typography>

                <BooksViewParams selectedFilter={sort} setSelectedFilter={setSort} viewMode={viewMode} setViewMode={setViewMode} isMobile={isMobile} />
              </Box>

              <BooksSection selectedGenres={selectedGenres} sort={sort} viewMode={effectiveViewMode} />
            </Box>

            {/* Genre selector - move to bottom on mobile */}
            <Box sx={{
              width: { xs: "100%", md: "auto" },
              mt: { xs: 3, md: 0 },
              order: { xs: 2, md: 1 }
            }}>
              <GenresSelector selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
            </Box>

          </Box>
        </Box>
      </Box>
      <FooterSection/>
    </ThemeProvider>
  );
};

export default Books;
