import { combineReducers } from 'redux'
import loadDialog from './loadDialogReducers'
import userData from './userDataReducers'

const registrationApp = combineReducers({
    loadDialog,
    userData
})

export default registrationApp