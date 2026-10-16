import React, { useState, useEffect } from "react";
import { Box, Grid, Stack, CircularProgress, Typography } from "@mui/material";
import PersonCard from "./PersonCard";
import PersonCardGrid from "./PersonCardGrid";
import { getPersons } from "../lib/persons.ts";
import T, { tr } from "../lib/translator";
import Filter from "../parts/Filter.jsx";

const PersonsSection = ({ table, sort, viewMode}) => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchPersons = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPersons(table, sort, filter);
        if (response.success) {
          setPersons(response.data);
        } else {
          setError(tr("Не удалось загрузить данные"));
        }
      } catch (err) {
        console.error("Error fetching persons:", err);
        setError(tr("Ошибка загрузки данных"));
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, [table, sort, filter]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (persons.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography align="center" color="text.secondary">
          {T("Ничего не найдено")}
        </Typography>
      </Box>
    );
  }

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPersons = persons.slice(startIndex, endIndex);
  const totalPages = Math.ceil(persons.length / itemsPerPage);

  return (
    <Box>
      <Filter filter={filter} setFilter={setFilter} />
      {viewMode === "list" ? (
        <Stack spacing={2}>
          {displayedPersons.map((person) => (
            <PersonCard key={person.id} person={person} table={table} />
          ))}
        </Stack>
      ) : (
        <Grid container spacing={2}>
          {displayedPersons.map((person) => (
            <PersonCardGrid key={person.id} person={person} table={table} />
          ))}
        </Grid>
      )}

      {/* Pagination будет добавлена в основном компоненте */}
    </Box>
  );
};

export default PersonsSection;
