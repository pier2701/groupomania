import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import usersReducer from './users.reducer';
import postReducer from './post.reducer';

// on centralise les "reducers" ( store )
export default combineReducers({
    userReducer,
    usersReducer,
    postReducer
})