import { GET_USERS } from "../actions/users.actions";

const initialState = {};

export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USERS:
            return action.payload; // on retourne la "data"
        default:
            return state;
    }
}