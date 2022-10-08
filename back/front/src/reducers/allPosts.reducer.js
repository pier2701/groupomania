import { GET_ALL_POSTS } from "../actions/post.actions";

// on déclare le "store"
const initialState = {};

export default function allPostsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_POSTS:
            return action.payload // on récupère la totalité des "post"
        default:
            return state;
    }
}