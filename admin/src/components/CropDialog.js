import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import {getSettings} from "./settings";
import AvatarEditor from 'react-avatar-editor';
import { Slider } from '@material-ui/core';

export default function CropDialog ({isOpen, target, img, reload, id, closeCropDialog, circular}) {
    const crop = React.useRef(null);
    const [scale, setScale] = React.useState(1);
    const handleSave = () => {
        console.log(crop.current.getCroppingRect());

        fetch(getSettings().backend + '/crop.php?token=' + localStorage.getItem('token'), {
            method: 'POST',
            body: JSON.stringify({'target': target, 'id': id, crop: crop.current.getCroppingRect()}),
        }).then(response=>response.json())
            .then(response=>{
                closeCropDialog();
                reload(id)
            });
    };

    return (
        <div>
            <Dialog open={isOpen} onClose={closeCropDialog} aria-labelledby="form-dialog-title">
                <Box width={500}>
                <DialogTitle id="form-dialog-title">Редактирование изображения</DialogTitle>
                <DialogContent style={{textAlign: 'center', backgroundColor: '#ddd', border: 2,}}>
                    <AvatarEditor
                        ref={crop}
                        image={img}
                        width={250}
                        height={250}
                        borderRadius={circular ? 125 : 25}
                        color={[220,220,220, 0.8]}
                        scale={scale}
                        rotate={0}
                    />
                    <br/>
                    <Slider value={scale} min={1} max={5} step={0.01} onChange={(e, v) => {if (typeof v === 'number') {setScale(v);}}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} color="primary">Сохранить</Button>
                    <Button onClick={closeCropDialog} color="secondary">
                        Отмена
                    </Button>
                </DialogActions>
                </Box>                
            </Dialog>
        </div>
    );
}