import React from 'react'
import { Stack } from '@mui/material'
import BookCardFull from './BookCardFull'

const BooksList = ({books}) => {
    React.useEffect(() => {
        console.log("Books changed");
        console.log(books)
    }, [books]);
    return (
        <Stack spacing={1}>
            {books?.map((book) => <BookCardFull book={book}/>)}
        </Stack>
    )
}

export default BooksList