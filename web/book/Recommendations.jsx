import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import BookCardShort from '../books/BookCardShort.jsx';
import { getHost } from '../lib/api.js';
import T from '../lib/translator.js';

const Recommendations = ({ book }) => {
  const theme = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!book) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(getHost() + `/srv/books.php?recommendations=${book}`);
        const data = await response.json();
        
        if (data && data.success && Array.isArray(data.data)) {
          // Берем только первые 3 книги
          setRecommendations(data.data.slice(0, 3));
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [book]);

  if (loading) {
    return (
      <Box sx={{ mt: 4, ml: 3, mr: 3 }}>
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.secondary.main,
            fontWeight: 700,
            fontSize: "30px",
            mb: 3,
          }}
        >
          {T('Рекомендации')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "18px",
          }}
        >
          {T('Загрузка...')}
        </Typography>
      </Box>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4, ml: 3, mr: 3 }}>
      <Typography
        variant="h5"
        sx={{
          color: theme.palette.secondary.main,
          fontWeight: 700,
          fontSize: "30px",
          mb: 3,
        }}
      >
        {T('Рекомендации')}
      </Typography>
      
      <Grid container spacing={3}>
        {recommendations.map((recommendedBook) => (
          <BookCardShort 
            key={recommendedBook.id} 
            book={recommendedBook} 
          />
        ))}
      </Grid>
    </Box>
  );
};

export default Recommendations;
