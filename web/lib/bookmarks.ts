import {request} from './api';

export const add = (books_id: number, track: number, position: number) => {
    return new Promise((resolve, reject) => {
        request('bookmarks/add', {books_id: books_id, track: track, position: position}).then(_ => resolve(_.bookmarks)).catch(_ => reject(_));
    });
};

export const remove = (books_id: number, track: number, position: number) => {
    return new Promise((resolve, reject) => {
        request('bookmarks/remove', {books_id: books_id, track: track, position: position}).then(_ => resolve(_.bookmarks)).catch(_ => reject(_));
    });
};

export const get = (books_id: number) => {
    return new Promise((resolve, reject) => {
        request('bookmarks/get', {books_id: books_id}).then(_ => resolve(_.bookmarks)).catch(_ => reject(_));
    });
};
