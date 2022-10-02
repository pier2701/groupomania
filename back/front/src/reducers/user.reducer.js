import { FOLLOW_USER, GET_USER, UNFOLLOW_USER, UPDATE_BIO, UPLOAD_PICTURE } from "../actions/user.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER:
            return action.payload;
        case UPLOAD_PICTURE:
            return {
                ...state, // on destructure pour changer que "picture"
                picture: action.payload, // puis on remplace l'image
            };
        case UPDATE_BIO:
            return {
                ...state, // on destructure
                bio: action.payload, // puis on remplace la bio
            };
        case FOLLOW_USER:
            return {
                ...state, // on destructure
                following: [action.payload.idToFollow, ...state.following] // on ajoute au lieu d'écraser via "..."
            };
        case UNFOLLOW_USER:
            return {
                ...state, // on destructure
                following: state.following.filter( // on filtre les users, en gardant "idToFollow"
                    (id) => id !== action.payload.idToUnfollow),
            };
        default:
            return state;
    }
}