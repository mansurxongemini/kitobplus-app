import PlayArrow from "@mui/icons-material/PlayArrow";
import Star from "@mui/icons-material/Star";
import StarOutlined from "@mui/icons-material/StarOutlined";
import { Grid, Card, Box, Typography, Button, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"
import T from "../lib/translator";
import { getHost } from "../lib/api";

const BookCardShort = ({book, columns = 2}) => {
    const navigate = useNavigate();

    // Determine grid columns based on the columns prop
    // columns = 2 means md={6} (2 items per row)
    // columns = 3 means md={4} (3 items per row)
    const mdColumns = columns === 3 ? 4 : 6;

    // Function to render star ratings
    const renderRating = (rating) => {
        //const fullStars = Math.floor(rating);
        const stars = [];

        const fullStars = 2 + Math.floor(Math.random(0) * 4);
        for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(
            <Box
                key={i}
                sx={{
                width: 24,
                height: 24,
                bgcolor: "rating.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                }}
            >
                <Star sx={{ width: 16, height: 16 }} />
            </Box>,
            );
        } else {
            stars.push(
            <Box
                key={i}
                sx={{
                width: 24,
                height: 24,
                bgcolor: "rating.inactive",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                }}
            >
                <StarOutlined sx={{ width: 16, height: 16 }} />
            </Box>,
            );
        }
        }

        return stars;
    };

    return (
      <Grid item xs={12} sm={6} md={mdColumns} key={book.id} sx={{ display: 'flex' }}>
        <Card
                tabIndex={0}
                sx={{
                  width: "100%",
                  height: { xs: "auto", md: 207 },
                  minHeight: { xs: 180, sm: 207 },
                  display: "flex",
                  flexDirection: { xs: "row", md: "row" },
                  position: "relative",
                  boxShadow: book.active
                    ? "0px 4px 30px rgba(38, 38, 38, 0.1)"
                    : "0px 4px 24px rgba(38, 38, 38, 0.07)",
                  border: "1px solid",
                  borderColor: "neutral.100",
                }}
                role="link"
                onKeyDown={(e) => {if (e.key === 'Enter') {navigate("/books/" + book.id)}}}
              >
                <Box sx={{ p: 1, flexShrink: 0 }}>
                  <Box
                    aria-hidden={true}
                    component="img"
                    src={getHost() + '/pics/' + (book.pics_ext ? 'books/' + book.id + '.' + book.pics_ext : 'book.png')}
                    alt={book.title}
                    sx={{
                      width: { xs: 90, sm: 100, md: 118 },
                      height: { xs: 135, sm: 150, md: 175 },
                      objectFit: "cover"
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    pl: 1,
                    pr: { xs: 1, md: 2 },
                    pt: { xs: 1, md: 2 },
                    pb: { xs: 1, md: 2 },
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {/* Top section: Title and Author */}
                  <Box>
                    <Typography
                      color="secondary.main"
                      sx={{
                        fontFamily: "'PT_Root_UI-Bold',Helvetica",
                        fontSize: { xs: 16, sm: 18, md: 20 },
                        mb: { xs: 0.5, md: 1 },
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {book.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "'PT_Root_UI-Medium',Helvetica",
                        fontSize: { xs: 14, md: 16 },
                        color: "#9da0a2",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {book.authors_name}
                    </Typography>
                  </Box>

                  {/* Bottom section: Rating and Button */}
                  <Box>
                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: { xs: 1, md: 1.5 },
                      flexWrap: "wrap",
                    }}>
                      <Stack direction="row" spacing={0.5}>
                        {renderRating(book.rating)}
                      </Stack>
                      <Typography
                        sx={{
                          ml: 1.5,
                          fontFamily: "'PT_Root_UI-Bold',Helvetica",
                          fontWeight: "bold",
                          fontSize: { xs: 14, md: 16 },
                          color: "secondary.main",
                        }}
                      >
                        {book.rating}
                      </Typography>
                    </Box>
                    <Button
                    tabIndex={-1}
                    variant={book.active ? "contained" : "text"}
                    startIcon={<PlayArrow />}
                    sx={{
                      width: "100%",
                      maxWidth: { xs: "100%", md: 211 },
                      height: { xs: 40, md: 44 },
                      bgcolor: book.active ? "primary.main" : "action.hover",
                      color: book.active ? "lightwhite.main" : "primary.main",
                      "&:hover": {
                        bgcolor: book.active ? "primary.main" : "action.hover",
                      },
                      boxShadow: book.active
                        ? "0px 4px 20px rgba(2, 163, 184, 0.16)"
                        : "none",
                      fontFamily: "'PT_Root_UI-Bold',Helvetica",
                      fontWeight: "bold",
                      fontSize: { xs: 14, md: 16 },
                      textTransform: "none",
                      justifyContent: "center",
                    }}
                    onClick={() => navigate("/books/" + book.id)}
                  >
                    {T('Слушать')}
                  </Button>
                  </Box>
                </Box>
        </Card>
      </Grid>
    )
}

export default BookCardShort