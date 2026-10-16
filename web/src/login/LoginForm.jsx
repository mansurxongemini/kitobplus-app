import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
//import { ThemeProvider } from './login/ThemeProvider';
import { request } from "../lib/api";
import { clearToken } from "../lib/api";
import AppleIcon from '@mui/icons-material/Apple';
import { Link } from "react-router-dom";
// Import images
import group110001 from "./img/group-1-10001.png"
import logo_icon from "./img/logo_icon.png"
import group19 from "./img/group19.png"
import rectangle21815 from "./img/rectangle-21815.png"
import PhoneInput from "react-phone-input-2"
import 'react-phone-input-2/lib/style.css'
import { getMode } from '../lib/api'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import '../css/form.css';
import { sms, verify } from '../lib/auth.ts'
import T from '../lib/translator.js'
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import AppleLogin from 'react-apple-login';
import useLibrary from "../LibraryContext.js";
import {SITE_URL} from "../lib/config";

const LoginForm = ({title, only_phone = false, callback = null}) => {
    const {user, setUser} = useLibrary();
    const navigate = useNavigate();
    const successMessage = T('Добро пожаловать в библиотеку Kitob+.');
    const incorrectPhone = T('Введен некорректный номер телефона');
    const [value, setValue] = React.useState(user?.phone)
    const [isCorrect, setIsCorrect] = React.useState()
    const [smsSended, setSmsSended] = React.useState(false)
    const [debugCode, setDebugCode] = React.useState();
    const [error, setError] = React.useState()
    const [phoneError, setPhoneError] = React.useState('')
    const [code, setCode] = React.useState('')
    React.useEffect((_) => {
        if (value) {
            setIsCorrect(isPossiblePhoneNumber('+' + value));
        } else {
            setIsCorrect(false);
        }
    }, [value]);

    const login = () => {
        if (!isCorrect) {
            setPhoneError(incorrectPhone);
            return;
        }
        setPhoneError('');

        if (!smsSended) {
            sms(value).then(_ => {                
                console.log(_);
                setDebugCode(_?.code);
                setSmsSended(true);
            }).catch(err => {
                const msg = typeof err === 'string' ? err : (err?.message || T('Ошибка отправки SMS'));
                setPhoneError(msg);
            });

            return;
        }
    };

    React.useEffect(() => {
        if (!code || code.length !== 4) {
            return;
        }

        verify(value, code).then(_ => {
            //console.log(_);
            if (callback) {
                setUser(_.user);
                callback();
            } else {
                window.location = '/';
            }
        }).catch(err => {
            const msg = typeof err === 'string' ? err : (err?.message || String(err));
            setError(msg);
        });
    }, [code]);

  const handleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    //const decoded = jwtDecode(credentialResponse.credential);
    //console.log(decoded);    
    //console.log(credentialResponse);
    const idToken = credentialResponse.credential;

    try {
      // Отправляем токен на бэкенд для верификации
      clearToken();
      const response = await request('oauth/google', {google_token: idToken});
      console.log(response);
      window.location = "/";
/*
      const response = await fetch(SITE_URL + '/api/oauth/google.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      console.log('Backend response:', data);
*/
      // Если бэкенд подтвердил токен, управляем состоянием входа на фронтенде
      //const userProfile = jwtDecode(idToken); // Декодируем для получения данных на фронтенде
      //login(userProfile);
    } catch (error) {
      console.error('Error:', error);
      alert('Не удалось осуществить вход Google Sign in');
      // Обработка ошибки входа
    }
  };

  const handleError = () => {
    alert('Google Sign In failed');
  };


  const handleAppleResponse = (response) => {
    if (response.error) {
      console.error('Apple login error', response.error);
      return;
    }

    console.log('Apple Response:', response);
    // `response` будет содержать `authorization.code` и `authorization.id_token`
    // Также может содержать `user` объект с именем и email при ПЕРВОМ входе
    
    // Отправляем `response.authorization.id_token` и `response.authorization.code` на бэкенд для верификации
    verifyBackend(response.authorization);
  };

  const verifyBackend = async (authorization) => {
    try {
      clearToken();
      const response = await request('oauth/apple', {authorization: authorization});
      console.log(response);
      window.location = "/";

/*
      const res = await fetch(SITE_URL + '/api/oauth/apple.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorization }),
      });
      
      if (!res.ok) {
        throw new Error('Backend verification failed');
      }

      const data = await res.json();
      console.log('Backend response:', data);
      // Логика входа на фронтенде (например, через AuthContext)
*/
    } catch (error) {
      console.error('Error during backend verification:', error);
      alert("Ошибка входа с помощью Apple ID");
    }
  };

    return !smsSended ? (<>
            <div className='formHeader'>
                <h1>{title}</h1>
            </div>
            <div className='formBody'>
                <PhoneInput
                    inputProps={{
                        id: 'login-phone-input',
                        name: 'phone',
                        required: true,
                        autoFocus: true,
                        autoComplete: 'tel',
                        inputMode: 'tel',
                        'aria-invalid': Boolean(phoneError),
                        'aria-describedby': phoneError ? 'login-phone-error' : undefined,
                        style: {width:'377px'}
                    }}
                    specialLabel={T('Телефон')}
                    placeholder={T('Введите номер телефона')}
                    value={value}
                    disableDropdown={true}
                    onChange={(val) => {
                        setPhoneError('');
                        setValue(val);
                    }}
                />
                {phoneError && (
                    <div
                        id="login-phone-error"
                        role="alert"
                        style={{ color: '#d32f2f', fontSize: '14px', marginTop: '6px', textAlign: 'left' }}
                    >
                        {phoneError}
                    </div>
                )}
            </div>
            <div className='formFooter'>
                <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                    <Button style={{width: '100%', color: 'white', height: '36px'}} variant="contained" color='primary' onClick={login}>{T('Продолжить')}</Button>
                    
                    {!only_phone && <>
                        <div style={{
                            padding: 4, 
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{
                                flex: 1,
                                height: '1px',
                                backgroundColor: '#ccc'
                            }}></div>
                            <span>{T('или')}</span>
                            <div style={{
                                flex: 1,
                                height: '1px',
                                backgroundColor: '#ccc'
                            }}></div>
                        </div>
                        <GoogleLogin onSuccess={handleSuccess} onError={handleError}/>                       
                        
                        <AppleLogin
                            clientId="uz.kitobplus.signin" // Ваш Service ID
                            redirectURI={SITE_URL + "/login"} // Ваш Redirect URI
                            responseType="code id_token"
                            responseMode="form_post"
                            usePopup={true} // Рекомендуется для лучшего UX
                            callback={handleAppleResponse}
                            scope="name email"
                            render={(renderProps) => (
                                <Button startIcon={<AppleIcon aria-hidden="true" />} sx={{border: 1, width: '100%'}} onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign in with Apple</Button>
                            )}
                        />
                    </>}
                </div>
            </div>
        </>) : (<>
            <div className='formBody'>
                <div>{T('Мы отправили SMS с кодом на номер')}</div>
                <div style={{fontWeight: 'bold'}}>+{value}</div>
                <div>{T('Пожалуйста, введите код из SMS')}</div>
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: 16, paddingBottom: 16}}>
                    <input
                        id="sms-code-input"
                        aria-label={T('Пожалуйста, введите код из SMS')}
                        autoFocus={true}
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "sms-code-error" : undefined}
                        style={{
                            fontSize: 32,
                            textAlign: 'center',
                            width: 128,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: error ? '#d32f2f' : 'lightgray'
                        }}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key) || (event.target.value && event.target.value.length >= 4)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={e => {
                            setError(null);
                            setCode(e.target.value);
                        }}
                        value={code}
                    />
                </div>
                {debugCode ? <div style={{display: 'flex', justifyContent: 'center'}}><span style={{color: 'green'}}>{T('Код')}: {debugCode}</span></div> : <></>}                        
                {error ? (
                    <div id="sms-code-error" role="alert" style={{display: 'flex', justifyContent: 'center'}}>
                        <span style={{color: '#d32f2f'}}>{typeof error === 'string' ? error : (error?.message || String(error))}</span>
                    </div>
                ) : <></>}
            </div>
        </>)
    
}

export default LoginForm;