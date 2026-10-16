import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from '@material-ui/core/Checkbox';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import KBPlayPause from '../player/buttons/kb-playpause';
import {getSettings} from "../settings";
import { matchSorter } from 'match-sorter';
import { Media, Player, controls } from 'react-media-player'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons'
const { PlayPause, MuteUnmute } = controls;


const filterOptions = (options, inputValue) => {    
    return matchSorter(options, inputValue);
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export default function DeleteDialog (props) {
    const [rowData, setRowData] = React.useState(props.rowData);

    React.useEffect(() => {
        console.log(props.rowData)
        setRowData(props.rowData)        
    }, [props.rowData])

    const handleDelete = () => {
        fetch(getSettings().backend + '/delete_book.php?token=' + localStorage.getItem('token'), {
            method: 'POST',
            body: JSON.stringify({id: rowData?.id})
        }).then(response=>response.json())
        .then(response=>{
            console.log(response)
            props.closeDeleteDialog()   
            props.reload(rowData.id)
        });
    };

    return (
        <div>
            <Dialog open={props.isOpen} onClose={props.closeDeleteDialog} aria-labelledby="form-dialog-title">
                <Box width={500}>                
                <DialogTitle id="form-dialog-title">Удаление книги</DialogTitle>
                <DialogContent>
                    <span tabIndex={0}>Вы действительно хотите удалить книгу <strong>{rowData?.name}</strong></span>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} color="secondary">Да</Button>
                    <Button onClick={props.closeDeleteDialog}>Отмена</Button>
                </DialogActions>
                </Box>                
            </Dialog>
        </div>
    );
}