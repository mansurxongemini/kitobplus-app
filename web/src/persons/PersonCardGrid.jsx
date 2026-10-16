import Star from "@mui/icons-material/Star";
import StarOutlined from "@mui/icons-material/StarOutlined";
import { Grid, Card, Box, Typography, Avatar, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import T from "../lib/translator";
import { getHost } from "../lib/api";

const PersonCardGrid = ({ person, table }) => {
  const navigate = useNavigate();

  const avatarUrl = person.pics_ext
    ? `${getHost()}/pics/${table}/${person.id}.${person.pics_ext}`
    : `${getHost()}/pics/${table === 'authors' ? 'author' : 'dictor'}.png`;

  // Function to render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = 4; // Default rating

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Box
            key={i}
            aria-hidden="true"
            sx={{
              width: 24,
              height: 24,
              bgcolor: "rating.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star aria-hidden="true" sx={{ width: 16, height: 16 }} />
          </Box>
        );
      } else {
        stars.push(
          <Box
            key={i}
            aria-hidden="true"
            sx={{
              width: 24,
              height: 24,
              bgcolor: "rating.inactive",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StarOutlined aria-hidden="true" sx={{ width: 16, height: 16 }} />
          </Box>
        );
      }
    }

    return stars;
  };

  return (
    <Grid item xs={12} md={4} key={person.id}>
      <Card
        tabIndex={0}
        sx={{
          height: 280,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          boxShadow: "0px 4px 24px rgba(38, 38, 38, 0.07)",
          border: "1px solid",
          borderColor: "neutral.100",
          cursor: "pointer",
          p: 2,
        }}
        role="link"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`/person/${table}/${person.id}`);
          }
        }}
        onClick={() => navigate(`/person/${table}/${person.id}`)}
      >
        <Avatar
          src={avatarUrl}
          alt=""
          sx={{ width: 100, height: 100, mb: 2 }}
        />

        <Typography
          color="secondary.main"
          sx={{
            fontFamily: "'PT_Root_UI-Bold',Helvetica",
            fontSize: 18,
            mb: 1,
            textAlign: "center",
            width: "100%",
          }}
        >
          {person.name}
        </Typography>

        <Typography
          sx={{
            fontFamily: "'PT_Root_UI-Medium',Helvetica",
            fontSize: 14,
            color: "#9da0a2",
            mb: 1,
            textAlign: "center",
          }}
        >
          {T("Аудиокниг")}: {person.books_count}
        </Typography>

        <Typography
          sx={{
            fontFamily: "'PT_Root_UI-Medium',Helvetica",
            fontSize: 14,
            color: "#9da0a2",
            mb: 2,
            textAlign: "center",
          }}
        >
          {T("Отзывов")}: {person.comments_count}
        </Typography>

        <Box
          role="img"
          aria-label={T('Рейтинг') + ': 4.5 / 5'}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Stack direction="row" spacing={0.5} aria-hidden="true">
            {renderRating(4.5)}
          </Stack>
          <Typography
            aria-hidden="true"
            sx={{
              ml: 1.5,
              fontFamily: "'PT_Root_UI-Bold',Helvetica",
              fontWeight: "bold",
              fontSize: 16,
              color: "secondary.main",
            }}
          >
            4.5
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
};

export default PersonCardGrid;
