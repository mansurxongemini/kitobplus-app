import {request, getToken, isAdmin} from './api';

export const sms = (phone) => {
    return request('auth/sms', {phone: phone});
};

export const verify = (phone, code) => {
    return request('auth/verify', {phone: phone, code: code});
};

export const unregister = (phone, code) => {
    return request('auth/unregister', {phone: phone, code: code});
};

export const register = (phone, name, birthday, address, image1, image2) => {
    let payload = new FormData();
    payload.append('phone', phone);
    payload.append('name', name);
    payload.append('birthday', birthday);
    payload.append('address', address);
    payload.append('image1', image1);
    payload.append('image2', image2);

    return request(
        'auth/register',
        {}, {Accept: 'application/json',},
        payload
    );
};

export const login = (email, password) => {
    return new Promise((resolve, reject) => {
        if (!getToken() && !(email && password)) {reject('No auth token'); return;}

        request('auth/login', {email, password}).then(result => {
            if (!result.success) {reject(result.error); return;}
            if (!isAdmin()) {
                reject('Доступ запрещён');
                return;
            }
            resolve(result.user);
        }).catch(_ => reject(_));
    });
};

export const getRemoteUser = () => {
    return request('auth/user');
};