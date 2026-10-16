import {request, getToken} from './api';

export const save = ({books_id, track, position, rate}: Object) => {
    if (getToken()) {
        request('playback_position', {books_id, track, position, rate});
    }
};
