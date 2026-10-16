import {request, getToken} from './api';

export const sms = (phone: string) => {
    return request('auth/sms', {phone: phone});
};

export const verify = (phone: string, code: number) => {
    return request('auth/verify', {phone: phone, code: code});
};

export const unregister = (phone: string, code: string) => {
    return request('auth/unregister', {phone: phone, code: code});
};

export const pay = (plans_id) => request('access/pay', {plans_id});

export const register = (phone: string, name: string, birthday: string, address: string, image1: object, image2: object) => {
    let payload = new FormData();
    payload.append('phone', phone);
    payload.append('name', name);
    payload.append('birthday', birthday);
    payload.append('address', address);
    payload.append('image1', image1);
    payload.append('image2', image2);

    return request(
        'auth/register2',
        {}, {Accept: 'application/json',},
        payload
    );
};

export const getUser = () => {
    return new Promise((resolve, reject) => {
        if (!getToken()) {reject('No auth token'); return;}

        request('auth/user').then(result => {
            if (!result.success) {reject(result.error); return;}
            resolve(result.user);
        }).catch(_ => reject(_));
    });
};
