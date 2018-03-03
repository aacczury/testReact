import {
    OPEN_LOAD_DIALOG,
    CLOSE_LOAD_DIALOG
} from '../constants/actionTypes';

const isLoadDialogOpen = (state = false, action) => {
    switch (action.type) {
        case OPEN_LOAD_DIALOG:
            return true
        case CLOSE_LOAD_DIALOG:
            return false
        default:
            return state
    }
}

export default isLoadDialogOpen