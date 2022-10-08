import axios from 'axios';

// les actions "posts"
export const GET_POSTS = "GET_POSTS";
export const GET_ALL_POSTS = "GET_ALL_POSTS";
export const ADD_POST = "ADD_POST";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";

// les actions "comments"
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

// les tendances
export const GET_TRENDS = "GET_TRENDS";

// la gestion des "errors" de "post"
export const GET_POST_ERRORS = "GET_POST_ERRORS";

// on récupère les "posts"
export const getPosts = (num) => {
    return (dispatch) => {
        return axios  // requête pour touts les "posts"
            .get("http://localhost:8000/api/post/")
            .then((res) => { // puis "dispatch" dans le store
                const array = res.data.slice(0, num) // on déclare dans un [] les 5 premiers "post"
                dispatch({ type: GET_POSTS, payload: array }) // on transmet au "reducer" (redux) 
                dispatch({ type: GET_ALL_POSTS, payload: res.data }) // on transmet au "reducer" la totalité des "post" 
            })
            .catch((err) => console.log(err))
    }
};

// on implémente la logique pour ajouter un "post"
export const addPost = (data) => {
    return (dispatch) => {
        return axios // on passe les "data" via la méthode "post"
            .post("http://localhost:8000/api/post/", data)
            .then((res) => { // si dans "res" on a des "errors"
                if (res.data.errors) { // on traitera les actions via redux
                    dispatch({ type: GET_POST_ERRORS, payload: res.data.errors });
                } else { // on réinitialise le "store" 
                    dispatch({ type: GET_POST_ERRORS, payload: "" });
                }
            });
    };
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
                dispatch({ type: LIKE_POST, payload: { postId, userId } }); // on transmet au "reducer" (redux) 
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
            .then((res) => { // on transmet au "reducer" (redux) 
                dispatch({ type: UNLIKE_POST, payload: { postId, userId } });
            })
            .catch((err) => console.log(err));
    };
};

// on implémente la mise à jour du "text"
export const updatePost = (postId, message) => {
    return (dispatch) => {
        return axios({
            method: "put",
            url: `http://localhost:8000/api/post/${postId}`,
            data: { message },
        })
            .then((res) => { // on transmet au "reducer" (redux) 
                dispatch({ type: UPDATE_POST, payload: { message, postId } });
            })
            .catch((err) => console.log(err));
    };
};

// on implémente la suppression d'un "post"
export const deletePost = (postId) => {
    return (dispatch) => {
        return axios({
            method: "delete",
            url: `http://localhost:8000/api/post/${postId}`,
        })
            .then((res) => { // on transmet au "reducer" (redux) 
                dispatch({ type: DELETE_POST, payload: { postId } });
            })
            .catch((err) => console.log(err));
    };
};

// on implémente la logique du commentaire
export const addComment = (postId, commenterId, text, commenterPseudo) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: `http://localhost:8000/api/post/comment-post/${postId}`,
            data: { commenterId, text, commenterPseudo },
        })
            .then((res) => { // on transmet au "reducer" (redux) 
                dispatch({ type: ADD_COMMENT, payload: { postId } });
            })
            .catch((err) => console.log(err));
    };
};

// on implémente la logique pour modifier le commentaire
export const editComment = (postId, commentId, text) => {
    return (dispatch) => {
        return axios({
            method: "patch",
            url: `http://localhost:8000/api/post/edit-comment-post/${postId}`,
            data: { commentId, text },
        })
            .then((res) => { // on transmet au "reducer" (redux) 
                dispatch({ type: EDIT_COMMENT, payload: { postId, commentId, text } });
            })
            .catch((err) => console.log(err));
    };
};

// on implémente la logique pour supprimer un commentaire
export const deleteComment = (postId, commentId) => {
    return (dispatch) => {
        return axios({
            method: "patch", // on ne supprime le [] mais on met à jour
            url: `http://localhost:8000/api/post/delete-comment-post/${postId}`,
            data: { commentId },
        })
            .then((res) => { // on transmet au "reducer" (redux) 
                dispatch({ type: DELETE_COMMENT, payload: { postId, commentId } });
            })
            .catch((err) => console.log(err));
    };
};

// on implémente la logique pour stocker les 5 "posts" les plus likés
export const getTrends = (sortedArray) => {
    return (dispatch) => { // on met à disposition les "data"
        dispatch({ type: GET_TRENDS, payload: sortedArray });
    };
};