import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import {
  Box,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React from "react";

import PersonBanner from "./PersonBanner";
import BreadcrumbsSection from "./BreadcrumbsSection";
import FooterSection from "../parts/FooterSection";
import { useParams } from "react-router-dom";
import { get } from '../lib/person';
import T from "../lib/translator";
import BooksSection from "../books/BooksSeciton";
// Import image
import Navigation from "../parts/Navigation";
import { getHost } from "../lib/api";

const Person = () => {
  const [viewMode, setViewMode] = React.useState("list");
  const [tabValue, setTabValue] = React.useState("audiobooks");
  const [page, setPage] = React.useState(1);
  const params = useParams();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const audiobooksLabel = T("Аудиокниг");
  const reviewsLabel = T("Отзывов");

  React.useEffect(() => {
    if (params.table && params.id) {
      setLoading(true);
      get(params.table, params.id).then(data => {
          // Transform API data to match component structure
          data.created_at = '2024-05-16T0:00:00';
          const transformedData = {
            name: data.name || data.title || "Неизвестно",
            joinDate: data.added,
            avatarUrl: data.pics_ext ? getHost() + "/pics/" + params.table + "/" + data.id + "." + data.pics_ext : null,
            backgroundUrl: data.background || "./frame.svg",
            stats: [
              { label: audiobooksLabel, value: data.books_count || "0" },
              { label: reviewsLabel, value: data.comments_count || "0" },
            ],
          };
          setUserData(transformedData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching person data:', err);
          setError(err);
          setLoading(false);
          // Fallback to default data
          setUserData({
            name: "Жоанна Кэтлин Роулинг",
            joinDate: "в платформе с 23.07.2021",
            avatarUrl: "./ellipse-15.png",
            backgroundUrl: "./frame.svg",
            stats: [
              { label: audiobooksLabel, value: "24" },
              { label: reviewsLabel, value: "340" },
            ],
          });
        });
    } else {
      // Default data when no table/id provided
      setUserData({
        name: "Жоанна Кэтлин Роулинг",
        joinDate: "в платформе с 23.07.2021",
        avatarUrl: "./ellipse-15.png",
        backgroundUrl: "./frame.svg",
        stats: [
          { label: audiobooksLabel, value: "24" },
          { label: reviewsLabel, value: "340" },
        ],
      });
      setLoading(false);
    }
  }, [params]);

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleTabChange = (event, newTabValue) => {
    if (newTabValue !== null) {
      setTabValue(newTabValue);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          bgcolor: "background.paper",
          width: "1440px",
          position: "relative",
          p: 0,
        }}
      > 
        <Navigation />
        <BreadcrumbsSection table={params.table} userData={userData} />

        <Box sx={{ mt: 4, mx: 15.5}}>
          <Box>
            <PersonBanner userData={userData} loading={loading} error={error} setError={setError} />
          </Box>
          {false && <Box style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <ToggleButtonGroup
              value={tabValue}
              exclusive
              onChange={handleTabChange}
              sx={{ mb: 2 }}
            >
              <ToggleButton
                value="audiobooks"
                sx={{
                  width: "150px",
                  bgcolor: tabValue === "audiobooks" ? "primary.main" : "#eeeeee",
                  color: tabValue === "audiobooks" ? "white" : "#adacae",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              >
                {T('Аудиокниги')}
              </ToggleButton>
              <ToggleButton
                value="reviews"
                sx={{
                  width: "150px",
                  bgcolor: "#eeeeee",
                  color: "#adacae",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              >
                {T('Отзывы')}
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
            >
              <ToggleButton value="list" sx={{ border: "1px solid #e0e0e0" }}>
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton value="grid" sx={{ border: "1px solid #e0e0e0" }}>
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>}
          <BooksSection table={params.table} persons_id={params.id} />

        </Box>
        <FooterSection />
      </Container>
    </Box>
  );
};

export default Person;
