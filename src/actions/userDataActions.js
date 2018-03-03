import {
    UPDATE_USER_DATA
} from '../constants/actionTypes';
import { openLoadDialog, closeLoadDialog } from '../actions'

const updateUserData = user => {
    return {
        type: UPDATE_USER_DATA,
        user
    };
}

const getUserAuth = uid => {
    return new Promise((resolve, reject) => {
        window.firebase.database().ref(`/users/${uid}`).once('value').then(snapshot => {
            let userInfo = snapshot.val() ? snapshot.val() : {};
            resolve(userInfo.auth);
        });
    })
}

const createUserData = (uid, auth) => {
    let user = {};
    Object.defineProperty(user, "uid", {
        value: uid,
        writable: false,
        enumerable: false,
        configurable: false
    });
    Object.defineProperty(user, "auth", {
        value: auth,
        writable: false,
        enumerable: false,
        configurable: false
    });
    return user;
}

const fetchUserData = uid => {
    return dispatch => {
        dispatch(openLoadDialog())
        return getUserAuth(uid)
            .then(auth => createUserData(uid, auth))
            .then(user => dispatch(updateUserData(user)))
            .then(() => dispatch(closeLoadDialog()))
    }
}

const shouldFetchUserData = (state, uid) => {
    if (state.userData.uid === null || state.userData.uid !== uid)
        return true
    return false
}

export const fetchUserDataIfNeeded = uid => {
    return (dispatch, getState) => {
        if (shouldFetchUserData(getState(), uid)) {
            return dispatch(fetchUserData(uid))
        }
    }
}