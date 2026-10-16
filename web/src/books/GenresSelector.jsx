import React from 'react'
import { getHost } from "../lib/api"
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Divider } from '@mui/material';
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import T from '../lib/translator';

const GenresSelector = ({selectedGenres, setSelectedGenres}) => {
  /* Genre data
  const [businessExpanded, setBusinessExpanded] = useState(true);
  const [classicsExpanded, setClassicsExpanded] = useState(false);

  const genres = [
    {
      id: 1,
      name: "Бизнес-книги",
      count: "20 123",
      icon: <BusinessIcon />,
      expanded: businessExpanded,
      setExpanded: setBusinessExpanded,
      active: false,
      subCategories: [],
    },
  ];
  */
  const [genres, setGenres_] = React.useState(undefined);
  React.useEffect(() => {
    if (genres !== undefined) return;

    fetch(getHost() + "/srv/genres.php").then(result => result.json()).then(json => {
      setGenres_(json.data);
    });
  }, [genres]);
  
  const handleGenreClick = (genreId) => {
    // Handle genre selection
    console.log("Genre clicked:", genreId);

    setSelectedGenres((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(genreId)) {
        newSet.delete(genreId);
      } else {
        newSet.add(genreId);
      }
      return newSet;
    });
  };

  const handleSubCategoryClick = (genreId, subCategoryName) => {
    // Handle subcategory selection
    console.log("Subcategory clicked:", genreId, subCategoryName);
  };

    return (
        <Box sx={{ width: "377px", ml: "30px", bgcolor: "background.paper" }}>
            <Typography
                variant="h2"
                sx={{
                fontFamily: "'PT Root UI', Helvetica",
                fontWeight: 700,
                color: "secondary.main",
                mb: 3,
                bgcolor: "background.paper"
                }}
            >
                {T('Жанры')}
            </Typography>

            <List sx={{ width: "100%", p: 0 }}>
                {genres && genres.map((genre) => (
                <React.Fragment key={'g' + genre.id}>
                    <ListItemButton
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                            handleGenreClick(genre.id);
                            if (genre.setExpanded) {
                            genre.setExpanded(!genre.expanded);
                            }
                        }}
                        sx={{
                            bgcolor: selectedGenres.has(genre.id)
                                ? "#ecf1f5"
                                : "background.paper",
                            height: "46px",
                            px: 0,
                        }}
                    >
                        <Box
                            sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            px: 1.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: "34px",
                                    height: "34px",
                                    bgcolor: selectedGenres.has(genre.id) ? "background.paper" : "#ecf1f5",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mr: 1,
                                }}
                            >
                                <img
                                    alt=""
                                    aria-hidden="true"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        /*filter: 'grayscale(100%) contrast(20) opacity(0.5) '*/
                                    }}
                                    src={getHost() + '/pics/genres.flat/' + genre?.id + '.png'} />
                            </ListItemIcon>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: "'PT_Root_UI-Bold', Helvetica",
                                    fontWeight: 500,
                                    fontSize: "16px",
                                    color: "#9cb0bf",
                                    ml: 1,
                                    width: '100%'
                                }}
                            >{genre.name}</Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: "'PT_Root_UI-Bold', Helvetica",
                                    fontWeight: 500,
                                    fontSize: "16px",
                                    color: "#9cb0bf",
                                    ml: 1,
                                }}
                            >
                            {genre.books_count}
                            </Typography>
                            {genre.subCategories &&
                            genre.subCategories.length > 0 && (
                                <Box sx={{ ml: 1 }}>
                                {genre.expanded ? (
                                    <KeyboardArrowDown />
                                ) : (
                                    <KeyboardArrowRight />
                                )}
                                </Box>
                            )}
                        </Box>
                    </ListItemButton>

                    {genre.subCategories && genre.subCategories.length > 0 && (
                    <Collapse in={genre.expanded} timeout="auto" unmountOnExit>
                        <Divider sx={{ mx: 1.5 }} />
                        <List component="div" disablePadding>
                        {genre.subCategories.map((subCategory, index) => (
                            <ListItem
                            key={index}
                            button
                            onClick={() =>
                                handleSubCategoryClick(genre.id, subCategory.name)
                            }
                            sx={{
                                bgcolor:
                                index % 2 === 1 ? "#f6faff" : "transparent",
                                height: "38px",
                                pl: 4,
                            }}
                            >
                            <Box
                                sx={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "2px",
                                bgcolor: subCategory.active
                                    ? "#00AEC7"
                                    : "rgba(38, 38, 38, 0.7)",
                                mr: 1,
                                }}
                            />
                            <ListItemText
                                primary={subCategory.name}
                                primaryTypographyProps={{
                                fontFamily: "'PT Root UI', Helvetica",
                                fontWeight: 500,
                                fontSize: "16px",
                                color: subCategory.active
                                    ? "#00AEC7"
                                    : "rgba(38, 38, 38, 0.7)",
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                fontFamily: "'PT Root UI', Helvetica",
                                fontWeight: 500,
                                fontSize: "16px",
                                color: "#9cb0bf",
                                ml: 1,
                                }}
                            >
                                {subCategory.count}
                            </Typography>
                            </ListItem>
                        ))}
                        </List>
                    </Collapse>
                    )}
                </React.Fragment>
                ))}
            </List>
        </Box>
    )
}

export default GenresSelector