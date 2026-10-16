import {request} from './api';

export const like = (books_id: number, liked: number) => request('like', {books_id: books_id, liked: liked});

