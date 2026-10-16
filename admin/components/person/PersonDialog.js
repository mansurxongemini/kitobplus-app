import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import {getSettings} from "../settings";

export default function PersonDialog ({row, reload, table, isOpen, closePersonDialog}) {
    const [name, setName] = React.useState(row?.name)
    const [annotation, setAnnotation] = React.useState(row?.annotation)
    const [rowData, setRowData] = React.useState(row)
    const [file, setFile] = React.useState()
    
    function handleFileChange(event) {
        console.log(event.target.files[0])
        setFile(event.target.files[0])
    }

    React.useEffect(() => {
        setName(row?.name)
        setAnnotation(row?.annotation)
        setRowData(row);
    }, [row])

    const fileUpload = async () => {
        console.log("Uploading file...")

        const formData = new FormData()
        formData.append("file", file)
        formData.append("target", table)
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
        rowData.name = name;
        rowData.annotation = annotation;
        rowData.table = table;
        
        fetch(getSettings().backend + '/update_person.php?token=' + localStorage.getItem('token'), {
            method: 'POST',
            body: JSON.stringify(rowData)
        }).then(response=>response.json())
            .then(response=>{
                if (file) fileUpload()
                console.log(response)
                closePersonDialog()   
                reload(rowData.id)
            });
    };

    return (
        <div>
            <Dialog open={isOpen} onClose={closePersonDialog} aria-labelledby="form-dialog-title">
                <Box width={500}>                
                <DialogTitle id="form-dialog-title">Редактирование</DialogTitle>
                <DialogContent>
                    <TextField
                        id="name"
                        label="ФИО"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
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
                    <label htmlFor="file">Изображение</label>                
                    <input id="file" type="file" onChange={handleFileChange}/>
                    <DialogContentText></DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} color="primary">Сохранить</Button>
                    <Button onClick={closePersonDialog} color="secondary">
                        Отмена
                    </Button>
                </DialogActions>
                </Box>                
            </Dialog>
        </div>
    );
}