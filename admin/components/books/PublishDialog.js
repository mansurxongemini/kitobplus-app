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

export default function PublishDialog (props) {
    const [rowData, setRowData] = React.useState(props.rowData);
    const [published, setPublished] = React.useState(props.rowData?.is_readable_from != null);
    const [date, setDate] = React.useState((props.rowData?.is_readable_from) ? new Date(props.rowData.is_readable_from.replace(/ /, 'T')) : new Date())

    React.useEffect(() => {
        console.log(props.rowData)
        setRowData(props.rowData)        
        setPublished(props.rowData?.is_readable_from)
        if(props.rowData?.is_readable_from) {
            console.log(props.rowData.is_readable_from)
            console.log(new Date(props.rowData.is_readable_from.replace(/ /, 'T')))
            console.log(props.rowData?.is_readable_from ? props.rowData.is_readable_from.replace(/ /, 'T') : '???')
            setDate(new Date(props.rowData.is_readable_from.replace(/ /, 'T')))
        }
    }, [props.rowData])

    const handleSave = () => {
        fetch(getSettings().backend + '/publish_book.php?token=' + localStorage.getItem('token'), {
            method: 'POST',
            body: JSON.stringify({id: rowData?.id, is_readable_from: published ? formatDate(date) : ""})
        }).then(response=>response.json())
            .then(response=>{
                console.log(response)
                props.closePublishDialog()   
                props.reload(rowData.id)
            });
    };

    const update = (field, value) => {
        let rd = rowData
        rd[field] = value
        setRowData(rd)
    }

    return (
        <div>
            <Dialog open={props.isOpen} onClose={props.closePublishDialog} aria-labelledby="form-dialog-title">
                <Box width={500}>                
                <DialogTitle id="form-dialog-title">Публикация книги {rowData?.name}</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        label="Книга опубликована"
                        autoFocus
                        control={
                            <Checkbox
                                checked={published}
                                onClick={(e) => setPublished(e.target.checked)}
                                inputProps={{'aria-label': 'Книга опубликована'}} 
                        />}
                    />
                    <br/>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        {published && 
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Дата публикации"
                                format="dd.MM.yyyy"
                                value={date}
                                onChange={(v) => setDate(v)}
                                KeyboardButtonProps={{'aria-label': 'Установите дату публикации'}}
                            />
                        }
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} color="primary">Сохранить</Button>
                    <Button onClick={props.closePublishDialog} color="secondary">Отмена</Button>
                </DialogActions>
                </Box>                
            </Dialog>
        </div>
    );
}