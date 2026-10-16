import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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

export default function BookDialog (props) {
    const [open, setOpen] = React.useState(props.isOpen);
    const [inboxGenres, setInboxGenres] = React.useState(props.inbox_genres);
    const [src, setSrc] = React.useState('');
    const pickerRef = React.useRef();
    const sourceRef = React.useRef();
    const [name, setName] = React.useState(props.rowData?.name)
    const [annotation, setAnnotation] = React.useState(props.rowData?.annotation)
    const [rowData, setRowData] = React.useState(props.rowData)
    const [file, setFile] = React.useState()
    const [adult, setAdult] = React.useState(props.rowData?.adult);

    function handleFileChange(event) {
        console.log(event.target.files[0])
        setFile(event.target.files[0])
    }


    const handleClickOpen = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    const handleClose = () => {
        props.stopPlayback();
        setOpen(false);
    };

    const handlePlay = () => {
        props.preview(props.rowData);
    }

    //React.useEffect(() => {setAuthor(props.authors_name)}, [props.authors_name])
    //React.useEffect(() => {setName(props.name)}, [props.name])
    //React.useEffect(() => {setDictor(props.dictors_name)}, [props.dictors_name])
    React.useEffect(() => {
        setName(props.rowData?.name)
        setAnnotation(props.rowData?.annotation)
        setAdult(props.rowData?.adult)
        setRowData(props.rowData)
    }, [props.rowData])

    const fileUpload = async () => {
        console.log("Uploading file...")

        const formData = new FormData()
        formData.append("file", file)
        formData.append("target", "books")
        formData.append("id", rowData.id)

        try {
            const result = await fetch(getSettings().backend + '/file_upload.php?token=' + localStorage.getItem('token'), {
                method: "POST",
                body: formData,
            });

            const data = await result.json()

            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSave = () => {
        rowData.name = name
        rowData.annotation = annotation
        rowData.adult = adult
                
        fetch(getSettings().backend + '/update_book.php?token=' + localStorage.getItem('token'), {
            method: 'POST',
            body: JSON.stringify(rowData)
        }).then(response=>response.json())
            .then(response=>{
                if (file) fileUpload()
                console.log(response)
                props.closeBookDialog()   
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
            <Dialog open={props.isOpen} onClose={props.closeBookDialog} aria-labelledby="form-dialog-title">
                <Box width={500}>                
                <DialogTitle id="form-dialog-title">{props.rowData?.folder ? "Импорт" : "Карточка"} книги</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        freeSolo
                        selectOnFocus="false"
                        fullWidth
                        options={props.options?.authors}
                        filterOptions={() => rowData?.authors_name ? filterOptions(props.options.authors, rowData.authors_name) : []} 
                        value={rowData?.authors_name}
                        onChange={(event, newValue) => update('authors_name', newValue)}
                        onInputChange={(event, newInputValue) => update('authors_name', newInputValue)}
                        renderInput={(params) => <TextField {...params} label="Автор" InputLabelProps={{ shrink: true }}/>}
                    />                    
                    <TextField
                        id="name"
                        label="Название"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    <Autocomplete
                        freeSolo
                        fullWidth
                        options={props.options?.dictors}
                        filterOptions={() => rowData?.dictors_name ? filterOptions(props.options.dictors, rowData.dictors_name) : []} 
                        value={rowData?.dictors_name}
                        onChange={(event, newValue) => update('dictors_name', newValue)}
                        onInputChange={(event, newInputValue) => update('dictors_name', newInputValue)}
                        renderInput={(params) => <TextField {...params} label="Диктор" InputLabelProps={{ shrink: true }}/>}
                    />
                    <Autocomplete
                        freeSolo
                        fullWidth
                        options={props.options?.genres}
                        filterOptions={() => rowData?.genres_name ? filterOptions(props.options.genres, rowData.genres_name) : []} 
                        value={rowData?.genres_name}
                        onChange={(event, newValue) => update('genres_name', newValue)}
                        onInputChange={(event, newInputValue) => update('genres_name', newInputValue)}
                        renderInput={(params) => <TextField {...params} label="Жанры" InputLabelProps={{ shrink: true }}/>}
                    />     
                    <Autocomplete
                        freeSolo
                        fullWidth
                        options={props.options?.publishers}
                        filterOptions={() => rowData?.publishers_name ? filterOptions(props.options.publishers, rowData.publishers_name) : []} 
                        value={rowData?.publishers_name}
                        onChange={(event, newValue) => update('publishers_name', newValue)}
                        onInputChange={(event, newInputValue) => update('publishers_name', newInputValue)}
                        renderInput={(params) => <TextField {...params} label="Издательство" InputLabelProps={{ shrink: true }}/>}
                    />     
                    <TextField
                        id="annotation"
                        label="Описание"
                        value={annotation}
                        onChange={(e) => setAnnotation(e.target.value)}
                        fullWidth
                        multiline
                        rows={5}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControlLabel label="18+" control={<Checkbox checked={adult} onClick={(e) => setAdult(e.target.checked)} inputProps={{'aria-label': '18+'}} />}/><br/>
                    <label htmlFor="file">Изображение</label>                
                    <input id="file" type="file" onChange={handleFileChange}/>
                    <DialogContentText></DialogContentText>
{/*
                    <Media>
                        <div className="media">
                        <div className="media-player">
                            <Player vendor="audio" src="http://kitobplus.uz/books/00001/0001.mp3" />
                        </div>
                        <div className="media-controls">
                            <KBPlayPause />
                            <MuteUnmute />
                        </div>
                        </div>
                    </Media>
                    <FontAwesomeIcon icon="fa-check-square" />
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '150px', height: '150px'}}>
                            <div role="button" tabIndex="0" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', border: '2px solid gray', borderRadius: '50%'}}>
                                <FontAwesomeIcon icon={faPlay} size="4x"/>
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '150px', height: '150px'}}>
                            <button tabIndex="0" aria-label="Проверка" style={{cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', border: '2px solid gray', borderRadius: '50%'}} onClick={() => console.log('test')}>
                                <FontAwesomeIcon icon={faStepForward} size="2x"/>
                            </button>
                        </div>
                    </div>
*/}
                </DialogContent>
                <DialogActions>
                    {(props.rowData?.preview) &&
                        <Button onClick={handlePlay} onBlur={props.stopPlayback} color="info">
                            Воспроизвести
                        </Button>
                    }
                    <Button onClick={handleSave} color="primary">
                        {props.rowData?.import ? "Импортировать" : "Сохранить"}
                    </Button>
                    <Button onClick={props.closeBookDialog}>
                        Отмена
                    </Button>
                </DialogActions>
                </Box>                
            </Dialog>
        </div>
    );
}