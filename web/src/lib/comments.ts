import {request} from './api';

export const add = (id: number, books_id: number, comment: string) => {
    return new Promise((resolve, reject) => {
        request('comments/add', {id: id, books_id: books_id, comment: comment}).then(_ => resolve(_.comments)).catch(_ => reject(_));
    });
};

export const remove = (id: number, books_id: number) => {
    return new Promise((resolve, reject) => {
        request('comments/remove', {id: id, books_id: books_id}).then(_ => resolve(_.comments)).catch(_ => reject(_));
    });
};

export const get = (books_id: number) => {
    return new Promise((resolve, reject) => {
        request('comments/get', {books_id: books_id}).then(_ => resolve(_.comments)).catch(_ => reject(_));
    });
};
