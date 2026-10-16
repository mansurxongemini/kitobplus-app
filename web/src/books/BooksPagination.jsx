import React from 'react'
import { Box, IconButton, Pagination, PaginationItem, } from "@mui/material";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import T from "../lib/translator";
import { getPaginationItemAriaLabel } from "../lib/a11y";

const BooksPagination = ({page, setPage, pagesCount}) => {
    const handlePageChange = (event, page) => {
        setPage(page); // Обновляем состояние при изменении
        console.log('Текущая страница:', page);
    };

    const itemAriaLabel = getPaginationItemAriaLabel(T);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <Pagination
                count={pagesCount}
                page={page}
                onChange={handlePageChange}
                getItemAriaLabel={itemAriaLabel}
                renderItem={(item) => {
                    if (item.type === "previous") {
                    return (
                        <PaginationItem
                            component={IconButton}
                            {...item}
                            aria-label={itemAriaLabel(item.type, item.page, item.selected)}
                            icon={<NavigateBefore aria-hidden="true" />}
                        />
                    );
                    }
                    if (item.type === "next") {
                    return (
                        <PaginationItem
                            component={IconButton}
                            {...item}
                            aria-label={itemAriaLabel(item.type, item.page, item.selected)}
                            icon={<NavigateNext aria-hidden="true" />}
                        />
                    );
                    }
                    return (
                        <PaginationItem
                            {...item}
                            sx={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "6px",
                                ...(item.page === 12345 && {
                                    border: "1px solid #00AEC7",
                                    bgcolor: 'white',
                                    color: "#00AEC7",
                                }),
                                ...(item.page === 12342 && {
                                    bgcolor: "#e6f6f8",
                                    color: "#262626",
                                }),
                                fontFamily: "'Open Sans', Helvetica",
                                fontWeight: 600,
                                '&.Mui-selected': {
                                    border: "1px solid #00AEC7",
                                    backgroundColor: "transparent",
                                    color: "black",
                                }                            
                            }}
                        />
                    );
                }}
            />
        </Box>
    )
}

export default BooksPagination