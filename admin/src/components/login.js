import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from "@material-ui/core/Box";
import '../css/login.css';
import { useHistory } from "react-router-dom";
import {getSettings} from "./settings";
import { CircularProgress } from '@material-ui/core';
import { getToken, isAdmin, getUser, clearToken } from '../lib/api';
import { login, getRemoteUser} from '../lib/auth';

/*
const login = async(_email, _password) => {
    let res = await fetch(getSettings().backend + '/login.php', {
        method: 'POST',
        body: JSON.stringify({email: _email, password: _password})
    });
    const json = await res.json();
    return json;
}   
*/
const Login = (props) => {
    const history = useHistory();

    // create state variables for each input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(true);

    //const navigate = useNavigate();

/*
    const handleSubmit = e => {
        e.preventDefault();
        login(email, password).then(res => {
            let e = 'Неизвестная ошибка';
            if (typeof res === 'object' && res.hasOwnProperty('success')) {
                if (res.success && res.hasOwnProperty('token')) {
                    console.log(res);
                    if (Number(res.user.users_levels_id) === 1) {
                        localStorage.setItem('token', res.token)
                        props.login();
                        history.push("/kitobplus-admin/books")
                        return;
                    } else {
                        e = "Доступ запрещен";
                    }
                } else {
                    if (res.hasOwnProperty('error')) {
                        e = res.error;
                    }
                }
            }
            setError(e);
            setTimeout(()=>{
                var loginError = document.getElementById('loginError');
                if (loginError) {
                    loginError.focus()
                }
            }, 16)
        });
    };
*/
    useEffect(() => {
        if (isAdmin()) {
            console.log('isAdmin - go to interface');
            window.location.href = (getUser().levels_id === 0 ? "/kitobplus-admin/books" : "/kitobplus-admin/users")
            return;
        }

        if (getToken()) {
            tryLogin();
        } else {
            setBusy(false);
        }
    }, []);

    const tryLogin = (email = undefined, password = undefined) => {
        if (!getToken() && (!email || !password)) {
            return;
        }

        setBusy(true);        
        (getToken() ? getRemoteUser() : login(email, password)).then(_ => {
            console.log('login successfull');
            window.location.href = (getUser().levels_id === 0 ? "/kitobplus-admin/books" : "/kitobplus-admin/users")
        }).catch(e => {
            console.log('login failed');
            setError(e);
            clearToken();
            setBusy(false);
        });
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <div className="Login">
                <h1>Администрирование<br/>Kitob+</h1>
                {busy ?
                <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}><CircularProgress/></div>
                :
                <form onSubmit={_ => tryLogin(email, password)}>
                    <TextField
                        id="email"
                        label="e-mail"
                        variant="filled"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        id="password"
                        label="Пароль"
                        variant="filled"
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <div>
                        <Button type="submit" variant="contained" color="primary">
                            Войти
                        </Button>
                    </div>
                    {error && <div className="error" id="loginError" tabIndex="0">{error}</div>}
                </form>}
            </div>
        </Box>
    );
}

export default Login