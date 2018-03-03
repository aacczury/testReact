import { combineReducers } from 'redux'
import userData from './userDataReducers'
import isLoadDialogOpen from './isLoadDialogOpenReducers'

const registrationApp = combineReducers({
    userData,
    isLoadDialogOpen
})

export default registrationApp