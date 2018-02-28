import {
    UPDATE_USER_DATA
} from '../constants/actionTypes';

const userData = (state = { uid: null, auth: null }, action) => {
    switch (action.type) {
        case UPDATE_USER_DATA:
            return action.user
        default:
            return state
    }
}

export default userData