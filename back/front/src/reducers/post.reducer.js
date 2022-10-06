import {
    DELETE_COMMENT,
    DELETE_POST,
    EDIT_COMMENT,
    GET_POSTS,
    LIKE_POST,
    UNLIKE_POST,
    UPDATE_POST
} from "../actions/post.actions";

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
        case UPDATE_POST:
            return state.map((post) => { // touts les "post"
                if (post._id === action.payload.postId) { // on récupère le "post" du "userId"
                    return {
                        ...post, // on destructure
                        message: action.payload.message, // nouveau "text"
                    };
                } else return post;
            });
        case DELETE_POST: // on utilise "filter" pour ne pas garder celui du "payload"
            return state.filter((post) => post._id !== action.payload.postId);
        case EDIT_COMMENT: // on implémente la logique pour modifier le "comment"
            return state.map((post) => { // on récupère les "post"
                if (post._id === action.payload.postId) { // on identifie le "post" à modifier
                    return {
                        ...post, // on destructure
                        comments: post.comments.map((comment) => { // on identifie le "commentId"
                            if (comment._id === action.payload.commentId) {
                                return {
                                    ...comment, // on destructure
                                    text: action.payload.text, // on modifie le texte
                                };
                            } else { // on garde les autres "comment"
                                return comment;
                            }
                        }),
                    };
                } else return post; // on garde les autres "post"
            });
        case DELETE_COMMENT:
            return state.map((post) => { // on récupère les "post"
                if (post._id === action.payload.postId) { // on identifie le "post" à modifier
                    return {
                        ...post, // on destructure
                        comments: post.comments.filter( // on filtre celui qui est sélectionné
                            (comment) => comment._id !== action.payload.commentId
                        ),
                    };
                } else return post;
            });
        default:
            return state;
    }
}