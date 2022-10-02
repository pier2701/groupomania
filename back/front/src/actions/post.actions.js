import axios from 'axios';

// les actions "posts"
export const GET_POSTS = "GET_POSTS";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";

// on récupère les "posts"
export const getPosts = (num) => {
    return (dispatch) => {
        return axios  // requête pour touts les "posts"
            .get("http://localhost:8000/api/post/")
            .then((res) => { // puis "dispatch" dans le store
                const array = res.data.slice(0, num) // on déclare dans un [] les 5 premiers "post"
                dispatch({ type: GET_POSTS, payload: array })
            })
            .catch((err) => console.log(err))
    }
};

// on implémente la logique du "like"
export const likePost = (postId, userId) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: "http://localhost:8000/api/post/like/" + postId,
            data: { id: userId },
        })
            .then((res) => { // on redistribue le "payload"
                dispatch({ type: LIKE_POST, payload: { postId, userId } });
            })
            .catch((err) => console.log(err));
    };
};

// on implémente la logique du "unlike"
export const unlikePost = (postId, userId) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: "http://localhost:8000/api/post/unlike/" + postId,
            data: { id: userId },
        })
            .then((res) => {
                dispatch({ type: UNLIKE_POST, payload: { postId, userId } });
            })
            .catch((err) => console.log(err));
    };
};