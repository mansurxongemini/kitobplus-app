import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getHost } from '../lib/api';
import T from '../lib/translator';

const GenresView = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await fetch(getHost() + "/srv/genres.php?sort=popular");
        const data = await response.json();
        
        if (data && data.data) {
          setGenres(data.data);
        } else {
          setError('Не удалось загрузить жанры');
        }
      } catch (err) {
        setError('Ошибка при загрузке жанров: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch {
      return dateString;
    }
  };

  const formatNumber = (num) => {
    return parseInt(num).toLocaleString('ru-RU');
  };

  const navigateToGenre = (genreId) => {
    navigate(`/person/genres/${genreId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          color="secondary.main"
          fontFamily="'PT_Root_UI-Bold',Helvetica"
          fontWeight="bold"
          mb={4}
          textAlign="center"
        >
          {T('Все жанры библиотеки')}
        </Typography>

        <Grid container spacing={3}>
          {genres.map((genre) => {
            const ariaLabel = `${genre.name}, ${T('Книг')}: ${formatNumber(genre.books_count)}, ${T('Загрузок')}: ${formatNumber(genre.downloads_count)}. ${T('Обновлено')}: ${formatDate(genre.updated)}`;
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={genre.id}>
                <Card
                  tabIndex={0}
                  role="button"
                  aria-label={ariaLabel}
                  sx={{
                    height: 280,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: "0px 4px 24px rgba(38, 38, 38, 0.07)",
                    border: "1px solid",
                    borderColor: "neutral.100",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0px 8px 32px rgba(38, 38, 38, 0.15)",
                      transform: "translateY(-2px)",
                    },
                    "&:focus": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: "2px",
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: "2px",
                    }
                  }}
                  onClick={() => navigateToGenre(genre.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      navigateToGenre(genre.id);
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 2,
                      height: "100%",
                    }}
                  >
                    {/* Иконка жанра */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: "rgba(2, 163, 184, 0.05)",
                      }}
                    >
                      <Box
                        component="img"
                        src={getHost() + '/pics/genres.flat/' + genre.id + '.png'}
                        alt=""
                        sx={{ 
                          maxWidth: 64, 
                          maxHeight: 64,
                          objectFit: "contain"
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </Box>

                    {/* Название жанра */}
                    <Typography
                      variant="h6"
                      color="secondary.main"
                      textAlign="center"
                      sx={{ 
                        mb: 1,
                        fontFamily: "'PT_Root_UI-Bold',Helvetica",
                        fontWeight: "bold",
                        fontSize: "18px",
                        lineHeight: "24px",
                        minHeight: "48px",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {genre.name}
                    </Typography>

                    {/* Статистика */}
                    <Box sx={{ width: "100%", mt: "auto" }}>
                      <Box sx={{ mb: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily: "'PT_Root_UI-Medium',Helvetica",
                            fontSize: "14px",
                          }}
                        >
                          {T('Книг')}: <strong>{formatNumber(genre.books_count)}</strong>
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily: "'PT_Root_UI-Medium',Helvetica",
                            fontSize: "14px",
                          }}
                        >
                          {T('Загрузок')}: <strong>{formatNumber(genre.downloads_count)}</strong>
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily: "'PT_Root_UI-Medium',Helvetica",
                            fontSize: "12px",
                          }}
                        >
                          {T('Обновлено')}: {formatDate(genre.updated)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default GenresView;
