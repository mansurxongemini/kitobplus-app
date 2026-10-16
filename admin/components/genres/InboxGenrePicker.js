import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {getSettings} from "../settings";

async function getInboxGenres(filter, id) {
    let url = getSettings().backend + '/inbox_genres.php?filter=' + filter + '&id=' + id
    let response = await fetch(url)
    let books = await response.json()
    return books
}

const InboxGenrePicker = React.forwardRef((props, ref) => {
    const [options, setOptions] = React.useState([]);
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');

    const [selectGenreId, setSelectGenreId] = React.useState('');

    React.useImperativeHandle(ref, () => ({
        selectGenre(id) {
            if (id) {
                setSelectGenreId(id)
            } else {
                setValue(null)
            }
        },
        selectedGenre() {return value}
    }));

    React.useEffect(() => {
        let active = true;
        (async () => {
            const genres = await getInboxGenres('', selectGenreId)
            if (active) {
                setValue(genres.length ? genres[0] : null)
            }
        })();
        return () => {active = false};
    }, [selectGenreId]);

    React.useEffect(() => {
        let active = true;

        (async () => {
            const genres = await getInboxGenres(inputValue, '')

            if (active) {
                setOptions(genres);
            }
        })();

        return () => {
            active = false;
        };
    }, [inputValue]);

    return (
        <Autocomplete
            id="genre-picker"
            fullWidth={true}
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
                props.onPick(newValue ? newValue.id : '')
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            getOptionLabel={(option) => option ? option.name : ''}
            options={options}
            filterOptions={(options, state) => options}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Выбор жанра в библиотеке"
                    variant="outlined"
                />
            )}
        />
    );
})

export default InboxGenrePicker