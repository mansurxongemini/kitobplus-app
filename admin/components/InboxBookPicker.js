import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
//import CircularProgress from '@material-ui/core/CircularProgress';
import {getSettings} from "./settings";

async function getInbox(filter, id) {
    let url = getSettings().backend + '/inbox_books.php?filter=' + filter + '&id=' + id
    let response = await fetch(url)//, {method: 'GET', credentials: 'include'})
    let books = await response.json()
    return books
}

const InboxBookPicker = React.forwardRef((props, ref) => {
//    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
//    const loading = open && options.length === 0;
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [selectBookId, setSelectBookId] = React.useState('');

    React.useImperativeHandle(ref, () => ({
        selectBook(id) {
            if (id) {
                setSelectBookId(id)
            } else {
                setValue(null)
            }
        },
        selectedBook() {return value}
    }));

    React.useEffect(() => {
        let active = true;
        (async () => {
            const inbox = await getInbox('', selectBookId)
            if (active) {
                setValue(inbox.length ? inbox[0] : null)
            }
        })();
        return () => {active = false};
    }, [selectBookId]);

    React.useEffect(() => {
        let active = true;

//        if (!loading) {
//            return undefined;
//        }

        (async () => {
            const inbox = await getInbox(inputValue, '')

            if (active) {
                //setOptions(inbox.map(book => book['name']));
                setOptions(inbox);
            }
        })();

        return () => {
            active = false;
        };
    }, [inputValue]);
/*
    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);
*/

    return (
        <Autocomplete
            id="asynchronous-demo"
            fullWidth={true}
            /*
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            */
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
                props.onPick(newValue ? newValue.id : '')
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
//            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option ? option.name : ''}
            options={options}
            /*loading={loading}*/
            filterOptions={(options, state) => options}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Выбор книги"
                    variant="outlined"
/*
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
 */
                />
            )}
        />
    );
})

export default InboxBookPicker