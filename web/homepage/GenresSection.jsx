import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import frame2 from "@mui/icons-material/Star";
// Import images
import world from "./img/genres/world.png";
import thrillers from "./img/genres/thrillers.png";
import scifi from "./img/genres/scifi.png";
import psychology from "./img/genres/psychology.png";
import children from "./img/genres/children.png";
import genres_icon from "./img/genres.png";
import { getHost } from "../lib/api";
import T from "../lib/translator";

const GenresSection = () => { 
  const [genres, setGenres_] = React.useState(undefined);
  React.useEffect(() => {
    if (genres !== undefined) return;

    fetch(getHost() + "/srv/genres.php?sort=popular").then(result => result.json()).then(json => {
      setGenres_(json.data.slice(0, 12));
    });
  }, [genres]);

  return (
    <Box sx={{ width: "100%", py: 8 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={5}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={genres_icon}
                alt="Category"
                sx={{ width: 27, height: 27 }}
              />
            </Box>
            <Typography
              variant="h3"
              color="secondary.main"
              fontFamily="'PT_Root_UI-Bold',Helvetica"
              fontWeight="bold"
            >
              {T('Жанры')}
            </Typography>
          </Stack>

          <Link to="/genres" style={{color: "inherit", textDecoration: 'none'}}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ cursor: "pointer" }}
            >
              <Typography
                color="secondary.main"
                fontFamily="'PT_Root_UI-Bold',Helvetica"
                fontWeight="bold"
              >
                {T('Все жанры')}
              </Typography>
              <ArrowForwardIcon sx={{ width: 24, height: 24 }} />
            </Stack>
          </Link>
        </Stack>

        {/* Grid of genre cards */}
        <Grid container spacing={2}>
          {genres && genres.map((genre, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Link 
                to={`/person/genres/${genre.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
                tabIndex={0}
                aria-label={genre.name}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.click();
                  }
                }}
              >
                <Card
                  sx={{
                    height: 148,
                    bgcolor: "background.paper",
                    borderRadius: 0,
                    boxShadow: "0px 4px 24px rgba(38, 38, 38, 0.07)",
                    border: "1px solid",
                    borderColor: "neutral.100",
                    position: "relative",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0px 4px 24px rgba(38, 38, 38, 0.12)",
                    },
                    "&:focus-within": {
                      boxShadow: "0px 4px 24px rgba(38, 38, 38, 0.12)",
                      outline: "2px solid",
                      outlineColor: "primary.main",
                    },
                  }}
                >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 2,
                      mb: 2,
                    }}
                  >
                      <Box
                        component="img"
                        src={getHost() + '/pics/genres.flat/' + genre.id + '.png'}
                        alt={genre.name}
                        sx={{ maxWidth: 64, maxHeight: 64 }}
                      />
                  </Box>
                  <Typography
                    variant="body1"
                    color={
                      genre.highlighted ? "lightwhite.main" : "secondary.main"
                    }
                    textAlign="center"
                    sx={{ width: 150 }}
                  >
                    {genre.name}
                  </Typography>

                  {genre.highlighted && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 9,
                        right: 3,
                        width: 33,
                        height: 33,
                      }}
                    >
                      {/*<Box
                        component="img"
                        src={group11}
                        alt="Arrow"
                        sx={{
                          position: "absolute",
                          width: 20,
                          height: 22,
                          top: 9,
                          left: 7,
                        }}
                      />*/}
                    </Box>
                  )}
                </CardContent>
              </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default GenresSection;
