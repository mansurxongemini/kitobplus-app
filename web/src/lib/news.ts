import {request} from './api';

export const list = (page = null, per_page = null, exclude: number = 0) => request('news/list', {page, per_page, exclude})
export const add = (newsData) => request('news/add', newsData)
export const get = (id: number, register_view: boolean = false) => request('news/get', {id, register_view})
export const remove = (id: number) => request('news/remove', {id})

