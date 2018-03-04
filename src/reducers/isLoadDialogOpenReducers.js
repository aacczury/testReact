import {
    OPEN_LOAD_DIALOG,
    CLOSE_LOAD_DIALOG
} from '../constants/actionTypes';

const isLoadDialogOpen = (state = 0, action) => {
    switch (action.type) {
        case OPEN_LOAD_DIALOG:
            return state + 1
        case CLOSE_LOAD_DIALOG:
            return state > 0 ? state - 1 : state
        default:
            return state
    }
}

export default isLoadDialogOpen