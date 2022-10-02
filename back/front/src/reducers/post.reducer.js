import { GET_POSTS, LIKE_POST, UNLIKE_POST } from "../actions/post.actions";

// on démarre avec un état vide qui sera incrémenté avec les "data"
const initialState = {};

export default function postReducer(state = initialState, action) {
    switch (action.type) { // on appelle "action" 
        case GET_POSTS:
            return action.payload; // on récupère les "data"
        case LIKE_POST:
            return state.map((post) => { // on retrouve le bon "post"
                if (post._id === action.payload.postId) {
                    return { // on incrémente [likers] ... à la suite
                        ...post, // on destructure
                        likers: [action.payload.userId, ...post.likers],
                    };
                }
                return post; // sinon on renvoie les "post"
            });
        case UNLIKE_POST:
            return state.map((post) => { // on retrouve le bon "post"
                if (post._id === action.payload.postId) {
                    return { // on flitre le [likers] pour retirer le "userId" de la requête
                        ...post, // on destructure
                        likers: post.likers.filter((id) => id !== action.payload.userId),
                    };
                }
                return post;
            });
        default:
            return state;
    }
}