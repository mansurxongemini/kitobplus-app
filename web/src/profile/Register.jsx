import React from 'react';
import '../css/form.css';
import { Button } from '@mui/material';
import { getUser } from '../lib/api.js';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import ImageInput from './imageinput';
import { register } from '../lib/auth.ts';
import { Paper } from '@mui/material';
import useLibrary from '../LibraryContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import T from '../lib/translator.js'

const Register = ({close}) => {
    const { user } = useLibrary();
    const image1Ref = React.useRef(null);
    const image2Ref = React.useRef(null);
    const [name, setName] = React.useState(user?.name || '');
    const [address, setAddress] = React.useState(user?.address || '');
    const [birthday, setBirthday] = React.useState(user?.birthday || null);
    const errorMessage = T('Пожалуйста, заполните все поля');
    
    React.useEffect(() => {
        if (!getUser() || getUser().state !== 0 || !getUser().phone) {
            //logout();
            //window.location = '/login';
        }
    }, []);

    // Обновляем состояния при изменении объекта user
    React.useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAddress(user.address || '');
            setBirthday(user.birthday || null);
        }
    }, [user]);

    const processRegister = () => {
/*        
*/
        if (!name || !name.length || !birthday || !address || !address.length || !image1Ref.current.files.length || !image2Ref.current.files.length) {
            alert(errorMessage);
            return;
        }

       register(user.phone.toString(), name, birthday, address, image1Ref.current.files[0], image2Ref.current.files[0]).then(_ => {
            window.location = '/profile';
       }).catch(_ => alert(_));
    };

    const changeBirthday = (_) => {
        if (isNaN(_.$D)) {setBirthday(null); return;}
        const bd = _.$y.toString().padStart(4, '0') + '-' + _.$M.toString().padStart(2, '0') + '-' + _.$D.toString().padStart(2, '0');
        setBirthday(bd);
    }

    return (
        <div style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Paper className='form' style={{width: 320}}>
                <div className='formHeader'>
                    <h1>{T('Регистрация')}</h1>
                </div>
                    <div className='formBody'>
                        <TextField 
                            id="outlined-basic" 
                            value={name || ''} 
                            onChange={(_) => setName(_.target.value)} 
                            required={true} 
                            label={T("ФИО")}
                            variant="outlined" 
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateField 
                                value={birthday ? dayjs(birthday) : null}
                                onChange={changeBirthday} 
                                label={T("Дата рождения" )}
                                format="DD.MM.YYYY"
                            />
                        </LocalizationProvider>
                        <TextField 
                            id="outlined-basic" 
                            value={address || ''} 
                            onChange={(_) => setAddress(_.target.value)} 
                            required={true} 
                            label={T("Адрес")}
                            variant="outlined" 
                        />
                        <ImageInput ref={image1Ref} title={T('Загрузите копию паспорта')}/>
                        <ImageInput ref={image2Ref} title={T('Загрузите копию справки об инвалидности')}/>
                    </div>
                    <div className='fromFooter'>
                        <Button variant="contained" color='primary' onClick={processRegister}>{T('Продолжить')}</Button>
                        <Button variant="contained" color='secondary' onClick={close}>{T('Отмена')}</Button>
                    </div>
                    
            </Paper>
        </div>
    );
}

export default Register;
