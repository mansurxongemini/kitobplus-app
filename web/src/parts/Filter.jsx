import React from 'react'
import { Autocomplete, TextField, useTheme } from "@mui/material"
import Search from "@mui/icons-material/Search";
import { useDebounce } from 'use-debounce';
import useLibrary from '../LibraryContext';
import T from '../lib/translator';

const Filter = ({filter, setFilter}) => {
    const theme = useTheme();
    const [rawFilter, setRawFilter] = React.useState('');
    const [ searchRequest ] = useDebounce(rawFilter, 1000);
    const {darkMode} = useLibrary();

    React.useEffect(() => {
        console.log(searchRequest)
        setFilter(searchRequest)
    }, [setFilter, searchRequest])

    return (
        <Autocomplete
            freeSolo
            options={[]}
            defaultValue={filter}
            value={rawFilter}
            onChange={(event, newValue) => setRawFilter(newValue ?? '')}
            inputValue={rawFilter}
            onInputChange={(event, newInputValue, reason) => setRawFilter(newInputValue ?? '')}
            clearText={T("Очистить")}
            closeText={T("Закрыть")}
            openText={T("Открыть")}
            renderInput={(params) => (
            <TextField
                {...params}
                placeholder={T("Поиск")}
                variant="outlined"
                inputProps={{
                    ...params.inputProps,
                    'aria-label': T("Поиск"),
                }}
                InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                        <Search aria-hidden="true" sx={{ color: theme.palette.icon.main, mr: 1 }} />
                    ),
                }}
                sx={{
                    minWidth: "785px",
                    width: "100%",
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                        height: "40px",
                        bgcolor: darkMode ? "#202020" : theme.palette.background.paper,
                        borderRadius: "6px",
                        "& fieldset": {
                            borderColor: theme.palette.lightfirst.main,
                        },
                    },
                    "& .MuiInputBase-input::placeholder": {
                        color: theme.palette.text.secondary,
                        fontFamily: theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: "14px",
                        opacity: 0.6,
                    },
                }}
            />
            )}
        />
    )
}

export default Filter