import React from 'react';
import BooksList from "./BooksList";
import BooksGrid from "./BooksGrid";
import { Box } from '@mui/material';
import TagsSelector from "./TagsSelector"
import BooksPagination from "./BooksPagination";
import Filter from '../parts/Filter';
import { getHost } from "../lib/api";
import useSWR from "swr";

const BooksSection = ({selectedGenres, sort = "new", viewMode = "list", table, persons_id}) => {
    // Мемоизируем selectedGenres, чтобы избежать создания нового Set при каждом рендере
    const memoizedSelectedGenres = React.useMemo(() => {
        return selectedGenres || new Set();
    }, [selectedGenres]);

    React.useEffect(() => {
        console.log('BooksSection: sort changed to', sort);
    }, [sort]);
    const [filter, setFilter] = React.useState("")  
    const [pagesCount, setPagesCount] = React.useState(26);
    const [page, setPage] = React.useState(1);
    const [selectedTags, setSelectedTags] = React.useState(["#читать", "#философия"]);    
    const [books, setBooks] = React.useState([]);
    const [filters, setFilters] = React.useState([]);
    const fetcher = (...args) => fetch(...args).then(res => res.json()).then(_ => {setPagesCount(Math.ceil(_.total / (viewMode === 'list' ? 6 : 12))); return _.data;});
    const { data, error, isLoading } = useSWR(getHost() + '/srv/books.php?' + (table == 'authors' && persons_id ? 'authors_id=' + persons_id + '&' : '') + (table == 'dictors' && persons_id ? 'dictors_id=' + persons_id + '&' : '') + (table == 'genres' && persons_id ? 'genres_id=' + persons_id + '&' : '') + 'sort=' + sort + '&page=' + (page - 1) + '&per_page=' + (viewMode === 'list' ? 6 : 12) + (filters.length > 0 ? '&' + filters.join('&') : ''), fetcher)

    React.useEffect(() => {
        var f = [];
        if (memoizedSelectedGenres.size > 0) {
            f.push('genres_id[]=' + [...memoizedSelectedGenres].join(',genres_id[]='))
        }

        if (filter.trim() != '') {
            f.push('filter=' + encodeURIComponent(filter.trim()));
        }

        console.log(f);
        console.log(filters);
        
        setPage(1);
        setFilters(f);
    }, [filter, memoizedSelectedGenres]);

    React.useEffect(() => {
        setPage(1);
    }, [viewMode]);

    React.useEffect(() => {
        setBooks(data)
    }, [data]);

    return <>
        <Filter filter={filter} setFilter={setFilter} />
        {false && <TagsSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} />}

        <Box sx={{}}>
        {viewMode === "list" ? (
            <BooksList books={books} />
        ) : (
            <BooksGrid books={books} />
        )}
        </Box>

        <BooksPagination pagesCount={pagesCount} page={page} setPage={setPage} />
    </>
}

export default BooksSection;
