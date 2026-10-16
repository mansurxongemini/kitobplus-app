import React from 'react'
import { Grid } from '@mui/material'
import BookCardShort from './BookCardShort'

const BooksGrid = ({books}) => {
    return (
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
            {books?.map((book) => (
                <BookCardShort key={book.id} book={book} columns={2} />
            ))}
        </Grid>
    )
}

export default BooksGrid