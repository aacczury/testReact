import {
    OPEN_LOAD_DIALOG,
    CLOSE_LOAD_DIALOG
} from '../constants/actionTypes';

export function openLoadDialog() {
    return {
        type: OPEN_LOAD_DIALOG
    };
}

export function closeLoadDialog() {
    return {
        type: CLOSE_LOAD_DIALOG
    };
}