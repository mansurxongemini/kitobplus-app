import {request} from './api';

export const get = (table, id) => {
    return new Promise((resolve, reject) => {
        request('person/get', {table: table, id: id}).then(_ => {
            resolve(_.data);
        })
        .catch(_ => reject(_));
    });
};
