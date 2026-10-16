import { Box } from "@mui/material";
import React, { useEffect } from "react";
import NewsSection from "./news/NewsSection";
import FeaturedSection from "./homepage/FeaturedSection";
import BooksSection from "./homepage/BooksSection";
import GenresSection from "./homepage/GenresSection";
import HighlightsSection from "./homepage/HighlightsSection";
import FooterSection from "./parts/FooterSection";
import TestimonialsSection from "./homepage/TestimonialsSection";
import Navigation from "./parts/Navigation";
import useLibrary from "./LibraryContext";
import { useLocation } from "react-router-dom";

const Homepage = () => {
  const { user } = useLibrary();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#about") {
      // Delay to ensure section is in DOM and laid out
      requestAnimationFrame(() => {
        const el = document.getElementById("about");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }, [location]);

  return (
    <>
      <Navigation mainContent="booksButton" />    
        <Box
          sx={{
            bgcolor: "background.default",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.default",
              width: "100%",
              maxWidth: "1440px",
            }}
          >
            <FeaturedSection />
            <BooksSection />
            <GenresSection />
            {<HighlightsSection />}
            <NewsSection per_page={4} />
            {!user && <TestimonialsSection />}
          </Box>
        </Box>
      <FooterSection />
    </>
  );
};

export default Homepage;
