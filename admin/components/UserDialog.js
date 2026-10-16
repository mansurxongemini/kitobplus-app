import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import {getSettings} from "./settings";
import DeleteIcon from '@material-ui/icons/Delete';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import { MuiFileInput } from 'mui-file-input';
//import FileUpload from 'react-material-file-upload';
//import { Uploader } from "uploader"; // Installed by "react-uploader".
//import { UploadButton } from "react-uploader";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { formatDate } from './books/PublishDialog';
import { getUser } from '../lib/api';
import ImageInput from './imageinput';
import { request } from '../lib/api';

export default function UserDialog (props) {
    const [id, setId] = React.useState(props.rowData?.id)
    const [name, setName] = React.useState(props.rowData?.name)
    const [firstName, setFirstName] = React.useState(props.rowData?.first_name)
    const [patronymic, setPatronymic] = React.useState(props.rowData?.patronymic)
    const [lastName, setLastName] = React.useState(props.rowData?.last_name)

    const [phone, setPhone] = React.useState(props.rowData?.phone)
    const [address, setAddress] = React.useState(props.rowData?.address)
    const [image1, setImage1] = React.useState(props.rowData?.image1)
    const [image2, setImage2] = React.useState(props.rowData?.image2)
    const [gender, setGender] = React.useState(props.rowData?.gender)
    const [levelsId, setLevelsId] = React.useState(props.rowData?.levels_id)
    const [plansId, setPlansId] = React.useState(props.rowData?.plans_id)
    const [state, setState] = React.useState(props.rowData?.state)
    const [info, setInfo] = React.useState(props.rowData?.info)
    const [allowRetry, setAllowRetry] = React.useState(props.rowData?.allow_retry)
    const [email, setEmail] = React.useState(props.rowData?.email)
    const [password, setPassword] = React.useState(props.rowData?.password)
    const [hasError, setHasError] = React.useState(false)
    const [error, setError] = React.useState("")
    const [deleteConfirm, setDeleteConfirm] = React.useState(false)
    const [imagesIsOpen, setImageIsOpen] = React.useState(false)
    const [images, setImages] = React.useState([]);
    const [lightboxImageId, setLightboxImageId] = React.useState(0);
    const [birthday, setBirthday] = React.useState()
    const [disability, setDisability] = React.useState(props.rowData?.disability)
    const [planEnd, setPlanEnd] = React.useState()
    const image1Ref = React.useRef(null);
    const image2Ref = React.useRef(null);

    React.useEffect(() => {
        console.log("ue2");
        console.log(props.rowData);
        console.log(getUser().levels_id);
        setId(props.rowData?.id)
        setName(props.rowData?.name)
        setFirstName(props.rowData?.first_name)
        setPatronymic(props.rowData?.patronymic)
        setLastName(props.rowData?.last_name)
        setPhone(props.rowData?.phone)
        setAddress(props.rowData?.address)
        setBirthday(props.rowData?.birthday ? props.rowData.birthday.replace(/ /, 'T') : null);
        setImage1(props.rowData?.image1);
        setImage2(props.rowData?.image2);
        setGender(props.rowData?.gender)
        setLevelsId(getUser().levels_id === 0 ? props.rowData?.levels_id : 1)
        setState(getUser().levels_id === 0 ? props.rowData?.state : 2);
        setLevelsId(getUser().levels_id === 0 ? props.rowData?.levels_id : 1)
        setPlansId(props.rowData?.plans_id)
        setPlanEnd(props.rowData?.plan_end ? props.rowData.plan_end.replace(/ /, 'T') : null);
        setDisability(getUser().levels_id === 0 ? (props.rowData?.disability == null ? 0 : (props.rowData?.disability + 1)) : 2);
        setInfo(props.rowData?.info)
        setAllowRetry(props.rowData?.allow_retry)
        setEmail(props.rowData?.email)
        setPassword(props.rowData?.password)
        console.log(props.rowData);
        if (props.rowData?.image1 && props.rowData?.image2) {
            setImages(['https://kitobplus.uz' + props.rowData?.image1 + '&token=' + localStorage.getItem('token'), 'https://kitobplus.uz' + props.rowData?.image2 + '&token=' + localStorage.getItem('token')]);
        }
        setImageIsOpen(false)
    }, [props.rowData])

    React.useEffect(() => {
        console.log("ue2");
        setImageIsOpen(false);
    },[]);

    const handleSave = (force_state = undefined, force_info = undefined) => {
        //if (name.trim() === '' || (!password || password.trim() === '') || (!email.trim() === '') return;
        if (getUser().levels_id !== 0 && (!((name && name.length) || (firstName && firstName.length && lastName && lastName.length)) || !name.length || !birthday || !address || !address.length || (!props.rowData?.id && (!image1Ref.current.files.length || !image2Ref.current.files.length)))) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        let payload = new FormData();
        payload.append('id', id);
        payload.append('name', name);
        payload.append('first_name', firstName);
        payload.append('patronymic', patronymic);
        payload.append('last_name', lastName);
        payload.append('phone', phone);
        payload.append('birthday', birthday ? formatDate(birthday) : null);
        payload.append('address', address);
        payload.append('gender', gender);
        payload.append('allow_retry', force_state ? 1 : allowRetry);
        if (getUser().levels_id === 0) {
            payload.append('levels_id', levelsId);
            payload.append('disability', disability > 0 ? disability - 1 : null);
            payload.append('plans_id', plansId);
            payload.append('plan_end', planEnd ? formatDate(planEnd) : null);
            payload.append('state', force_state ? force_state : state);
            payload.append('info', force_info ? force_info : (info ?? ''));
            payload.append('email', email ?? '');
            payload.append('password', password ?? '');
        }        

        if (image1Ref.current.files[0]) {
            payload.append('image1', image1Ref.current.files[0]);
        }
        if (image2Ref.current.files[0]) {
            payload.append('image2', image2Ref.current.files[0]);
        }

        fetch(getSettings().backend + '/update_user.php?token=' + localStorage.getItem('token'), {
            method: 'POST',
            headers: {Accept: 'application/json'},
            body: payload
        }).then(response=> response.json()).then(response => {
            if (!response.success) {                    
                setError(response.error)
                setHasError(true)
                return
            }
            props.closeUserDialog()
            props.reload()
        }).catch(e => {
            setError(e)
            setHasError(true)
        });
/*
        fetch(getSettings().backend + '/update_user.php?token=' + localStorage.getItem('token'), {
            method: 'POST',
            body: JSON.stringify({id:id, name: name, phone: phone, birthday: birthday ? formatDate(birthday) : null, address: address, gender: gender, state: state, info: info, allow_retry: allowRetry, email: email, password: password})
        }).then(response=>response.json())
            .then(response=>{
                if (!response.success) {                    
                    setError(response.error)
                    setHasError(true)
                    return
                }
                props.closeUserDialog()
                props.reload()
            });
*/
    };

    const deleteUser = () => {
        fetch(getSettings().backend + '/delete_user.php?token=' + localStorage.getItem('token'), {method: 'POST', body: JSON.stringify({id:id})}).then(response=>response.json())
            .then(response=>{
                setDeleteConfirm(false)
                if (!response.success) {                    
                    setError(response.error)
                    setHasError(true)
                    return
                }
                props.closeUserDialog()
                props.reload()
            });
    };

    const getTitle = (isEdit) => (isEdit ? "Редактирование " : "Создание ") + (getUser().levels_id === 0 ? 'пользователя' : (getUser().levels_id === 3 ? 'учащегося' : 'читателя'));
        
    const rejectNoDocument = () => handleSave(3, "Nogironlik haqida ma'lumotnoma yuklanmaganligi uchun so'rovingiz rad etildi.\n\nMurojaat uchun:\n+998(90)8087331")
    const rejectIncorrectName = () => handleSave(3, "Ism-familiyangiz to'liq kiritilmaganligi uchun so'rovingiz rad etildi.\n\nMurojaat uchun:\n+998(90)8087331")

    return (
        <div>
            <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} aria-labelledby="error-dialog-title">
                <Box width={400}>                
                    <DialogTitle id="error-dialog-title">Подтверждение удаления</DialogTitle>
                    <DialogContent>                   
                        <DialogContentText>
                            Вы действительно хотите удалить запись
                        </DialogContentText>
                    </DialogContent>        
                    <DialogActions>
                        <Button onClick={() => deleteUser(false)} color="primary">Удалить</Button>
                        <Button onClick={() => setDeleteConfirm(false)} color="secondar">Отмена</Button>       
                    </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={hasError} onClose={() => setHasError(false)} aria-labelledby="error-dialog-title">
                <Box width={400}>                
                    <DialogTitle id="error-dialog-title">Ошибка</DialogTitle>
                    <DialogContent>                   
                        <DialogContentText>
                            {error}
                        </DialogContentText>
                    </DialogContent>        
                    <DialogActions>
                        <Button onClick={() => setHasError(false)} color="secondary">Отмена</Button>       
                    </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={props.isOpen} onClose={_ => {setImageIsOpen(false); props.closeUserDialog(_);}} aria-labelledby="form-dialog-title">
                <form onSubmit={(e) => {e.preventDefault(); handleSave();}}>
                    <Box width={400}>                
                    <DialogTitle id="form-dialog-title">{getTitle(props.rowData?.id)}</DialogTitle>
                    <DialogContent>
                        <TextField
                            id={"name" + Date.now()}
                            label="ФИО"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{'autoComplete': 'new-password', 'aria-invalid': !(typeof name === 'string' && name.length > 0)}}
                        />
                        <div style={{display: 'flex'}}>
                            <TextField
                                id={"last_name" + Date.now()}
                                label="Фамилия"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{'autoComplete': 'new-password', 'aria-invalid': !(typeof lastName === 'string' && lastName.length > 0)}}
                            />
                            <TextField
                                id={"first_name" + Date.now()}
                                label="Имя"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{'autoComplete': 'new-password', 'aria-invalid': !(typeof firstName === 'string' && firstName.length > 0)}}
                            />
                            <TextField
                                id={"patronymic" + Date.now()}
                                label="Отчество"
                                value={patronymic}
                                onChange={(e) => setPatronymic(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{'autoComplete': 'new-password', 'aria-invalid': !(typeof patronymic === 'string' && patronymic.length > 0)}}
                            />
                        </div>
                        <div id="bat" style={{display: 'flex', alignItems: "top"}}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Дата рождения"
                                    format="dd.MM.yyyy"
                                    value={birthday}
                                    onChange={v => setBirthday(v)}
                                    KeyboardButtonProps={{'aria-label': 'Установить дату рождения'}}
                                />
                            </MuiPickersUtilsProvider>
                            <TextField
                                id={"phone" + Date.now()}
                                label="Телефон"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{'autoComplete': 'new-password', 'aria-invalid': !(typeof phone === 'string' && phone.length > 0)}}
                            />
                        </div>
                        <TextField
                            id={"address" + Date.now()}
                            label="Адрес"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{'autoComplete': 'new-password', 'aria-invalid': !(typeof address === 'string' && address.length > 0)}}
                        />
                        <ImageInput ref={image1Ref} title={'Загрузите копию паспорта'}/>
                        <ImageInput ref={image2Ref} title={'Загрузите копию справки об инвалидности'}/>
                        {(image1 && image2) &&
                                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <div style={{textAlign: 'center'}}>
                                        <label>Паспорт</label><br/>
                                        <img
                                            src={"https://kitobplus.uz" + image1 + '&token=' + localStorage.getItem('token')}
                                            style={{cursor: 'pointer', width: 160, height: 160, 'object-fit': 'contain'}}
                                            alt="Паспорт"
                                            onClick={_ => {setLightboxImageId(0); setImageIsOpen(true);}}
                                        />
                                    </div>
                                    <div style={{textAlign: 'center'}}>
                                        <label>Справка</label><br/>
                                        <img
                                            src={"https://kitobplus.uz" + image2 + '&token=' + localStorage.getItem('token')}
                                            style={{cursor: 'pointer', width: 160, height: 160, 'object-fit': 'contain'}}
                                            alt="Справка"
                                            onClick={_ => {setLightboxImageId(1); setImageIsOpen(true);}}
                                        />
                                    </div>
                                    {imagesIsOpen && (
                                        <Lightbox
                                            mainSrc={images[lightboxImageId]}
                                            nextSrc={images[(lightboxImageId + 1) % images.length]}
                                            prevSrc={images[(lightboxImageId + images.length - 1) % images.length]}
                                            onCloseRequest={() => setImageIsOpen(false)}
                                            onMovePrevRequest={() => setLightboxImageId((lightboxImageId + images.length - 1) % images.length)}
                                            onMoveNextRequest={() => setLightboxImageId((lightboxImageId + 1) % images.length)}
                                            reactModalStyle={{overlay: {zIndex: 100000}}}
                                        />                                        
                                    )}
                                </div>
                        }
                        <div style={{display: 'flex', flex: 1, border: '0px solid red'}}>
                            <div style={{flex: 1}}>
                                <InputLabel id="gender-label">Пол</InputLabel>
                                <Select
                                        labelId="gender-label"
                                        id="gender"
                                        value={gender}
                                        label="Пол"
                                        style={{width: '100%'}}
                                        onChange={e => setGender(e.target.value)}
                                        width="100%"
                                        required
                                    >
                                    <MenuItem value={0}>-</MenuItem>
                                    <MenuItem value={1}>Мужской</MenuItem>
                                    <MenuItem value={2}>Женский</MenuItem>
                                </Select>                        
                            </div>
                            {getUser().levels_id === 0 && <div style={{flex: 1}}>
                                <InputLabel id="disability-label">Инвалидность</InputLabel>
                                <Select
                                        labelId="disability-label"
                                        id="disability"
                                        value={disability}
                                        label="Инвалидность"
                                        style={{width: '100%'}}
                                        onChange={e => setDisability(e.target.value)}
                                        width="100%"
                                        required
                                    >
                                    <MenuItem value={0}>-</MenuItem>
                                    <MenuItem value={1}>Нет</MenuItem>
                                    <MenuItem value={2}>Есть</MenuItem>
                                </Select>                        
                            </div>}
                        </div>                        
                        {getUser().levels_id === 0 && <>
                            <div style={{display: 'flex', flex: 1, border: '0px solid red'}}>
                                <div style={{flex: 1}}>
                                    <InputLabel id="levels_id-label">Доступ</InputLabel>
                                    <Select
                                            labelId="levels_id-label"
                                            id="levels_id"
                                            value={levelsId}
                                            label="Доступ"
                                            style={{width: '100%'}}
                                            onChange={e => setLevelsId(e.target.value)}
                                            width="100%"
                                            required
                                        >
                                        <MenuItem value={0}>Администратор</MenuItem>
                                        <MenuItem value={1}>Читатель</MenuItem>
                                        <MenuItem value={2}>Библиотека</MenuItem>
                                        <MenuItem value={3}>Школа</MenuItem>
                                    </Select>
                                </div>
                                <div style={{flex: 1}}>
                                    <InputLabel id="state-label">Статус</InputLabel>
                                    <Select
                                            labelId="state-label"
                                            id="state"
                                            value={state}
                                            label="Статус"
                                            style={{width: '100%'}}
                                            onChange={e => setState(e.target.value)}
                                            width="100%"
                                        >
                                        <MenuItem value={1}>Ожидает подтверждения</MenuItem>
                                        <MenuItem value={2}>Доступ подтвержден</MenuItem>
                                        <MenuItem value={3}>Доступ запрещён</MenuItem>
                                    </Select>
                                </div>
                            </div>
                            <div style={{display: 'flex', flex: 1, alignItems: 'flex-end', border: '0px solid red'}}>
                                <div style={{flex: 1, alignSelf: 'flex-end', paddingBottom: 8}}>
                                    <InputLabel id="plans_id-label">План</InputLabel>
                                    <Select
                                            labelId="plans_id-label"
                                            id="plans_id"
                                            value={plansId}
                                            label="План"
                                            style={{width: '100%'}}
                                            onChange={e => setPlansId(e.target.value)}
                                            width="100%"
                                        >
                                        <MenuItem value={0}>Ограниченный доступ</MenuItem>
                                        <MenuItem value={1}>Демо-премиум</MenuItem>
                                        <MenuItem value={2}>Полный доступ</MenuItem>
                                        <MenuItem value={3}>Примиум</MenuItem>
                                    </Select>
                                </div>
                                <div style={{flex: 1}}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} sx={{ mt: 0, pt: 0, m: 0}} style={{marginTop: 0, paddingTop: 0}}>
                                        <KeyboardDatePicker
                                            sx={{ mt: 0, pt: 0, m: 0}}
                                            margin="normal"
                                            id="plan_end-dialog"
                                            label="Действует до"
                                            format="dd.MM.yyyy"
                                            value={planEnd}
                                            onChange={v => setPlanEnd(v)}
                                            KeyboardButtonProps={{'aria-label': 'Действует до'}}
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                            </div>                            
                            {(getUser().levels_id === 0 && state == 3) && <>
                                    <TextField
                                        id="info"
                                        label="Причина отказа"
                                        value={info}
                                        onChange={(e) => setInfo(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox
                                            color="primary"
                                            checked={allowRetry}
                                            onChange={(e) => setAllowRetry(e.target.checked ? 1 : 0)}
                                            label="Разрешить повторную регистрацию"
                                            inputProps={{ 'aria-label': 'Разрешить повторную регистрацию' }}
                                        />}
                                        label="Разрешить повторную регистрацию"
                                    />
                                    
                                </>
                            }
                            {levelsId != 1 &&
                                <div style={{display: 'flex', flex: 1, alignItems: "top", border: '1px solid red'}}>
                                    <div style={{flex: 1}}>                            
                                        <TextField
                                            id={"email" + Date.now()}
                                            label="e-mail"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{'autoComplete': 'new-password', 'aria-invalid': !(typeof email === 'string' && email.length > 0)}}
                                        />
                                    </div>
                                    <div style={{flex: 1}}>                            
                                        <TextField
                                            id={"password" + Date.now()}
                                            label="Пароль"
                                            value={password}
                                            type="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{'autoComplete': 'new-password', 'aria-invalid': !(typeof password === 'string' && password.length > 0)}}
                                        />
                                    </div>
                                </div>
                            }
                            <div style={{flex: 1, display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                                <Button onClick={rejectNoDocument} color="secondary">Нет справки</Button>
                                <Button onClick={rejectIncorrectName} color="secondary">Заполнить ФИО</Button>
                            </div>
                        </>}
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" color="primary">Сохранить</Button>
                        <Button onClick={props.closeUserDialog} color="secondary">Отмена</Button>
                        {id !== 0 && <Button onClick={() => setDeleteConfirm(true)} color="error" startIcon={<DeleteIcon />}>Удалить</Button>}
                    </DialogActions>
                    </Box>                
                </form>
            </Dialog>
        </div>
    );
}