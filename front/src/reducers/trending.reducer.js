import { GET_TRENDS } from "../actions/post.actions";

// on démarre avec un état vide qui sera incrémenté avec les "data"
const initialState = {};

export default function trendingReducer(state = initialState, action) {
    switch (action.type) {
        case GET_TRENDS:
            return action.payload; // on récupère les "data"
        default:
            return state;
    }
}
