import {request} from './api';

export const add = (books_id: number) => request('bookshelf/add', {books_id: books_id});

export const remove = (books_id: number) => request('bookshelf/remove', {books_id: books_id});
