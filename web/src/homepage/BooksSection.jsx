import ArrowForward from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React from "react";
import useSWR from 'swr'
import { getHost } from '../lib/api';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import T from "../lib/translator";
import BookCardShort from "../books/BookCardShort";

// Note: Since we can't use local imports, I'm assuming these images would be served from a CDN
// In a real implementation, you would replace these with proper image URLs
const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/118x175";

const BooksSection = () => {
  const navigate = useNavigate()

  const [tabValue, setTabValue] = React.useState(0);

  const fetcher = (...args) => fetch(...args).then(res => res.json()).then(_ => _.data);
  const { data, error, isLoading } = useSWR(getHost() + '/srv/books.php?sort=' + (tabValue ? 'new' : 'popular') + '&page=0&per_page=3', fetcher)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  React.useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Box sx={{ width: "100%", position: "relative", py: { xs: 3, md: 5 } }}>
      <Box sx={{ maxWidth: 1191, mx: "auto", px: { xs: 2, sm: 3, md: 2 } }}>
        {/* Tabs Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            mb: { xs: 3, md: 5 },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{
            width: { xs: "100%", sm: 476 },
            height: 50,
            bgcolor: "#eeeeee"
          }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{ height: "100%" }}
              variant={{ xs: "fullWidth", sm: "standard" }}
            >
              <Tab
                label={T('Последние')}
                sx={{
                  width: { xs: "50%", sm: 238 },
                  height: 50,
                  bgcolor: tabValue === 0 ? "primary.main" : "transparent",
                  color: tabValue === 0 ? "lightwhite.main" : "neutral.200",
                  fontWeight: "bold",
                  fontSize: { xs: 16, sm: 20 },
                  textTransform: "none",
                  "&.Mui-selected": {
                    color: "lightwhite.main",
                  },
                }}
              />
              <Tab
                label={T('Популярные')}
                sx={{
                  width: { xs: "50%", sm: 238 },
                  height: 50,
                  bgcolor: tabValue === 1 ? "primary.main" : "transparent",
                  color: tabValue === 1 ? "lightwhite.main" : "neutral.200",
                  fontWeight: "bold",
                  fontSize: { xs: 16, sm: 20 },
                  textTransform: "none",
                  "&.Mui-selected": {
                    color: "lightwhite.main",
                  },
                }}
              />
            </Tabs>
          </Box>

          <Link to="/books" style={{color: "inherit", textDecoration: 'none'}}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              href="#"
            >
              <Typography
                color="secondary.main"
                sx={{
                  fontFamily: "'PT_Root_UI-Bold',Helvetica",
                  fontWeight: "bold",
                  fontSize: { xs: 16, sm: 18 },
                }}
              >
                {T('Все книги')}
              </Typography>
              <ArrowForwardIcon color="secondary" />
            </Stack>
          </Link>
        </Box>

        {/* Book Cards */}
        <Grid container spacing={{ xs: 2, sm: 2, md: 2 }}>
          {data && data.map((book) => <BookCardShort key={book.id} book={book} columns={3}/>)}
        </Grid>
      </Box>
    </Box>
  );
};

export default BooksSection;
