import { GET_POST_ERRORS } from "../actions/post.actions";
import { GET_USER_ERRORS } from "../actions/user.actions";

const initialState = { userError: [], postError: [] }; // on stockera les "errors" dans un []


export default function errorReducer(state = initialState, action) {
    switch (action.type) {
        case GET_POST_ERRORS:
            return {
                postError: action.payload, // on récupère les "res" à traiter
                userError: []
            }
        case GET_USER_ERRORS:
            return {
                userError: action.payload, // on récupère les "res" à traiter
                postError: []
            }
        default:
            return state;
    }
}