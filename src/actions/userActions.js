import {
    UPDATE_USER_DATA
} from '../constants/actionTypes';

export function updateUserData(user) {
    return {
        type: UPDATE_USER_DATA,
        user
    };
}