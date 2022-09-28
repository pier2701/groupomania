import { combineReducers } from 'redux';
import userReducer from './user.reducer';

// on centralise les "reducers"
export default combineReducers({
    userReducer,
})