import {request} from './api';


export const get = () => request('plans/get', {});
export const set = (id, enabled, price) => request('plans/set', {id, enabled, price});
