import {osVersion, osName, browserVersion, browserName} from 'react-device-detect';
import {SITE_URL} from './config';

export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => {
    let token = localStorage.getItem('token');
    if (token && token.toString().length === 19) {
        return token;
    }
    return null;
}
export const clearToken = (token) => localStorage.removeItem('token');

export const setUser = (user) => (user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user'));
export const getUser = () => (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
export const logout = () => {setUser(null); clearToken();}
export const registered = () => (getToken() && getUser() !== null && getUser().state === 2);

export const getMode = () => 'kitob';
export const getCountryCode = () => (getMode() === 'lv' ? 'RU' : (localStorage.getItem('country_code') ?? 'UZ'));
export const setCountryCode = (countryCode) => localStorage.setItem('country_code', countryCode);
export const getHost = () => SITE_URL;

/*
const storage = new MMKVLoader().withEncryption().initialize();

export const getToken = () => storage.getString('token');
export const setToken = (token: string) => storage.setString('token', token);

export const getAutosleepSeconds = () => storage.getInt('autosleep');
export const setAutosleepSeconds = (autosleep: number) => storage.setInt('autosleep', autosleep);

export const getAutosleepInfoWasShown = () => storage.getBool('autosleep_info_was_shown');
export const setAutosleepInfoWasShown = () => storage.setBool('autosleep_info_was_shown', true);

export const getBookmarkInfoWasShown = () => storage.getBool('bookmark_info_was_shown');
export const setBookmarkInfoWasShown = () => storage.setBool('bookmark_info_was_shown', true);

export const getExtraRates = () => storage.getBool('extra_rates');
export const setExtraRates = (_: boolean) => storage.setBool('extra_rates', _);

export const getTheme = () => storage.getString('theme');
export const setTheme = (theme: string) => storage.setString('theme', theme);

export const getCountryCode = () => storage.getString('country_code');
export const setCountryCode = (cc: string) => storage.setString('country_code', cc);

export const getPrestart = () => storage.getBool('prestart');
export const setPrestart = (_: boolean) => storage.setBool('prestart', _);
*/
export const request = async (endpoint, payload = {}, headers = null, body = null, signal = null, request_id = null) => {
    //console.log(`request(${endpoint}, ` + JSON.stringify(payload) + ')');

    let requestHeaders = {};
    if (headers == null) {
        headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
    } else {
        requestHeaders = headers;
    }

    let platform = 2;
    let model = osName + ' ' + osVersion + ', ' + browserName + ' ' + browserVersion;
    let requestBody = '';
    let token = getToken();
    if (typeof token === 'string' && !token.match(/^[0-9]+$/)) {
        token = null;
    }
    
    //console.log('current token = ' + token);

    if (body == null) {
        payload.platform = platform;
        payload.model = model;
        payload.token = token;
        requestBody = JSON.stringify(payload);
    } else {
        if (body instanceof FormData) {
            body.append('platform', platform);
            body.append('model', model);
            body.append('token', token);
        }
        requestBody = body;
    }

    return new Promise((resolve, reject) => {
        fetch(getHost() + '/api/' + endpoint + '.php', {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody,
            signal: signal,
        })
        .then(response => {
            //console.log('response:');
            //console.log(response);
            return response.json();
        })
        .then(json => {
            //console.log('json:');
            //console.log(json);

            if (typeof json !== 'object' || !json.hasOwnProperty('success')) {
                console.warn('Incorrect response from endpoint');
                reject('Incorrect response from endpoint');
                return;
            }

            if (json.hasOwnProperty('token')) {
                setToken(json.token);
            }

            if (!json.success) {
                console.warn('success is false');
                reject(json.error);
                return;
            }
            
            if (json.hasOwnProperty('user')) {
                setUser(json['user'])
            }
            json.request_id = request_id;
            resolve(json);
        })
        .catch(error => {
            reject(error);
        });
    });
};
